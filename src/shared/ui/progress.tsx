'use client';

import * as React from 'react';
import { cn } from '@/shared/lib';
import { Progress as ProgressPrimitive } from 'radix-ui';

function Progress({
    className,
    value,
    max = 100,
    children,
    ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
    const limit = Number.isFinite(max) && max > 0 ? max : 100;
    const percent =
        value == null ? 0 : Math.max(0, Math.min(100, (value / limit) * 100));
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            value={value}
            max={limit}
            className={cn(
                'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
                className,
            )}
            {...props}
        >
            {children ?? (
                <ProgressPrimitive.Indicator asChild>
                    <svg
                        data-slot="progress-indicator"
                        className="block h-full w-full text-primary"
                        aria-hidden="true"
                    >
                        <rect
                            width={`${percent}%`}
                            height="100%"
                            fill="currentColor"
                        />
                    </svg>
                </ProgressPrimitive.Indicator>
            )}
        </ProgressPrimitive.Root>
    );
}

export { Progress };
