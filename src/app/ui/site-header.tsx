import { Link, useLocation } from 'react-router';
import { Moon, Pause, Play, Sun } from 'lucide-react';
import { projectName, resultPath, type Language } from '@/shared/config';
import { useTheme } from '@/shared/lib/theme';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';
import type { Messages } from '../i18n';

export function SiteHeader({
    language,
    messages: copy,
    collagePaused,
    onToggleCollagePause,
}: {
    language: Language;
    messages: Messages;
    collagePaused: boolean;
    onToggleCollagePause: () => void;
}) {
    const { pathname, search, hash, state } = useLocation();
    const isResult = /^\/(?:en\/|ru\/)?result\/?$/.test(pathname);
    const { resolvedTheme, toggleTheme } = useTheme();
    const lastSpace = projectName.lastIndexOf(' ');
    const themeLabel =
        resolvedTheme === 'light' ?
            copy['theme.toDark']
        :   copy['theme.toLight'];
    const themeTooltip =
        resolvedTheme === 'light' ?
            copy['theme.tooltip.toDark']
        :   copy['theme.tooltip.toLight'];
    const motionLabel =
        collagePaused ? copy['motion.resume'] : copy['motion.pause'];
    function languagePath(next: Language) {
        // Preserve the route and shared result payload; unknown routes stay unknown.
        if (isResult) return { pathname: resultPath(next), search, hash };
        const path =
            /^\/(en|ru)(?=\/|$)/.test(pathname) ?
                pathname.replace(/^\/(en|ru)(?=\/|$)/, `/${next}`)
            :   `/${next}${pathname === '/' ? '/' : pathname}`;
        return { pathname: path, search, hash };
    }
    return (
        <header className="grid min-h-[76px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border max-[560px]:min-h-[67px] max-[560px]:gap-2">
            <Link
                to={`/${language}/`}
                aria-label={projectName}
                className="flex w-fit min-w-0 items-center gap-2.5 font-heading text-[22px] leading-[.98] font-semibold tracking-[-.025em] max-[560px]:gap-1.5 max-[560px]:text-[18px]"
            >
                <img
                    src={`${import.meta.env.BASE_URL}favicon.svg`}
                    alt=""
                    width="37"
                    height="37"
                    className="size-[37px] shrink-0 max-[560px]:size-8"
                />
                <span className="uppercase">
                    {projectName.slice(0, lastSpace)}
                    <br />
                    {projectName.slice(lastSpace + 1)}
                    <span className="text-[var(--orange-ink)]">.</span>
                </span>
            </Link>
            <div className="flex items-center gap-[17px] max-[560px]:gap-1">
                <div
                    role="group"
                    aria-label={copy['nav.language']}
                    className="flex gap-0.75 rounded-[6px] border border-border px-[7px] py-[4px] max-[560px]:px-[3px]"
                >
                    {(['en', 'ru'] as const).map((next) => (
                        <Button
                            key={next}
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-[30px] w-[30px] rounded-[2px] p-0 text-[11px] font-normal aria-[current=true]:bg-foreground aria-[current=true]:text-background aria-[current=true]:hover:bg-foreground aria-[current=true]:hover:text-background dark:aria-[current=true]:hover:bg-foreground max-[560px]:w-[27px]"
                        >
                            <Link
                                to={languagePath(next)}
                                state={isResult ? state : undefined}
                                lang={next}
                                hrefLang={next}
                                aria-current={
                                    language === next ? 'true' : undefined
                                }
                            >
                                {next.toUpperCase()}
                            </Link>
                        </Button>
                    ))}
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleCollagePause}
                            aria-label={motionLabel}
                            className="size-9 motion-reduce:hidden max-[560px]:size-8"
                        >
                            {collagePaused ?
                                <Play className="size-[18px]" />
                            :   <Pause className="size-[18px]" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{motionLabel}</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            aria-label={themeLabel}
                            className="size-9 max-[560px]:size-8"
                        >
                            {resolvedTheme === 'light' ?
                                <Moon className="size-[18px]" />
                            :   <Sun className="size-[18px]" />}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{themeTooltip}</TooltipContent>
                </Tooltip>
            </div>
        </header>
    );
}
