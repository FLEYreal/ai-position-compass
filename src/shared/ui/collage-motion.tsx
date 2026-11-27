import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { cn } from '@/shared/lib';

/** Runs the shared stop-motion loop on the visible pieces of a collage. */
export function CollageMotion({
    className,
    children,
    ...props
}: ComponentProps<'div'>) {
    const stageRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage || typeof IntersectionObserver === 'undefined') return;

        let inViewport = false;
        const update = () =>
            setPlaying(inViewport && document.visibilityState === 'visible');
        const observer = new IntersectionObserver(
            ([entry]) => {
                inViewport = entry.intersectionRatio >= 0.1;
                update();
            },
            { threshold: 0.1 },
        );
        observer.observe(stage);
        document.addEventListener('visibilitychange', update);

        return () => {
            observer.disconnect();
            document.removeEventListener('visibilitychange', update);
        };
    }, []);

    return (
        <div
            {...props}
            ref={stageRef}
            data-playing={playing}
            className={cn(
                'motion-safe:[&_[data-collage-piece]]:animate-[collage-poses_10s_steps(1,end)_infinite]',
                '[&_[data-collage-piece]]:[animation-play-state:paused]! data-[playing=true]:[&_[data-collage-piece]]:[animation-play-state:running]!',
                className,
            )}
        >
            {children}
        </div>
    );
}
