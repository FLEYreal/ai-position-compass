import { ArrowRight, Clock3, ListChecks, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import {
    encodeResultPayload,
    getLocalResultState,
    restoreQuestionnaireProgress,
    useQuestionnaireStorageStatus,
    useQuestionnaireStore,
} from '@/entities/scoring';
import {
    getCompletionTime,
    getQuestionCount,
    resultRoute,
    type Language,
} from '@/shared/config';
import type { Messages as CommonMessages } from '@/shared/i18n';
import { Button, Collage } from '@/shared/ui';
import { StartDialog, type StartMessages } from '@/widgets/start-dialog';
import type { Messages } from '../i18n';
import { StudySections } from './study-sections';

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

    async function viewResult() {
        const progress = useQuestionnaireStore.getState();
        const result = progress.createResult();
        if (!result) {
            void navigate(testPath);
            return;
        }
        const state = await getLocalResultState(progress);
        void navigate(resultRoute(lang, encodeResultPayload(result)), {
            state,
        });
    }

    const opening = (
        <section className="mx-auto grid items-center gap-x-[clamp(24px,5vw,72px)] gap-y-8 lg:grid-cols-[1.05fr_1fr]">
            <div className="min-w-0 self-end">
                <p className="mb-3 text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                    {copy['home.eyebrow']}
                </p>
                <h1 className="font-heading text-[clamp(37px,6.7vw,96px)] leading-[var(--line-height-display)] font-semibold tracking-[var(--letter-spacing-display)] text-balance uppercase max-[560px]:text-[clamp(42px,10vw,65px)]">
                    {lead} <span className="block">{question}</span>{' '}
                    <span className="relative inline-block max-w-full pb-[0.15em]">
                        {emphasis}
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 560 23"
                            preserveAspectRatio="none"
                            className="absolute bottom-0 left-0 h-[0.22em] w-full text-[var(--orange)]"
                        >
                            <path
                                d="M4 15Q183 1 350 9T553 8M18 20Q270 10 520 18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                        </svg>
                    </span>
                </h1>
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
                        <div aria-hidden="true" className="min-h-[52px]" />
                    : status === 'finished' && !needsRecovery ?
                        <Button onClick={() => void viewResult()}>
                            {copy['session.completed.view']}
                            <ArrowRight aria-hidden="true" />
                        </Button>
                    : needsRecovery || status !== 'not-started' ?
                        <Button asChild>
                            <Link to={testPath}>
                                {needsRecovery ?
                                    copy['storage.reset']
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
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                        <ListChecks aria-hidden="true" className="size-4" />
                        {copy['home.questions.core'].replace(
                            '{count}',
                            String(getQuestionCount('core')),
                        )}
                    </li>
                    <li className="flex items-center gap-2">
                        <Clock3 aria-hidden="true" className="size-4" />
                        {copy['home.duration.estimate'].replace(
                            '{count}',
                            String(getCompletionTime('core')),
                        )}
                    </li>
                    <li className="flex items-center gap-2">
                        <ShieldCheck
                            aria-hidden="true"
                            className="size-4 shrink-0"
                        />
                        {copy['home.privacy']}
                    </li>
                </ul>
            </div>
            <div className="mx-auto w-full min-w-0 max-w-[480px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-none">
                <Collage
                    className="m-0"
                    caption={common['artwork.caption']}
                    messages={{
                        description: common['artwork.description'],
                        pauseAction: common['artwork.pause'],
                        resumeAction: common['artwork.play'],
                        punchcard: common['artwork.punchcard'],
                    }}
                />
            </div>
        </section>
    );

    return (
        <>
            {opening}
            <StudySections
                copy={copy}
                axisDescriptions={common.axisDescriptions}
            />
        </>
    );
}
