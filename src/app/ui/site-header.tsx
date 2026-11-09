import { Link, useLocation } from 'react-router';
import { Moon, Sun } from 'lucide-react';
import type { Language } from '@/shared/config';
import { useTheme } from '@/shared/lib/theme';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui';

export function SiteHeader({ language }: { language: Language }) {
    const { pathname, search, hash } = useLocation();
    const { resolvedTheme, toggleTheme } = useTheme();
    const t = (en: string, ru: string) => (language === 'ru' ? ru : en);
    const themeLabel =
        resolvedTheme === 'light' ?
            t('Switch to dark theme', 'Включить тёмную тему')
        :   t('Switch to light theme', 'Включить светлую тему');
    const themeTooltip =
        resolvedTheme === 'light' ?
            t('After hours', 'На закате')
        :   t('Daylight', 'В разгар дня');
    function languagePath(next: Language) {
        // Preserve the route and shared result payload; unknown routes stay unknown.
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
                aria-label={t(
                    'AI Position Compass — home',
                    'AI Position Compass — главная',
                )}
                className="flex w-fit min-w-0 items-center gap-2.5 font-heading text-[22px] leading-[.98] font-semibold tracking-[-.025em] max-[560px]:gap-1.5 max-[560px]:text-[18px]"
            >
                <img
                    src={`${import.meta.env.BASE_URL}favicon.svg`}
                    alt=""
                    width="37"
                    height="37"
                    className="size-[37px] shrink-0 max-[560px]:size-8"
                />
                <span>
                    AI POSITION
                    <br />
                    COMPASS<span className="text-[var(--orange-ink)]">.</span>
                </span>
            </Link>
            <div className="flex items-center gap-[17px] max-[560px]:gap-1">
                <div
                    role="group"
                    aria-label={t('Language', 'Язык')}
                    className="flex gap-0.75 rounded-[6px] border border-border px-[7px] py-[4px] max-[560px]:px-[3px]"
                >
                    {(['en', 'ru'] as const).map((next) => (
                        <Button
                            key={next}
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-[30px] w-[30px] rounded-[2px] p-0 text-[11px] font-normal aria-[current=true]:bg-foreground aria-[current=true]:text-background max-[560px]:w-[27px]"
                        >
                            <Link
                                to={languagePath(next)}
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
