import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { AxisIcon, AxisScale } from '@/shared/ui';
import type { Messages } from '../i18n';
import type { ResultAxis, ResultCamp } from '../model/result-presentation';
import { campPalette } from './camp-palette';

export function CampVoices({
    camp,
    copy,
    sourceLabel,
}: {
    camp: ResultCamp;
    copy: Messages;
    sourceLabel: string;
}) {
    if (camp.voices.length === 0) return null;

    return (
        <div className="mt-4 space-y-1 text-sm">
            <p className="font-semibold">{copy['result.relatedVoices']}</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
                {camp.voices.map(({ id, name, sources }) => (
                    <li
                        key={id}
                        className="inline-flex flex-wrap items-center gap-x-2"
                    >
                        <a
                            href={sources[0]}
                            className="inline-flex items-center gap-1 underline underline-offset-4"
                        >
                            {name} <ArrowUpRight aria-hidden="true" size={13} />
                        </a>
                        {sources.slice(1).map((href, index) => (
                            <a
                                key={href}
                                href={href}
                                aria-label={`${name} · ${sourceLabel} ${index + 2}`}
                                className="underline underline-offset-4"
                            >
                                {index + 2}
                            </a>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function CampComparisons({
    camps,
    heading,
    copy,
    sourceLabel,
}: {
    camps: ResultCamp[];
    heading: string;
    copy: Messages;
    sourceLabel: string;
}) {
    if (camps.length === 0) return null;
    return (
        <section className="space-y-4 border-t pt-4">
            <h3 className="font-heading text-2xl">{heading}</h3>
            <ul className="grid gap-3 min-[720px]:grid-cols-[repeat(auto-fit,minmax(215px,1fr))]">
                {camps.map((camp) => (
                    <li
                        key={camp.id}
                        style={campPalette(camp)}
                        className="min-w-0 space-y-2 rounded-xl bg-(--result-camp-surface) px-5 py-4 sm:px-6 sm:py-5"
                    >
                        <h4 className="font-heading text-[clamp(1.5rem,2.6vw,2rem)] leading-tight text-(--result-camp-ink) text-balance">
                            {camp.name}
                        </h4>
                        <p className="text-sm font-semibold text-(--result-camp-ink) tabular-nums">
                            {camp.similarity}
                        </p>
                        <p className="text-sm leading-relaxed">
                            {camp.description}
                        </p>
                        <CampVoices
                            camp={camp}
                            copy={copy}
                            sourceLabel={sourceLabel}
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}

export function AxisGroup({
    heading,
    axes,
    copy,
    annotate = false,
}: {
    heading: string;
    axes: ResultAxis[];
    copy: Messages;
    annotate?: boolean;
}) {
    return (
        <section>
            <h3 className="border-b pb-3 font-heading text-[clamp(1.35rem,3vw,2rem)] leading-tight">
                {heading}
            </h3>
            <ul className="divide-y divide-border">
                {axes.map((axis) => (
                    <li
                        key={axis.id}
                        style={
                            {
                                '--result-axis-ink': `var(--axis-${axis.token})`,
                            } as CSSProperties
                        }
                        className="grid min-w-0 items-end gap-y-2 py-3 min-[850px]:grid-cols-[minmax(160px,1fr)_minmax(0,4fr)] min-[850px]:gap-x-5"
                    >
                        <h4 className="flex items-center gap-2.5 font-sans text-base font-semibold min-[850px]:pb-5">
                            <AxisIcon
                                axis={axis.id}
                                className="shrink-0 text-(--result-axis-ink)"
                            />
                            {axis.label}
                        </h4>
                        <AxisScale
                            value={axis.score}
                            label={axis.label}
                            lowLabel={axis.low}
                            highLabel={axis.high}
                            undefinedLabel={copy['result.undefined']}
                            valueText={
                                axis.score === null ?
                                    copy['result.axisUndefined'].replace(
                                        '{axis}',
                                        axis.label,
                                    )
                                :   copy['result.axisPosition']
                                        .replace('{axis}', axis.label)
                                        .replace('{score}', String(axis.score))
                            }
                            annotation={
                                (
                                    annotate &&
                                    axis.id === 'regulation' &&
                                    axis.score !== null
                                ) ?
                                    copy['result.youAreHere']
                                :   undefined
                            }
                            className={
                                axis.core ?
                                    'text-(--camp-cautious-builders-ink)'
                                :   'text-(--camp-vibe-coders-ink)'
                            }
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}
