import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/shared/lib';

/** Applies the archive print treatment to a raster source or SVG children. */
export function EditorialPrint({
    src,
    children,
    label,
    className,
    ...props
}: Omit<ComponentProps<'svg'>, 'children'> & {
    src?: string;
    children?: ReactNode;
    label?: string;
}) {
    const id = `editorial-print-${useId().replaceAll(':', '')}`;
    return (
        <svg
            className={cn('block w-full overflow-visible', className)}
            role={label ? 'img' : undefined}
            aria-label={label}
            aria-hidden={label ? undefined : true}
            {...props}
        >
            <defs>
                <filter id={id} colorInterpolationFilters="sRGB">
                    <feColorMatrix type="saturate" values=".45" />
                    <feComponentTransfer>
                        <feFuncR type="linear" slope=".67" intercept=".27" />
                        <feFuncG type="linear" slope=".65" intercept=".235" />
                        <feFuncB type="linear" slope=".64" intercept=".18" />
                    </feComponentTransfer>
                </filter>
            </defs>
            <g filter={`url(#${id})`}>
                {src ?
                    <image
                        href={src}
                        width="100%"
                        height="100%"
                        preserveAspectRatio="xMidYMid slice"
                    />
                :   children}
            </g>
        </svg>
    );
}
