import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Language } from '@/shared/config';
import { Mask } from './mascot';
import { PaperClip } from './paper-clip';
import apollo from './collage-assets/apollo.jpg';
import nuclear from './collage-assets/grable.jpg';
import courtroom from './collage-assets/courtroom.jpg';
import punchcard from './collage-assets/punchcard.png';

const paperMotion =
    'motion-safe:animate-[paper-poses_8s_steps(1,end)_infinite] [animation-play-state:paused]! data-[playing=true]:[animation-play-state:running]!';
const clipMotion =
    'motion-safe:animate-[clip-poses_12s_steps(1,end)_infinite] [animation-play-state:paused]! data-[playing=true]:[animation-play-state:running]!';
const photoFilter = '[filter:url(#editorial-cream-print)]';

const listeners = new Set<() => void>();
let fallbackPaused = false;
function subscribePause(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
function getPaused() {
    try {
        return sessionStorage.getItem('compass-collage-paused') === '1';
    } catch {
        return fallbackPaused;
    }
}
function togglePaused() {
    const next = !getPaused();
    fallbackPaused = next;
    try {
        sessionStorage.setItem('compass-collage-paused', next ? '1' : '0');
    } catch {
        /* Keep the in-memory preference. */
    }
    listeners.forEach((listener) => listener());
}

export function Collage({
    variant = 'home',
    language = 'en',
    caption,
}: {
    variant?: 'home' | 'result';
    language?: Language;
    caption?: string;
}) {
    const stageRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    const paused = useSyncExternalStore(subscribePause, getPaused, () => false);
    useEffect(() => {
        const element = stageRef.current;
        if (!element || typeof IntersectionObserver === 'undefined') return;
        let inViewport = false;
        const update = () =>
            setVisible(inViewport && document.visibilityState === 'visible');
        const observer = new IntersectionObserver(
            ([entry]) => {
                inViewport =
                    entry.isIntersecting && entry.intersectionRatio >= 0.1;
                update();
            },
            { threshold: [0, 0.1] },
        );
        observer.observe(element);
        document.addEventListener('visibilitychange', update);
        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', update);
        };
    }, []);
    const playing = visible && !paused;
    const imageLabel =
        language === 'ru' ?
            'Улыбающаяся маска, скрепки, перфокарта и архивные фотографии.'
        :   'A smiling mask, paperclips, a punched card, and archival photographs.';
    const home = variant === 'home';
    return (
        <figure ref={stageRef} className="relative m-0 w-full">
            <div
                className="relative isolate aspect-[1.04] w-full"
                role="img"
                aria-label={imageLabel}
            >
                <svg
                    width="0"
                    height="0"
                    aria-hidden="true"
                    className="absolute"
                >
                    <defs>
                        <filter
                            id="editorial-cream-print"
                            colorInterpolationFilters="sRGB"
                        >
                            <feColorMatrix type="saturate" values=".45" />
                            <feComponentTransfer>
                                <feFuncR
                                    type="linear"
                                    slope=".67"
                                    intercept=".27"
                                />
                                <feFuncG
                                    type="linear"
                                    slope=".65"
                                    intercept=".235"
                                />
                                <feFuncB
                                    type="linear"
                                    slope=".64"
                                    intercept=".18"
                                />
                            </feComponentTransfer>
                        </filter>
                    </defs>
                </svg>
                <div
                    aria-hidden="true"
                    className="absolute top-[9%] left-[15%] h-[79%] w-[76%] -rotate-[11deg] rounded-[30%_45%_18%_33%] bg-[radial-gradient(var(--ink)_.9px,transparent_1.15px)] bg-size-[6.5px_6.5px] opacity-55"
                />
                <svg
                    data-playing={playing}
                    className={`absolute top-[2%] left-[24%] h-[76%] w-[64%] rotate-[7deg] text-[var(--orange)] ${paperMotion} motion-safe:[animation-duration:12.8s]! motion-safe:[animation-delay:-3s]!`}
                    viewBox="0 0 400 430"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    <path
                        d="M9 12L18 5L28 13L41 4L53 10L66 3L77 11L89 5L103 12L117 4L129 9L142 3L156 12L169 5L180 9L194 4L207 12L220 6L234 12L247 3L260 10L275 4L286 13L298 5L312 10L326 3L340 11L352 6L364 13L380 4L390 13L386 26L397 37L390 52L398 64L390 79L397 93L390 107L398 121L389 136L396 149L390 164L399 178L389 192L397 206L390 219L398 233L389 249L396 263L390 280L398 295L388 308L397 323L390 338L397 351L389 365L395 381L388 397L393 412L380 424L366 417L351 427L338 421L324 428L307 421L293 429L280 421L265 428L250 420L237 429L223 422L208 428L194 421L180 430L167 421L151 428L136 420L123 427L107 420L94 428L80 421L65 427L52 419L37 426L22 417L9 425L3 410L9 394L2 380L8 366L1 350L8 336L2 320L9 307L2 291L8 277L1 263L8 246L2 233L9 218L2 202L8 188L1 172L9 159L2 142L8 127L1 114L9 99L2 83L8 70L1 54L9 40L3 26Z"
                        fill="currentColor"
                    />
                </svg>
                <div
                    data-playing={playing}
                    className={`absolute ${home ? 'top-[3%] left-[16%] h-[60%] w-[69%] rotate-[4deg]' : 'top-[5%] left-[18%] h-[46%] w-[66%] -rotate-[4deg]'} bg-[var(--photo-paper)] p-[5px] shadow-[0_4px_6px_#15120d26] ${paperMotion} motion-safe:[animation-delay:-1s]!`}
                >
                    <img
                        className={`h-full w-full object-cover ${photoFilter}`}
                        src={home ? nuclear : apollo}
                        alt=""
                    />
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-[5px] bg-[radial-gradient(#1b1a17_0.55px,transparent_0.9px)] bg-size-[2.8px_2.8px] opacity-[0.22] mix-blend-multiply"
                    />
                    <span className="absolute top-2 left-2 bg-[var(--photo-paper)] px-1 font-mono text-[length:var(--font-size-technical)] text-[var(--action-ink)]">
                        {home ? 'GRABLE · 1953' : 'MISSION CONTROL · 1969'}
                    </span>
                </div>
                <div
                    data-playing={playing}
                    className={`absolute ${home ? 'top-[58%] left-0 h-[32%] w-[64%] -rotate-[7deg]' : 'top-[51%] left-[5%] h-[41%] w-[61%] rotate-[7deg]'} bg-[var(--photo-paper)] p-[5px] shadow-[0_4px_6px_#15120d26] ${paperMotion} motion-safe:[animation-duration:9.6s]! motion-safe:[animation-delay:-4.2s]! motion-safe:[animation-direction:reverse]!`}
                >
                    <img
                        className={`h-full w-full object-cover ${photoFilter}`}
                        src={home ? apollo : courtroom}
                        alt=""
                    />
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-[5px] bg-[radial-gradient(#1b1a17_0.55px,transparent_0.9px)] bg-size-[2.8px_2.8px] opacity-[0.22] mix-blend-multiply"
                    />
                </div>
                <div
                    data-playing={playing}
                    className={`absolute bottom-[4%] left-[33%] w-[58%] rotate-[5deg] ${paperMotion} motion-safe:[animation-duration:10.4s]! motion-safe:[animation-delay:-6s]! motion-safe:[animation-direction:reverse]!`}
                >
                    <img
                        className={`block w-full ${photoFilter}`}
                        src={punchcard}
                        alt=""
                    />
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1b1a17_0.55px,transparent_0.9px)] bg-size-[2.8px_2.8px] opacity-[0.22] mix-blend-multiply"
                    />
                </div>
                <div
                    data-playing={playing}
                    className={`absolute ${home ? 'top-[31%] left-[37%] w-[63%] rotate-[8deg]' : 'top-[35%] left-[43%] w-[57%] -rotate-[6deg]'} ${paperMotion} motion-safe:[animation-duration:8.8s]! motion-safe:[animation-delay:-2.4s]!`}
                >
                    <Mask className={`w-full ${photoFilter}`} />
                </div>
                <svg
                    className="pointer-events-none absolute top-[8%] right-0 -z-10 h-[88%] w-[88%] rotate-[17deg] text-foreground opacity-30"
                    viewBox="0 0 420 420"
                    aria-hidden="true"
                >
                    <ellipse
                        cx="210"
                        cy="210"
                        rx="180"
                        ry="75"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth=".7"
                    />
                    <ellipse
                        cx="210"
                        cy="210"
                        rx="180"
                        ry="75"
                        transform="rotate(57 210 210)"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth=".7"
                    />
                </svg>
                <span
                    aria-hidden="true"
                    data-playing={playing}
                    className={`absolute top-[40%] left-[45%] h-[4%] w-[13%] -rotate-[37deg] bg-[#e6dfcbdb] shadow-[0_1px_2px_#19161129] ${paperMotion} motion-safe:[animation-duration:8.8s]! motion-safe:[animation-delay:-2.4s]!`}
                />
                <span
                    aria-hidden="true"
                    data-playing={playing}
                    className={`absolute top-[73%] right-[-1%] h-[4%] w-[13%] rotate-[62deg] bg-[#e6dfcbdb] shadow-[0_1px_2px_#19161129] ${paperMotion} motion-safe:[animation-duration:11.2s]! motion-safe:[animation-delay:-5s]!`}
                />
                <svg
                    className="absolute top-[29%] left-[3%] w-[22px] opacity-65"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                >
                    <path d="M16 0V32M0 16H32" stroke="currentColor" />
                    <circle
                        cx="16"
                        cy="16"
                        r="6"
                        fill="none"
                        stroke="currentColor"
                    />
                </svg>
                <div
                    data-playing={playing}
                    className={`absolute top-[30%] left-[44%] z-10 w-[12%] rotate-[39deg] ${clipMotion}`}
                >
                    <PaperClip
                        className={`w-full overflow-visible ${photoFilter}`}
                    />
                </div>
                <div
                    data-playing={playing}
                    className={`absolute top-[80%] right-[3%] z-10 w-[12%] rotate-[65deg] ${clipMotion} motion-safe:[animation-duration:10.5s]! motion-safe:[animation-delay:-5.25s]!`}
                >
                    <PaperClip
                        className={`w-full overflow-visible ${photoFilter}`}
                    />
                </div>
                <div
                    data-playing={playing}
                    className={`absolute top-[16%] right-[1%] z-10 w-[9%] rotate-[23deg] ${clipMotion} motion-safe:[animation-duration:14s]! motion-safe:[animation-delay:-8.75s]! motion-safe:[animation-direction:reverse]!`}
                >
                    <PaperClip
                        className={`w-full overflow-visible ${photoFilter}`}
                    />
                </div>
            </div>
            <figcaption className="mt-[13px] flex min-h-5 items-center justify-between gap-3">
                <span className="font-mono text-[length:var(--font-size-technical)] text-muted-foreground">
                    {caption}
                </span>
                <button
                    type="button"
                    className="ml-auto inline-flex min-h-8 items-center gap-1 text-xs text-muted-foreground underline decoration-dotted underline-offset-[3px] hover:text-foreground motion-reduce:hidden"
                    aria-label={
                        language === 'ru' ?
                            paused ?
                                'Продолжить анимацию иллюстрации'
                            :   'Приостановить анимацию иллюстрации'
                        : paused ?
                            'Resume illustration animation'
                        :   'Pause illustration animation'
                    }
                    onClick={togglePaused}
                >
                    {paused ?
                        <Play size={11} aria-hidden="true" />
                    :   <Pause size={11} aria-hidden="true" />}
                    {paused ?
                        language === 'ru' ?
                            'Продолжить'
                        :   'Play'
                    : language === 'ru' ?
                        'Пауза'
                    :   'Pause'}
                </button>
            </figcaption>
        </figure>
    );
}
