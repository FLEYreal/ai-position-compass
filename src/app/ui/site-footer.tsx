import { projectName } from '@/shared/config';
import { GitHubMark } from '@/shared/ui';
import { repositoryUrl } from '../config/site';
import type { Messages } from '../i18n';

export function SiteFooter({ messages }: { messages: Messages }) {
    const repositoryArr = repositoryUrl.split('/');
    return (
        <footer className="flex min-h-[91px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border py-6 text-[11px] text-muted-foreground max-[560px]:py-[22px]">
            <span className="font-heading text-[15px] font-semibold text-foreground uppercase">
                {projectName}
                <span className="text-[var(--orange-ink)]">.</span>
            </span>
            <p>{messages['footer.description']}</p>
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
