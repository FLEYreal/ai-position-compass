import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { cn } from '@/shared/lib';
import { TooltipProvider } from '@/shared/ui';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export function AppShell({ children }: { children: ReactNode }) {
    const { pathname } = useLocation();
    const language = /^\/ru(?:\/|$)/.test(pathname) ? 'ru' : 'en';
    const page = pathname.replace(/\/$/, '').split('/').at(-1);
    return (
        <TooltipProvider delayDuration={200}>
            <div className="mx-auto flex min-h-dvh w-[calc(100%-96px)] max-w-[1280px] flex-col max-[800px]:w-[calc(100%-44px)] max-[560px]:w-[calc(100%-36px)]">
                <a
                    href="#main"
                    className="sr-only z-50 rounded bg-card p-3 text-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
                >
                    {language === 'ru' ?
                        'Перейти к содержимому'
                    :   'Skip to content'}
                </a>
                <SiteHeader language={language} />
                <main
                    id="main"
                    tabIndex={-1}
                    className={cn(
                        'mx-auto w-full min-w-0 flex-1 py-12 max-[560px]:py-8',
                        page === 'test' && 'max-w-[1100px]',
                        page === 'result' && 'max-w-[1180px]',
                    )}
                >
                    {children}
                </main>
                <SiteFooter language={language} />
            </div>
        </TooltipProvider>
    );
}
