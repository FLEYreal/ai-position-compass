import { cn } from '@/shared/lib';
import { useEffect, useRef, type ReactNode } from 'react';
import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/shared/ui';

export function QuestionnaireStatus({
    heading,
    description,
    centered = false,
    children,
}: {
    heading: string;
    description?: string;
    centered?: boolean;
    children: ReactNode;
}) {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <section
            className={cn(
                'mx-auto max-w-2xl rounded-[var(--radius-panel)] border border-border bg-card p-[clamp(20px,4vw,42px)]',
                centered && 'text-center',
            )}
        >
            <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-heading text-[length:var(--font-size-title)] font-medium focus:outline-none"
            >
                {heading}
            </h2>
            {description && (
                <p
                    className={cn(
                        'mt-2 max-w-[52ch] text-sm',
                        centered && 'mx-auto',
                    )}
                >
                    {description}
                </p>
            )}
            <div
                className={cn(
                    'mt-5 flex flex-wrap items-center gap-3',
                    centered && 'justify-center',
                )}
            >
                {children}
            </div>
        </section>
    );
}

export function QuestionnaireConfirmation({
    label,
    heading,
    description,
    confirmation,
    closeLabel,
    cancelLabel,
    onConfirm,
}: {
    label: string;
    heading: string;
    description: string;
    confirmation: string;
    closeLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="max-w-full whitespace-normal"
                >
                    {label}
                </Button>
            </DialogTrigger>
            <DialogContent closeLabel={closeLabel}>
                <DialogTitle>{heading}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
                <DialogFooter closeLabel={closeLabel}>
                    <DialogClose asChild>
                        <Button variant="outline">{cancelLabel}</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            onClick={onConfirm}
                            className="whitespace-normal"
                        >
                            {confirmation}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
