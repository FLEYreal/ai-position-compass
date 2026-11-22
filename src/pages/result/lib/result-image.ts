import { projectName, type Language } from '@/shared/config';
import { axisNodes } from '@/shared/ui';
import type { Messages } from '../i18n';
import type {
    ResultAxis,
    ResultCamp,
    ResultPresentation,
} from '../model/result-presentation';

const size = 1400;
const margin = 70;
const columnWidth = 570;
const rightColumn = size - margin - columnWidth;
const innerWidth = size - margin * 2;

const heading = (size: number) => `600 ${size}px "Oswald Variable"`;
const serif = (size: number) => `400 ${size}px "Noto Serif Variable"`;
const handwritten = (size: number) => `500 ${size}px "Caveat Variable"`;

export class ResultImageFontError extends Error {}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () =>
            reject(new Error('Result image asset could not be loaded'));
        image.src = src;
    });
}

function loadAxisIcon(id: ResultAxis['id'], color: string) {
    const nodes = axisNodes[id].map(([tag, attributes]) => {
        const attrs = Object.entries(attributes)
            .filter(([name]) => name !== 'key')
            .map(([name, value]) => `${name}="${value}"`)
            .join(' ');
        return `<${tag} ${attrs}/>`;
    });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${nodes.join('')}</svg>`;
    return loadImage(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    );
}

type DrawText = {
    font: string;
    color?: string;
    align?: CanvasTextAlign;
    width?: number;
};

type DrawResultImage = {
    result: ResultPresentation;
    copy: Messages;
    projectUrl: string;
};

const names = (camp: ResultCamp) =>
    camp.voices.map(({ name }) => name).join(' · ');

async function loadFonts({ result, copy, projectUrl }: DrawResultImage) {
    const allAxes = [
        ...result.values,
        ...result.beliefs,
        ...(result.developer?.axes ?? []),
    ];
    const allCamps = [...result.coreCamps, ...(result.developer?.camps ?? [])];
    const campNames = allCamps.map(({ name }) => name).join(' ');
    const headingText = [
        projectName.toUpperCase(),
        campNames,
        copy['share.imageTitle'],
        copy['result.values.heading'],
        copy['result.beliefs.heading'],
        copy['result.developer.heading'],
        copy['result.matches.heading'],
    ].join(' ');
    const bodyText = [
        headingText,
        projectUrl,
        ...allAxes.flatMap(({ label, low, high }) => [label, low, high]),
        ...allCamps.flatMap((camp) => [
            camp.description,
            camp.similarity,
            names(camp),
        ]),
        copy['result.lowMatch.heading'],
        copy['result.noEligible.heading'],
        copy['result.undefined'],
        copy['footer.disclaimer'],
        copy['share.imagePrivacy'],
        '0123456789% · —',
    ].join(' ');

    try {
        const faces = await Promise.all([
            document.fonts.load(heading(26), headingText),
            document.fonts.load(serif(22), bodyText),
            document.fonts.load(
                handwritten(28),
                `${copy['result.youAreHere']} ${copy['result.developer.skipped']}`,
            ),
        ]);
        if (faces.some((loaded) => loaded.length === 0)) {
            throw new Error('Missing result font');
        }
    } catch (error) {
        throw new ResultImageFontError(
            'Result image fonts could not be loaded',
            { cause: error },
        );
    }
}

export async function saveResultImage({
    result,
    copy,
    projectUrl,
    language,
}: DrawResultImage & { language: Language }) {
    const tokenStyles = getComputedStyle(document.documentElement);
    const token = (name: string) => tokenStyles.getPropertyValue(name).trim();
    const paper = token('--share-paper');
    const ink = token('--share-ink');
    const muted = token('--share-muted');
    const rule = token('--share-rule');
    const tick = token('--share-tick');
    const accent = token('--share-accent');
    const axes = [
        ...result.values,
        ...result.beliefs,
        ...(result.developer?.axes ?? []),
    ];
    const [mascot, coloredIcons] = await Promise.all([
        loadImage(`${import.meta.env.BASE_URL}favicon.svg`),
        Promise.all(
            axes.map(async (axis) => {
                const color = token(`--axis-${axis.token}-light`);
                return [
                    axis.id,
                    { color, icon: await loadAxisIcon(axis.id, color) },
                ] as const;
            }),
        ),
        loadFonts({ result, copy, projectUrl }),
    ]);
    const icons = new Map(coloredIcons);

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable');
    const ctx = context;

    function text(
        value: string,
        x: number,
        y: number,
        { font, color = ink, align = 'left', width = innerWidth }: DrawText,
    ) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.fillText(value, x, y, width);
    }

    function wrapped(
        value: string,
        x: number,
        y: number,
        width: number,
        lineHeight: number,
        font: string,
        color = ink,
        align: CanvasTextAlign = 'left',
    ) {
        ctx.font = font;
        let line = '';
        let baseline = y;
        for (const word of value.split(/\s+/)) {
            const extended = line ? `${line} ${word}` : word;
            if (line && ctx.measureText(extended).width > width) {
                text(line, x, baseline, { font, color, width, align });
                baseline += lineHeight;
                line = word;
            } else {
                line = extended;
            }
        }
        text(line, x, baseline, { font, color, width, align });
        return baseline;
    }

    function line(x: number, y: number, width: number, color = rule) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, width, 1);
    }

    function drawAxis(axis: ResultAxis, x: number, y: number, compact = false) {
        const { icon, color } = icons.get(axis.id)!;
        const { label, low, high, score } = axis;
        const valueLabel =
            score === null ? copy['result.undefined'] : `${score}%`;
        const valueFont = serif(compact ? 20 : 22);
        ctx.font = valueFont;
        const valueWidth = ctx.measureText(valueLabel).width;
        const annotated = score !== null && axis.id === 'regulation';
        const annotationSpace = annotated ? 20 : 0;
        ctx.drawImage(icon, x, y - 22, 27, 27);
        text(label, x + 40, y, {
            font: serif(compact ? 20 : 23),
            width: columnWidth - 60 - valueWidth - annotationSpace,
        });
        text(valueLabel, x + columnWidth, y, {
            font: valueFont,
            color: score === null ? muted : color,
            align: 'right',
        });

        const barY = y + 17;
        ctx.fillStyle = tick;
        ctx.fillRect(x, barY, columnWidth, 9);
        if (score !== null) {
            ctx.fillStyle = color;
            ctx.fillRect(x, barY, (columnWidth * score) / 100, 9);
        }

        const endpointFont = serif(17);
        const endpointWidth = (columnWidth - 22) / 2;
        wrapped(low, x, barY + 37, endpointWidth, 20, endpointFont, muted);
        wrapped(
            high,
            x + columnWidth,
            barY + 37,
            endpointWidth,
            20,
            endpointFont,
            muted,
            'right',
        );
        if (annotated) {
            const center = x + columnWidth - valueWidth / 2;
            const left = center - valueWidth / 2 - 10;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(
                center,
                y - 7,
                valueWidth / 2 + 10,
                17,
                -0.06,
                0,
                Math.PI * 2,
            );
            ctx.stroke();
            text(copy['result.youAreHere'], left - 36, y - 22, {
                font: handwritten(29),
                color,
                align: 'right',
                width: 235,
            });
            ctx.beginPath();
            ctx.moveTo(left - 29, y - 17);
            ctx.quadraticCurveTo(left - 22, y - 3, left - 5, y - 11);
            ctx.lineTo(left - 13, y - 13);
            ctx.moveTo(left - 5, y - 11);
            ctx.lineTo(left - 11, y - 6);
            ctx.stroke();
        }
    }

    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = token('--share-accent-surface');
    ctx.fillRect(0, 0, size, 363);
    ctx.drawImage(mascot, margin, 28, 45, 45);
    text(projectName.toUpperCase(), 128, 61, {
        font: heading(29),
        color: accent,
        width: 425,
    });
    text(projectUrl, size - margin, 61, {
        font: serif(20),
        color: accent,
        align: 'right',
        width: 725,
    });
    line(margin, 88, innerWidth, accent);

    const primary =
        result.coreCamps[0]?.close ? result.coreCamps[0] : undefined;
    const title = primary?.name ?? copy['share.imageTitle'];
    const titleEnd = wrapped(
        title,
        margin,
        166,
        innerWidth,
        66,
        heading(62),
        accent,
    );
    if (primary) {
        text(primary.similarity, margin, titleEnd + 48, {
            font: heading(32),
            color: accent,
        });
        const descriptionEnd = wrapped(
            primary.description,
            margin,
            titleEnd + 88,
            innerWidth,
            28,
            serif(23),
        );
        if (primary.voices.length) {
            text(names(primary), margin, descriptionEnd + 31, {
                font: serif(20),
                color: muted,
            });
        }
    } else {
        const notice =
            result.coreCamps.length ?
                copy['result.lowMatch.heading']
            :   copy['result.noEligible.heading'];
        wrapped(notice, margin, titleEnd + 51, innerWidth, 28, serif(25));
    }

    text(copy['result.values.heading'], margin, 416, {
        font: heading(29),
        width: columnWidth,
    });
    text(copy['result.beliefs.heading'], rightColumn, 416, {
        font: heading(29),
        width: columnWidth,
    });
    result.values.forEach((axis, index) =>
        drawAxis(axis, margin, 466 + index * 110),
    );
    result.beliefs.forEach((axis, index) =>
        drawAxis(axis, rightColumn, 466 + index * 110),
    );

    if (result.developer) {
        text(copy['result.developer.heading'], margin, 890, {
            font: heading(27),
            color: accent,
            width: columnWidth,
        });
        result.developer.axes.forEach((axis, index) =>
            drawAxis(axis, margin, 940 + index * 96, true),
        );
        if (result.developer.camps.length) {
            text(copy['result.matches.heading'], rightColumn, 1102, {
                font: heading(20),
                color: accent,
                width: columnWidth,
            });
        }
        result.developer.camps.forEach((camp, index) => {
            const y = 1132 + index * 26;
            text(camp.name, rightColumn, y, { font: heading(22), width: 350 });
            text(camp.similarity, size - margin, y, {
                font: serif(18),
                color: muted,
                align: 'right',
                width: 206,
            });
        });
    } else {
        wrapped(
            copy['result.developer.skipped'],
            margin,
            1030,
            columnWidth,
            41,
            handwritten(35),
            muted,
        );
    }

    const neighbors = primary ? result.coreCamps.slice(1) : result.coreCamps;
    if (neighbors.length) {
        line(margin, 1205, innerWidth);
        const gap = 35;
        const width =
            (innerWidth - gap * (neighbors.length - 1)) / neighbors.length;
        neighbors.forEach((camp, index) => {
            const x = margin + index * (width + gap);
            const end = wrapped(
                camp.name,
                x,
                1244,
                width,
                25,
                heading(24),
                accent,
            );
            text(camp.similarity, x, end + 26, { font: serif(19), width });
            if (camp.voices.length)
                text(names(camp), x, end + 51, {
                    font: serif(17),
                    color: muted,
                    width,
                });
        });
    }
    const hasVoices = result.coreCamps.some(({ voices }) => voices.length > 0);
    if (hasVoices) {
        text(copy['footer.disclaimer'], margin, 1342, {
            font: serif(16),
            color: muted,
        });
    }
    text(copy['share.imagePrivacy'], margin, 1373, {
        font: serif(17),
        color: muted,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((image) => {
            if (image) resolve(image);
            else reject(new Error('Canvas produced no image'));
        }, 'image/png');
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `ai-position-compass-${language}.png`;
    document.body.append(anchor);
    try {
        anchor.click();
    } finally {
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
}
