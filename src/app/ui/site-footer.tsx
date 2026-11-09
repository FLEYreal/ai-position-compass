import type { Language } from '@/shared/config';
import { GitHubMark } from '@/shared/ui';
import { repositoryUrl } from '../config/site';

export function SiteFooter({ language }: { language: Language }) {
    const t = (en: string, ru: string) => (language === 'ru' ? ru : en);
    const repositoryArr = repositoryUrl.split('/');
    return (
        <footer className="flex min-h-[91px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border py-6 text-[11px] text-muted-foreground max-[560px]:py-[22px]">
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
                {`${repositoryArr[repositoryArr.length - 2]}/${repositoryArr[repositoryArr.length - 1]}`}
            </a>
        </footer>
    );
}
