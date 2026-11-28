import { ArrowUpRight } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import type { Messages as CommonMessages } from '@/shared/i18n';
import {
    AxisExplanation,
    AxisIcon,
    AxisScale,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/shared/ui';
import type { Messages } from '../i18n';
import type { ResultAxis, ResultCamp } from '../model/result-presentation';
import { campPalette } from './camp-palette';

export function CampSimilarity({
    camp,
    copy,
    prominent = false,
}: {
    camp: ResultCamp;
    copy: Messages;
    prominent?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Tooltip open={open} onOpenChange={setOpen}>
            <TooltipTrigger
                type="button"
                className="inline-flex min-h-6 cursor-help items-baseline gap-2 text-(--result-camp-ink) tabular-nums"
                onClick={(event) => {
                    // Radix handles hover and focus. Keep the tip open on tap.
                    event.preventDefault();
                    setOpen(true);
                }}
            >
                <span className="sr-only">
                    {prominent && `${copy['result.primary']}. `}
                    {camp.similarity}
                </span>
                <strong
                    aria-hidden="true"
                    className={
                        prominent ?
                            'text-3xl leading-none font-medium underline decoration-dotted decoration-1 underline-offset-4 sm:text-4xl'
                        :   'text-base leading-none font-medium underline decoration-dotted decoration-1 underline-offset-4'
                    }
                >
                    {camp.score}%
                </strong>
                <span
                    aria-hidden="true"
                    className="text-[length:var(--font-size-technical)] tracking-wide uppercase"
                >
                    {copy['result.similarityLabel']}
                </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" collisionPadding={12}>
                {copy['result.similarityExplanation']}
            </TooltipContent>
        </Tooltip>
    );
}

export function CampVoices({
    camp,
    copy,
}: {
    camp: ResultCamp;
    copy: Messages;
}) {
    if (camp.voices.length === 0) return null;

    const additionalSources = camp.voices.flatMap(({ name, sources }) =>
        sources.slice(1).map((href) => ({
            href,
            name,
            host: new URL(href).hostname.replace(/^www\./, ''),
        })),
    );

    return (
        <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
                {copy['result.relatedVoices']}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {camp.voices.map(({ id, name, sources }) => (
                    <li key={id}>
                        <a
                            href={sources[0]}
                            className="inline-flex items-center gap-1 border-b border-current pb-0.5 text-(--result-camp-ink) hover:text-foreground"
                        >
                            {name} <ArrowUpRight aria-hidden="true" size={12} />
                        </a>
                    </li>
                ))}
            </ul>
            {additionalSources.length > 0 && (
                <details className="pt-2 text-xs text-muted-foreground">
                    <summary className="w-fit cursor-pointer">
                        {copy['result.references']}
                    </summary>
                    <ul className="ml-4 mt-2 space-y-1.5">
                        {additionalSources.map(({ href, name, host }) => (
                            <li key={`${name}:${href}`}>
                                <a
                                    className="break-words underline underline-offset-4 hover:text-foreground"
                                    href={href}
                                >
                                    {name} · {host}
                                </a>
                            </li>
                        ))}
                    </ul>
                </details>
            )}
        </div>
    );
}

export function CampComparisons({
    camps,
    heading,
    caption,
    start = 1,
    copy,
}: {
    camps: ResultCamp[];
    heading: string;
    caption?: string;
    start?: number;
    copy: Messages;
}) {
    if (camps.length === 0) return null;
    return (
        <section className="space-y-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b pb-2">
                <h3 className="font-heading text-[length:var(--font-size-headline)] leading-tight text-[var(--result-camp-ink,var(--ink))] uppercase">
                    {heading}
                </h3>
                {caption && (
                    <p className="text-xs text-muted-foreground italic">
                        {caption}
                    </p>
                )}
            </div>
            <ol
                start={start}
                className="grid gap-4 min-[561px]:grid-cols-2 min-[1000px]:gap-6"
            >
                {camps.map((camp, index) => (
                    <li
                        key={camp.id}
                        style={campPalette(camp)}
                        className="flex min-w-0 flex-col rounded-xl bg-(--result-camp-surface) px-5 py-5 sm:px-6"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <span
                                aria-hidden="true"
                                className="text-[length:var(--font-size-technical)] text-muted-foreground tabular-nums"
                            >
                                {String(start + index).padStart(2, '0')}
                            </span>
                            <CampSimilarity camp={camp} copy={copy} />
                        </div>
                        <h4 className="mb-3 font-heading text-[length:var(--font-size-title)] leading-tight text-(--result-camp-ink) uppercase">
                            {camp.name}
                        </h4>
                        <p className="flex-1 text-sm leading-relaxed">
                            {camp.description}
                        </p>
                        {camp.voices.length > 0 && (
                            <div className="mt-5 pt-4">
                                <CampVoices camp={camp} copy={copy} />
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </section>
    );
}

export function AxisGroup({
    heading,
    axes,
    copy,
    axisDescriptions,
    annotate = false,
}: {
    heading: string;
    axes: ResultAxis[];
    copy: Messages;
    axisDescriptions: CommonMessages['axisDescriptions'];
    annotate?: boolean;
}) {
    const [title, note] = heading.split(' — ', 2);
    return (
        <section>
            <h3 className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b pb-2 font-heading text-[length:var(--font-size-headline)] leading-tight text-[var(--result-camp-ink,var(--ink))]">
                <span className="uppercase">{title}</span>
                {note && (
                    <span className="font-sans text-xs font-normal text-muted-foreground">
                        <span className="sr-only"> — </span>
                        {note}
                    </span>
                )}
            </h3>
            <AxisList
                axes={axes}
                copy={copy}
                axisDescriptions={axisDescriptions}
                annotate={annotate}
            />
        </section>
    );
}

export function AxisList({
    axes,
    copy,
    axisDescriptions,
    annotate = false,
    showConstruct = false,
}: {
    axes: ResultAxis[];
    copy: Messages;
    axisDescriptions: CommonMessages['axisDescriptions'];
    annotate?: boolean;
    showConstruct?: boolean;
}) {
    return (
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
                    <div className="min-[850px]:pb-5">
                        <AxisExplanation
                            label={axis.label}
                            description={axisDescriptions[axis.id]}
                        >
                            <button
                                type="button"
                                className="group inline-flex min-h-7 min-w-0 cursor-pointer items-center gap-2.5 rounded text-start font-sans text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                            >
                                <span className="grid size-7 shrink-0 place-items-center rounded border border-current bg-[color-mix(in_srgb,var(--result-axis-ink)_8%,transparent)] text-(--result-axis-ink) group-hover:bg-[color-mix(in_srgb,var(--result-axis-ink)_16%,transparent)]">
                                    <AxisIcon axis={axis.id} size={16} />
                                </span>
                                <span className="underline-offset-4 group-hover:underline group-aria-expanded:underline">
                                    {axis.label}
                                </span>
                            </button>
                        </AxisExplanation>
                        {showConstruct && (
                            <p className="ms-[2.375rem] mt-0.5 text-xs text-muted-foreground">
                                {copy[`result.axis.${axis.construct}`]}
                            </p>
                        )}
                    </div>
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
                        className="text-[var(--result-camp-ink,var(--ink))]"
                    />
                </li>
            ))}
        </ul>
    );
}
