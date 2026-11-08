import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib';
import { PaletteContext, paletteAliases } from './palette-context';

/** Supply Tailwind utilities defining --ui-ink and --ui-surface from design tokens. */
export function UiPalette({
    paletteClassName,
    className,
    children,
    ...props
}: ComponentProps<'div'> & { paletteClassName: string }) {
    const palette =
        paletteClassName ? cn(paletteAliases, paletteClassName) : '';
    return (
        <PaletteContext value={palette}>
            <div className={cn(palette, className)} {...props}>
                {children}
            </div>
        </PaletteContext>
    );
}
