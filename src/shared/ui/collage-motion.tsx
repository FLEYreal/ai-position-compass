import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { cn } from '@/shared/lib';

/** Runs the shared stop-motion loop on the visible pieces of a collage. */
export function CollageMotion({
    className,
    children,
    deferArtwork = false,
    ...props
}: ComponentProps<'div'> & { deferArtwork?: boolean }) {
    const stageRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;
        if (typeof IntersectionObserver === 'undefined') {
            if (!deferArtwork) return;
            const frame = requestAnimationFrame(() =>
                setHasEnteredViewport(true),
            );
            return () => cancelAnimationFrame(frame);
        }

        let inViewport = false;
        const update = () =>
            setPlaying(inViewport && document.visibilityState === 'visible');
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (deferArtwork && entry.isIntersecting) {
                    setHasEnteredViewport(true);
                }
                inViewport = entry.intersectionRatio >= 0.1;
                update();
            },
            { threshold: deferArtwork ? [0, 0.1] : 0.1 },
        );
        observer.observe(stage);
        document.addEventListener('visibilitychange', update);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', update);
        };
    }, [deferArtwork]);

    return (
        <div
            {...props}
            ref={stageRef}
            data-playing={playing}
            className={cn(
                'motion-safe:[&_[data-collage-piece]]:animate-[collage-poses_10s_steps(1,end)_infinite]',
                '[&_[data-collage-piece]]:[animation-play-state:paused]! data-[playing=true]:[&_[data-collage-piece]]:[animation-play-state:var(--collage-play-state,running)]!',
                className,
            )}
        >
            {(!deferArtwork || hasEnteredViewport) && children}
        </div>
    );
}
