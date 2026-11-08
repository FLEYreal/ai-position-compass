import { useId } from 'react';

/** Bent-wire geometry with a printed paper silhouette, authored for this mock. */
export function PaperClip({ className = '' }: { className?: string }) {
    const id = useId().replace(/:/g, '');
    const wire =
        'M46 120V39C46 23 25 23 25 39V124C25 151 65 151 65 124V32C65 -2 9 -2 9 32V118';
    return (
        <svg className={className} viewBox="0 0 76 158" aria-hidden="true">
            <defs>
                <linearGradient id={`wire-${id}`} x1="0" x2="1">
                    <stop stopColor="#403d35" />
                    <stop offset=".25" stopColor="#b5b0a0" />
                    <stop offset=".5" stopColor="#6d695e" />
                    <stop offset=".8" stopColor="#d9d4c7" />
                    <stop offset="1" stopColor="#585449" />
                </linearGradient>
                <pattern
                    id={`print-${id}`}
                    width="3"
                    height="3"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r=".5" fill="#443e32" />
                </pattern>
            </defs>
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d={wire} stroke="#f1ecdf" strokeWidth="19" />
                <path d={wire} stroke="#39372f" strokeWidth="10" />
                <path d={wire} stroke={`url(#wire-${id})`} strokeWidth="7" />
                <path
                    d={wire}
                    stroke="#eeeadf"
                    strokeWidth="1.2"
                    transform="translate(-1 -1)"
                    opacity=".7"
                />
                <path
                    d={wire}
                    stroke={`url(#print-${id})`}
                    strokeWidth="12"
                    opacity=".3"
                />
            </g>
        </svg>
    );
}
