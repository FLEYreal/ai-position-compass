import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
    restoreQuestionnaireProgress,
    useQuestionnaireStorageStatus,
    useQuestionnaireStore,
} from '@/entities/scoring';
import type { Language } from '@/shared/config';
import type { Messages as CommonMessages } from '@/shared/i18n';
import { Button, Collage } from '@/shared/ui';
import { StartDialog, type StartMessages } from '@/widgets/start-dialog';
import type { Messages } from '../i18n';

export default function Home({
    lang,
    messages: copy,
    startMessages,
    common,
}: {
    lang: Language;
    messages: Messages;
    startMessages: StartMessages;
    common: CommonMessages;
}) {
    const title = copy['home.title'];
    const words = title.split(' ');
    const sentenceEnd = words.findIndex((word) => word.endsWith('.')) + 1;
    const lead = words.slice(0, sentenceEnd).join(' ');
    const question = words.slice(sentenceEnd, -2).join(' ');
    const emphasis = words.slice(-2).join(' ');
    const navigate = useNavigate();
    const storage = useQuestionnaireStorageStatus();
    const status = useQuestionnaireStore((state) => state.status);
    const start = useQuestionnaireStore((state) => state.start);
    const testPath = `/${lang}/test`;
    const needsRecovery = storage === 'invalid' || storage === 'incompatible';

    useEffect(() => {
        void restoreQuestionnaireProgress();
    }, []);

    function begin(includeDeveloper: boolean) {
        start(includeDeveloper);
        void navigate(testPath);
    }

    return (
        <section className="mx-auto grid items-center gap-x-[clamp(24px,5vw,72px)] gap-y-8 min-[561px]:grid-cols-[1.05fr_1fr]">
            <h1 className="min-w-0 self-end font-heading text-[clamp(37px,6.7vw,96px)] leading-[var(--line-height-display)] font-semibold tracking-[var(--letter-spacing-display)] text-balance uppercase max-[560px]:text-[clamp(42px,10vw,65px)]">
                {lead} <span className="block">{question}</span>{' '}
                <span className="block underline decoration-[var(--orange)] decoration-[0.05em] underline-offset-[0.12em]">
                    {emphasis}
                </span>
            </h1>
            <div className="min-w-0 min-[561px]:col-start-2 min-[561px]:row-span-2 min-[561px]:row-start-1">
                <Collage
                    className="m-0"
                    caption={copy['artwork.caption']}
                    messages={{
                        description: copy['artwork.description'],
                        pauseAction: copy['artwork.pause'],
                        resumeAction: copy['artwork.play'],
                        punchcard: copy['artwork.punchcard'],
                    }}
                />
            </div>
            <div className="min-w-0 self-start">
                <section className="max-w-[40ch]">
                    <h2 className="border-b border-border pb-2 font-sans text-[17px] leading-[1.7] font-medium max-[560px]:text-base">
                        {copy['home.abstract.heading']}
                    </h2>
                    <p className="mt-3 leading-[1.85]">
                        {common['home.abstract.body']}
                    </p>
                </section>
                <div className="mt-6">
                    {storage === 'pending' ?
                        <Button disabled>{common['common.loading']}</Button>
                    : needsRecovery || status !== 'not-started' ?
                        <Button asChild>
                            <Link to={testPath}>
                                {needsRecovery ?
                                    copy['storage.reset']
                                : status === 'finished' ?
                                    copy['session.completed.view']
                                :   copy['session.resume.action']}
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    :   <StartDialog
                            label={copy['home.start']}
                            messages={startMessages}
                            common={common}
                            onStart={begin}
                        />
                    }
                </div>
                <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck
                        aria-hidden="true"
                        className="size-4 shrink-0"
                    />
                    {copy['home.privacy']}
                </p>
            </div>
        </section>
    );
}
