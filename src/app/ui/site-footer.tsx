import type { Language } from '@/shared/config';
import { GitHubMark } from '@/shared/ui';
import { repositoryUrl } from '../config/site';

export function SiteFooter({ language }: { language: Language }) {
    const t = (en: string, ru: string) => (language === 'ru' ? ru : en);
    return (
        <footer className="flex min-h-[91px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-foreground py-6 text-[11px] text-muted-foreground max-[560px]:py-[22px]">
            <span className="font-heading text-[15px] font-semibold text-foreground">
                AI POSITION COMPASS
                <span className="text-[var(--orange-ink)]">.</span>
            </span>
            <p>
                {t(
                    'Beliefs and values about artificial intelligence.',
                    'Убеждения и ценности об искусственном интеллекте.',
                )}
            </p>
            <a
                href={repositoryUrl}
                className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline"
            >
                <GitHubMark />
                GitHub
            </a>
            <details className="max-w-[65ch] max-[560px]:w-full">
                <summary className="cursor-pointer underline-offset-4 hover:underline">
                    {t('About this study', 'Об этом макете')}
                </summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed">
                    <p>
                        {t(
                            'Your answers stay in this browser.',
                            'Ответы остаются в этом браузере.',
                        )}
                    </p>
                    <a
                        className="underline underline-offset-4"
                        href={`${import.meta.env.BASE_URL}ASSET-CREDITS.txt`}
                    >
                        {t('Archive photographs:', 'Архивные фотографии:')}{' '}
                        {t('Sources', 'Источники')}
                    </a>
                </div>
            </details>
        </footer>
    );
}
