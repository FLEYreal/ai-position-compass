import { useId } from 'react';
import { cn } from '@/shared/lib';
import { EditorialPrint } from './editorial-print';
import ibmPcXt from './collage-assets/ibm-pc-xt.webp';

export function DeveloperCollage({ className }: { className?: string }) {
    const silhouetteId = useId();
    const clipId = `${silhouetteId}-clip`;

    return (
        <svg
            viewBox="-28 -6 724 728"
            className={cn(
                'block h-auto w-full drop-shadow-[0_4px_6px_#15120d26]',
                className,
            )}
            aria-hidden="true"
        >
            <defs>
                <path
                    id={silhouetteId}
                    d="M172 105Q168 84 189 75L325 42L548 31Q553 32 555 41L565 202Q567 212 561 218L622 219Q627 219 626 228L625 282L544 462Q540 473 526 475L528 500L446 662Q442 671 433 667L66 524Q58 521 63 513L175 397Q182 392 189 396L176 325Q174 313 182 307L207 293Z"
                />
                <clipPath id={clipId}>
                    <use href={`#${silhouetteId}`} />
                </clipPath>
            </defs>
            <path
                d="M148 81
                   L164 61
                   L175 54 190 61 209 50 227 56 247 44 260 52 279 41 296 47 315 35 325 43 347 32 360 40 380 28 398 35 413 23 430 31 449 19 466 27 485 14 498 21 520 11 530 18 539 14
                   L550 14 560 25 565 25
                   L572 40 564 51 573 73 566 89 578 110 568 124 580 145 572 157 583 179 574 194 578 199
                   L587 194 600 203 620 195 633 203 638 201
                   L647 221
                   L652 233 642 242 650 259 641 272 644 278
                   L642 296 629 305 628 325 615 336 612 360 600 368 601 389 585 402 585 425 570 436 570 458 556 468 556 475
                   L559 486 544 497 545 505
                   L543 522 530 526 528 547 514 556 513 579 499 585 499 606 486 613 481 638 470 644 466 667 455 672 453 681
                   L440 687
                   L424 687 419 675 397 676 386 662 366 665 356 651 331 651 326 639 303 640 291 627 271 628 260 614 240 616 233 603 209 604 202 591 180 591 168 577 148 578 136 567 117 568 106 554 85 555 75 541 55 545 44 530 38 531
                   L39 511
                   L44 500 62 491 71 471 83 468 95 446 110 442 119 421 132 418 142 397 159 391 161 383
                   L155 372 161 358 152 336 158 322 154 317
                   L163 302 179 298 186 288
                   L178 276 184 262 172 244 178 228 166 207 172 193 160 172 165 156 152 138 159 121 147 106 152 88
                   Z"
                transform="rotate(20 342 350)"
                fill="var(--orange)"
                stroke="var(--orange)"
                strokeWidth={4}
                strokeLinejoin="round"
            />
            <g transform="rotate(15 342 350)">
                <use
                    href={`#${silhouetteId}`}
                    fill="var(--photo-paper)"
                    stroke="var(--photo-paper)"
                    strokeWidth={9}
                    strokeLinejoin="round"
                />
                <EditorialPrint width="100%" height="100%">
                    <image
                        href={ibmPcXt}
                        width={700}
                        height={686}
                        clipPath={`url(#${clipId})`}
                    />
                </EditorialPrint>
            </g>
        </svg>
    );
}
