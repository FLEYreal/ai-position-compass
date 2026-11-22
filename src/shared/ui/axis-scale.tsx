import { cn } from '@/shared/lib';
import { Ruler } from './ruler';
import { AxisUndefined } from './axis-undefined';

export function AxisScale({
    value,
    label,
    lowLabel,
    highLabel,
    annotation,
    undefinedLabel,
    valueText,
    className,
}: {
    value: number | null;
    label: string;
    lowLabel: string;
    highLabel: string;
    annotation?: string;
    undefinedLabel: string;
    valueText?: string;
    className?: string;
}) {
    const coordinate =
        value == null || !Number.isFinite(value) ?
            null
        :   Math.max(0, Math.min(100, value));
    return (
        <div
            className={cn(
                'grid min-w-0 grid-cols-2 items-end gap-x-4 text-ring sm:grid-cols-[minmax(0,110px)_minmax(0,1fr)_minmax(0,150px)]',
                className,
            )}
        >
            <span className="row-start-2 min-w-0 text-sm text-muted-foreground italic sm:row-start-1 sm:pb-6 sm:text-right">
                {lowLabel}
            </span>
            <div className="col-span-2 col-start-1 row-start-1 min-w-0 px-4 sm:col-span-1 sm:col-start-2">
                {coordinate == null ?
                    <div
                        className={cn(
                            'flex h-[75px] items-end pb-4',
                            annotation && 'h-[109px]',
                        )}
                    >
                        <AxisUndefined
                            label={valueText ?? label}
                            message={undefinedLabel}
                            className="w-full"
                        />
                    </div>
                :   <>
                        <meter
                            className="sr-only"
                            min="0"
                            max="100"
                            value={coordinate}
                            aria-label={label}
                            aria-valuetext={`${valueText ?? `${coordinate} / 100`} · ${lowLabel} — ${highLabel}`}
                        />
                        <Ruler
                            value={coordinate}
                            variant="coordinate"
                            labels={['0', '100']}
                            annotation={annotation}
                        />
                    </>
                }
            </div>
            <span className="col-start-2 row-start-2 min-w-0 text-right text-sm text-muted-foreground italic sm:col-start-3 sm:row-start-1 sm:pb-6 sm:text-left">
                {highLabel}
            </span>
        </div>
    );
}
