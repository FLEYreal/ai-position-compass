import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '@/shared/lib';

const halftoneTile = `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#221d17">
        <circle cx="5" cy="5" r="3.1"/>
        <circle cx="15" cy="15" r="3.1"/>
    </svg>`,
)}`;

/** Applies the same warm ink and halftone to a raster source or SVG children. */
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
                <filter
                    id={id}
                    primitiveUnits="objectBoundingBox"
                    colorInterpolationFilters="sRGB"
                >
                    <feColorMatrix type="saturate" values=".45" />
                    <feComponentTransfer result="warmPrint">
                        <feFuncR type="linear" slope=".67" intercept=".27" />
                        <feFuncG type="linear" slope=".65" intercept=".235" />
                        <feFuncB type="linear" slope=".64" intercept=".18" />
                    </feComponentTransfer>
                    {/* Dark source pixels take more ink. The final composite preserves the cutout. */}
                    <feColorMatrix
                        in="SourceGraphic"
                        type="matrix"
                        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.2126 -.7152 -.0722 0 1"
                    />
                    <feComponentTransfer result="inkCoverage">
                        <feFuncA type="linear" slope="1.05" intercept="-.12" />
                    </feComponentTransfer>
                    <feImage
                        href={halftoneTile}
                        x="0"
                        y="0"
                        width=".018"
                        height=".021"
                        preserveAspectRatio="xMidYMid meet"
                    />
                    <feTile />
                    <feComposite operator="in" in2="inkCoverage" />
                    <feComposite operator="atop" in2="warmPrint" />
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
