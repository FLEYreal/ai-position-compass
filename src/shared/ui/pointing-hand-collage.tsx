import { CollageMotion } from './collage-motion';
import { EditorialPrint } from './editorial-print';
import pointingHand from './collage-assets/pointing-hand.webp';

export function PointingHandCollage({ className }: { className?: string }) {
    return (
        <CollageMotion className={className} aria-hidden="true">
            <svg
                viewBox="0 0 792 419"
                className="block h-auto w-full drop-shadow-[0_4px_6px_#15120d26]"
            >
                <g
                    data-collage-piece
                    className="origin-center transform-fill motion-safe:[animation-delay:-3s]!"
                >
                    <path
                        d="M488 187L498 166L542 172L555 160L587 170L604 157L637 169L653 156L688 164L704 150L735 157L771 145L767 178L783 191L772 220L782 237L772 270L782 285L770 315L781 334L768 354L774 388L725 383L710 394L674 376L655 385L620 367L601 375L573 350L552 358L519 337Z"
                        fill="var(--orange)"
                    />
                </g>
                <g data-collage-piece className="origin-center transform-fill">
                    <EditorialPrint viewBox="0 0 792 419">
                        <image
                            href={pointingHand}
                            width={760}
                            height={397}
                            y={9}
                        />
                    </EditorialPrint>
                </g>
            </svg>
        </CollageMotion>
    );
}
