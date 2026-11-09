import { cn } from '@/shared/lib';

export function AxisUndefined({
    label,
    message = 'Axis is undefined',
    className,
}: {
    label: string;
    message?: string;
    className?: string;
}) {
    return (
        <div
            role="group"
            aria-label={label}
            className={cn(
                'flex min-h-8 min-w-0 items-center justify-center rounded-[var(--radius-field)] border border-border bg-muted px-2 text-center text-xs leading-tight text-muted-foreground',
                className,
            )}
        >
            <p>{message}</p>
        </div>
    );
}
