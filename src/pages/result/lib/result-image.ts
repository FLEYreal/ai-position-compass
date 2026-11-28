import { projectName, type Language } from '@/shared/config';
import { axisNodes } from '@/shared/ui';
import type { Messages } from '../i18n';
import type {
    ResultAxis,
    ResultCamp,
    ResultPresentation,
} from '../model/result-presentation';
import { downloadBlob } from './download-blob';

const size = 1400;
const margin = 70;
const columnWidth = 570;
const innerWidth = size - margin * 2;
const rightEdge = size - margin;
const rightColumn = rightEdge - columnWidth;
const coreRowHeight = 110;
const developerRowHeight = 96;
const comparisonsRuleY = 1240;

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

function imageHeadings(copy: Messages) {
    return [
        copy['share.imageValues'],
        copy['share.imageBeliefs'],
        copy['result.developer.heading'],
    ].map((label) => label.toUpperCase());
}

async function loadFonts({ result, copy, projectUrl }: DrawResultImage) {
    const allAxes = [
        ...result.values,
        ...result.beliefs,
        ...(result.developer?.axes ?? []),
    ];
    const headingText = [
        projectName.toUpperCase(),
        ...result.coreCamps.map(({ name }) => name.toUpperCase()),
        copy['share.imageTitle'].toUpperCase(),
        ...imageHeadings(copy),
        '0123456789.%',
    ].join(' ');
    const bodyText = [
        headingText,
        projectUrl,
        ...allAxes.flatMap(({ label, low, high }) => [label, low, high]),
        ...result.coreCamps.flatMap((camp) => [camp.description, names(camp)]),
        copy['result.lowMatch.heading'],
        copy['result.noEligible.heading'],
        copy['result.similarityLabel'].toUpperCase(),
        copy['result.relatedVoices'],
        copy['result.undefined'],
        copy['share.imagePrivacy'],
        '0123456789.% · —',
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
    const primary =
        result.coreCamps[0]?.close ? result.coreCamps[0] : undefined;
    const neighbors = primary ? result.coreCamps.slice(1) : result.coreCamps;
    const campInks = new Map(
        result.coreCamps.map((camp) => [
            camp.id,
            token(`--camp-${camp.token}-ink`),
        ]),
    );
    const paper = token('--share-paper');
    const ink = token('--share-ink');
    const muted = token('--share-muted');
    const rule = token('--share-rule');
    const tick = token('--share-tick');
    const accent = primary ? campInks.get(primary.id)! : ink;
    const openingPaper = token(
        primary ? `--camp-${primary.token}-surface` : '--paper-raised',
    );
    const developerInk = token('--share-developer-ink');
    const axes = [
        ...result.values,
        ...result.beliefs,
        ...(result.developer?.axes ?? []),
    ];
    const [mascot, coloredIcons] = await Promise.all([
        loadImage(`${import.meta.env.BASE_URL}favicon.svg`),
        Promise.all(
            axes.map(async (axis) => {
                const color = token(`--axis-${axis.token}`);
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
        const valueFont = serif(score === null ? 22 : 24);
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

        const barY = y + 18;
        const barHeight = 11;
        ctx.beginPath();
        ctx.roundRect(x, barY, columnWidth, barHeight, barHeight / 2);
        ctx.fillStyle = tick;
        ctx.fill();
        if (score !== null && score > 0) {
            ctx.beginPath();
            ctx.roundRect(
                x,
                barY,
                (columnWidth * score) / 100,
                barHeight,
                barHeight / 2,
            );
            ctx.fillStyle = color;
            ctx.fill();
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

    function drawOpening() {
        ctx.drawImage(mascot, margin, 28, 45, 45);
        text(projectName.toUpperCase(), 128, 61, {
            font: heading(29),
            color: accent,
            width: 425,
        });
        text(projectUrl, rightEdge, 61, {
            font: serif(20),
            color: accent,
            align: 'right',
            width: 725,
        });
        line(margin, 88, innerWidth, accent);

        const title = primary?.name ?? copy['share.imageTitle'];
        const firstBaseline = 170;
        const titleEnd = wrapped(
            title.toUpperCase(),
            margin,
            firstBaseline,
            primary ? innerWidth - 270 : innerWidth,
            77,
            heading(80),
            accent,
        );
        if (primary) {
            const scoreBaseline = (firstBaseline + titleEnd) / 2 + 16;
            text(`${primary.score}%`, rightEdge, scoreBaseline, {
                font: heading(88),
                color: accent,
                align: 'right',
                width: 248,
            });
            text(
                copy['result.similarityLabel'].toUpperCase(),
                rightEdge,
                scoreBaseline + 32,
                { font: serif(18), color: accent, align: 'right', width: 248 },
            );
            const descriptionEnd = wrapped(
                primary.description,
                margin,
                Math.max(titleEnd + 46, scoreBaseline + 62),
                innerWidth - 220,
                29,
                serif(23),
            );
            if (!primary.voices.length) return descriptionEnd;

            return wrapped(
                `${copy['result.relatedVoices']}: ${names(primary)}`,
                margin,
                descriptionEnd + 33,
                innerWidth,
                24,
                serif(20),
                accent,
            );
        }

        const notice =
            neighbors.length ?
                copy['result.lowMatch.heading']
            :   copy['result.noEligible.heading'];
        return wrapped(
            notice,
            margin,
            titleEnd + 52,
            innerWidth,
            30,
            serif(25),
        );
    }

    function drawComparisons() {
        if (!neighbors.length) return;

        line(margin, comparisonsRuleY, innerWidth);
        const gap = 45;
        const width =
            neighbors.length === 3 ? (innerWidth - gap * 2) / 3 : columnWidth;
        const columnStep =
            neighbors.length === 3 ? width + gap : rightColumn - margin;
        const firstBaseline = comparisonsRuleY + 39;
        neighbors.forEach((camp, index) => {
            const x = margin + index * columnStep;
            const color = campInks.get(camp.id)!;
            const scoreLabel = `${camp.score}%`;
            const scoreFont = heading(26);
            ctx.font = scoreFont;
            const scoreWidth = ctx.measureText(scoreLabel).width;
            const end = wrapped(
                camp.name.toUpperCase(),
                x,
                firstBaseline,
                width - scoreWidth - 12,
                27,
                heading(25),
                color,
            );
            text(scoreLabel, x + width, firstBaseline, {
                font: scoreFont,
                color,
                align: 'right',
            });
            if (camp.voices.length) {
                wrapped(names(camp), x, end + 28, width, 21, serif(18), color);
            }
        });
    }

    // Draw the header wash beneath the text once its localized height is known.
    const openingEnd = drawOpening();
    const openingBottom = Math.max(355, openingEnd + 23);
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = openingPaper;
    ctx.fillRect(0, 0, size, openingBottom);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();

    const [valuesHeading, beliefsHeading, developerHeading] =
        imageHeadings(copy);
    const groupBaseline = openingBottom + 45;
    const firstAxisBaseline = groupBaseline + 50;
    text(valuesHeading, margin, groupBaseline, {
        font: heading(28),
        color: accent,
        width: columnWidth,
    });
    text(beliefsHeading, rightColumn, groupBaseline, {
        font: heading(28),
        color: accent,
        width: columnWidth,
    });
    result.values.forEach((axis, index) =>
        drawAxis(axis, margin, firstAxisBaseline + index * coreRowHeight),
    );
    result.beliefs.forEach((axis, index) =>
        drawAxis(axis, rightColumn, firstAxisBaseline + index * coreRowHeight),
    );

    const developerBaseline =
        firstAxisBaseline + result.values.length * coreRowHeight - 15;
    if (result.developer) {
        text(developerHeading, margin, developerBaseline, {
            font: heading(24),
            color: developerInk,
            width: columnWidth,
        });
        result.developer.axes.forEach((axis, index) =>
            drawAxis(
                axis,
                margin,
                developerBaseline + 45 + index * developerRowHeight,
                true,
            ),
        );
    } else {
        wrapped(
            copy['result.developer.skipped'],
            margin,
            developerBaseline + 128,
            columnWidth,
            41,
            handwritten(35),
            muted,
        );
    }

    drawComparisons();
    text(copy['share.imagePrivacy'], margin, 1370, {
        font: serif(17),
        color: muted,
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((image) => {
            if (image) resolve(image);
            else reject(new Error('Canvas produced no image'));
        }, 'image/png');
    });
    downloadBlob(blob, `ai-position-compass-${language}.png`);
}
