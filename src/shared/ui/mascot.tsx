import { useId } from 'react';

export function Mask({
    className = '',
    small = false,
}: {
    className?: string;
    small?: boolean;
}) {
    const id = useId().replaceAll(':', '');
    return (
        <svg
            className={className}
            viewBox="0 0 340 340"
            fill="none"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${id}-paper`} cx=".35" cy=".25" r=".8">
                    <stop stopColor="#f7f3e9" />
                    <stop offset="1" stopColor="#dcd6c8" />
                </radialGradient>
                <pattern
                    id={`${id}-dots`}
                    width="3.8"
                    height="3.8"
                    patternUnits="userSpaceOnUse"
                >
                    <circle
                        cx="1"
                        cy="1"
                        r=".65"
                        fill="#1b1a17"
                        opacity=".58"
                    />
                </pattern>
                <linearGradient
                    id={`${id}-fade`}
                    x1=".4"
                    y1=".25"
                    x2=".8"
                    y2="1"
                >
                    <stop offset=".2" stopColor="black" />
                    <stop offset="1" stopColor="white" />
                </linearGradient>
                <mask id={`${id}-shade`}>
                    <circle
                        cx="170"
                        cy="170"
                        r="155"
                        fill={`url(#${id}-fade)`}
                    />
                </mask>
            </defs>
            <circle cx="170" cy="170" r="161" fill="#eee8da" />
            <circle
                cx="170"
                cy="170"
                r="156"
                fill={`url(#${id}-paper)`}
                stroke="#1b1a17"
                strokeWidth="2.7"
            />
            <circle
                cx="170"
                cy="170"
                r="152"
                stroke="#1b1a17"
                strokeWidth=".65"
            />
            {!small && (
                <>
                    <path
                        d="M18 170H323M170 16V324"
                        stroke="#9f9786"
                        strokeWidth=".6"
                        opacity=".65"
                    />
                    <circle
                        cx="170"
                        cy="170"
                        r="153"
                        fill={`url(#${id}-dots)`}
                        mask={`url(#${id}-shade)`}
                    />
                </>
            )}
            <g transform="rotate(-4 170 170)">
                <ellipse cx="119" cy="140" rx="14.5" ry="24" fill="#191916" />
                <ellipse cx="223" cy="140" rx="14.5" ry="24" fill="#191916" />
                <circle cx="114" cy="130" r="4.5" fill="#f7f3e9" />
                <circle cx="218" cy="130" r="4.5" fill="#f7f3e9" />
                <path
                    d="M82 184Q167 199 259 183C253 286 98 287 82 184Z"
                    fill="#191916"
                />
                <path
                    d="M128 251C148 228 202 228 222 249C196 265 153 267 128 251Z"
                    fill="#ec5d3c"
                />
                <ellipse cx="166" cy="251" rx="18" ry="5.6" fill="#f48368" />
            </g>
            {!small && (
                <>
                    <circle
                        cx="27"
                        cy="218"
                        r="6"
                        fill="#ed5b38"
                        stroke="#1b1a17"
                        strokeWidth="1.5"
                    />
                    <circle cx="27" cy="218" r="1.5" fill="#1b1a17" />
                    <circle
                        cx="296"
                        cy="77"
                        r="6"
                        fill="#ed5b38"
                        stroke="#1b1a17"
                        strokeWidth="1.5"
                    />
                    <circle cx="296" cy="77" r="1.5" fill="#1b1a17" />
                </>
            )}
        </svg>
    );
}
