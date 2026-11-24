import { useId, type ReactElement } from 'react';
import { Popover } from 'radix-ui';

export function AxisExplanation({
    label,
    description,
    children,
}: {
    label: string;
    description: string;
    children: ReactElement;
}) {
    const titleId = useId();
    const descriptionId = useId();

    return (
        <Popover.Root>
            <Popover.Trigger asChild>{children}</Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    aria-labelledby={titleId}
                    aria-describedby={descriptionId}
                    align="start"
                    sideOffset={8}
                    collisionPadding={16}
                    className="z-40 w-[min(19rem,var(--radix-popover-content-available-width))] rounded-[10px] border border-border bg-popover px-4 py-3 text-popover-foreground shadow-lg"
                >
                    <p id={titleId} className="text-sm font-semibold">
                        {label}
                    </p>
                    <p
                        id={descriptionId}
                        className="mt-1 text-sm leading-relaxed"
                    >
                        {description}
                    </p>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
