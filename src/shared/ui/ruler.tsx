import { cn } from '@/shared/lib';

/** Shared geometry. Semantics and wording belong to QuestionProgress/AxisScale. */
export function Ruler({
    value,
    variant,
    labels,
    annotation,
    className,
}: {
    value: number | null;
    variant: 'progress' | 'coordinate';
    labels: string[];
    annotation?: string;
    className?: string;
}) {
    const coordinate = variant === 'coordinate';
    const baseline =
        coordinate ?
            annotation ? 83
            :   49
        :   27;
    const height = baseline + 26;
    const divisions = coordinate ? 20 : 40;
    const majorEvery = 5;
    const position =
        value == null || !Number.isFinite(value) ?
            null
        :   Math.max(0, Math.min(100, value));
    const noteOnRight = position != null && position < 35;
    return (
        <svg
            width="100%"
            height={height}
            className={cn('block overflow-visible', className)}
            aria-hidden="true"
            data-slot="ruler"
        >
            {Array.from({ length: divisions + 1 }, (_, index) => (
                <line
                    key={index}
                    x1={`${(index / divisions) * 100}%`}
                    x2={`${(index / divisions) * 100}%`}
                    y1={baseline - (index % majorEvery === 0 ? 10 : 4)}
                    y2={baseline + (coordinate ? 4 : 0)}
                    className={
                        index % majorEvery === 0 ?
                            'stroke-foreground'
                        :   'stroke-border'
                    }
                    strokeWidth="1"
                />
            ))}
            <line
                x1="0"
                x2="100%"
                y1={baseline}
                y2={baseline}
                className="stroke-foreground"
                strokeWidth="1"
            />
            {!coordinate && position != null && (
                <rect
                    x="0"
                    y={baseline - 1}
                    width={`${position}%`}
                    height="3"
                    fill="currentColor"
                />
            )}
            {labels.map((text, index) => (
                <text
                    key={`${index}-${text}`}
                    x={`${(index / (labels.length - 1)) * 100}%`}
                    y={baseline + 21}
                    textAnchor={
                        index === 0 ? 'start'
                        : index === labels.length - 1 ?
                            'end'
                        :   'middle'
                    }
                    className={cn(
                        'fill-muted-foreground font-mono text-[length:var(--font-size-technical)]',
                        coordinate && 'hidden sm:block',
                    )}
                >
                    {text}
                </text>
            ))}
            {position != null && (
                <svg
                    x={`${position}%`}
                    width="1"
                    height={height}
                    className="overflow-visible"
                    data-slot="ruler-marker"
                    data-position={position}
                >
                    {coordinate ?
                        <>
                            <text
                                x="0"
                                y={baseline - 27}
                                textAnchor="middle"
                                className="fill-current font-[family-name:var(--font-body)] text-[length:var(--font-size-coordinate)]"
                            >
                                {position}
                            </text>
                            {annotation && (
                                <>
                                    <ellipse
                                        cx="0"
                                        cy={baseline - 33}
                                        rx="15"
                                        ry="15"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                    <text
                                        x={noteOnRight ? 40 : -120}
                                        y={baseline - 65}
                                        textAnchor={
                                            noteOnRight ? 'start' : 'start'
                                        }
                                        className="fill-current font-[family-name:var(--font-annotation)] text-[length:var(--font-size-annotation)]"
                                    >
                                        {annotation}
                                    </text>
                                    <path
                                        d={
                                            noteOnRight ?
                                                `M105 ${baseline - 61}C96 ${baseline - 34} 47 ${baseline - 56} 18 ${baseline - 41}M25 ${baseline - 42}L16 ${baseline - 39}L20 ${baseline - 50}`
                                            :   `M-95 ${baseline - 61}C-96 ${baseline - 34} -47 ${baseline - 56} -18 ${baseline - 41}M-25 ${baseline - 42}L-16 ${baseline - 39}L-20 ${baseline - 50}`
                                        }
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </>
                            )}
                            <path
                                d={`M-8 ${baseline - 14}L0 ${baseline - 3}L8 ${baseline - 14}Z`}
                                fill="currentColor"
                            />
                        </>
                    :   <path d="M-4 0L0 4L4 0Z" fill="currentColor" />}
                </svg>
            )}
        </svg>
    );
}
