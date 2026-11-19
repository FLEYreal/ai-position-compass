import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
    getSelectedQuestions,
    restoreQuestionnaireProgress,
    useQuestionnaireStorageStatus,
    useQuestionnaireStore,
} from '@/entities/scoring';
import { axisConstruct, suggestions, type Language } from '@/shared/config';
import type { Messages as CommonMessages } from '@/shared/i18n';
import {
    Button,
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTitle,
    QuestionProgress,
} from '@/shared/ui';
import { QuestionSheet } from '@/widgets/question-sheet';
import {
    QuestionnaireConfirmation,
    QuestionnaireStatus,
} from '@/widgets/questionnaire-status';
import { StartDialog, type StartMessages } from '@/widgets/start-dialog';
import type { Messages } from '../i18n';

export default function TestPage({
    lang,
    messages: copy,
    common,
    startMessages,
}: {
    lang: Language;
    messages: Messages;
    common: CommonMessages;
    startMessages: StartMessages;
}) {
    const progress = useQuestionnaireStore();
    const storage = useQuestionnaireStorageStatus();
    const [completionOpen, setCompletionOpen] = useState(false);
    const [resetFailed, setResetFailed] = useState(false);
    const [openStartAfterReset, setOpenStartAfterReset] = useState(false);

    useEffect(() => {
        void restoreQuestionnaireProgress();
    }, []);

    const storageNotice =
        storage === 'unavailable' ? copy['storage.unavailable']
        : storage === 'save-failed' ? copy['storage.saveFailed']
        : undefined;

    function restart() {
        if (progress.reset()) {
            setCompletionOpen(false);
            setResetFailed(false);
            setOpenStartAfterReset(true);
        } else {
            setResetFailed(true);
        }
    }

    function handleCompletionOpenChange(open: boolean) {
        if (open) {
            const result = progress.createResult();
            if (!result) return;
            if (import.meta.env.DEV) {
                console.info('Questionnaire result', result);
            }
        }
        setCompletionOpen(open);
    }

    const closeLabel = common['common.close'];
    const cancelLabel = common['common.cancel'];
    const restartAction = (
        <QuestionnaireConfirmation
            label={copy['test.restart']}
            heading={copy['session.restart.heading']}
            description={copy['session.restart.description']}
            confirmation={copy['session.restart.confirm']}
            closeLabel={closeLabel}
            cancelLabel={cancelLabel}
            onConfirm={restart}
        />
    );

    function renderQuestionnaire() {
        if (storage === 'pending') {
            return <p role="status">{copy['test.loadingSaved']}</p>;
        }

        if (storage === 'invalid' || storage === 'incompatible') {
            const invalid = storage === 'invalid';
            const heading =
                invalid ?
                    copy['storage.invalid.heading']
                :   copy['storage.version.heading'];
            const description =
                invalid ?
                    copy['storage.invalid.body']
                :   copy['storage.version.body'];
            return (
                <QuestionnaireStatus
                    heading={heading}
                    description={description}
                >
                    <QuestionnaireConfirmation
                        label={copy['storage.reset']}
                        heading={copy['storage.reset.confirm']}
                        description={description}
                        confirmation={copy['storage.reset']}
                        closeLabel={closeLabel}
                        cancelLabel={cancelLabel}
                        onConfirm={restart}
                    />
                    {resetFailed && (
                        <p role="alert">{copy['storage.resetFailed']}</p>
                    )}
                </QuestionnaireStatus>
            );
        }

        if (progress.status === 'not-started') {
            return (
                <StartDialog
                    label={startMessages['start.begin']}
                    messages={startMessages}
                    common={common}
                    openOnMount={openStartAfterReset}
                    onStart={progress.start}
                />
            );
        }

        const questions = getSelectedQuestions(progress.includeDeveloper);
        const index = questions.findIndex(
            ({ id }) => id === progress.currentQuestionId,
        );
        const question = questions[index];
        const hint = suggestions.find(
            ({ questionId }) => questionId === question.id,
        );
        const answered = Object.keys(progress.answersById).length;
        const atLast = index === questions.length - 1;

        return (
            <Dialog
                open={completionOpen}
                onOpenChange={handleCompletionOpenChange}
            >
                <QuestionProgress
                    total={questions.length}
                    answered={answered}
                    currentQuestion={index + 1}
                    messages={{
                        progressLabel: copy['test.progressLabel'],
                        answeredLabel: copy['test.progressLabel'],
                        questionLabel: copy['test.progressLabel'],
                        completeLabel: copy['session.completed.heading'],
                        position: (current, total) =>
                            copy['test.questionNumber']
                                .replace('{current}', String(current))
                                .replace('{total}', String(total)),
                        summary: (count) =>
                            copy['test.progress']
                                .replace('{answered}', String(count))
                                .replace('{total}', String(questions.length)),
                    }}
                />
                <QuestionSheet
                    id={question.id}
                    position={index + 1}
                    statement={
                        copy[
                            `research.questions.${question.modelId}.${question.id}` as keyof Messages
                        ]
                    }
                    construct={copy[`test.${axisConstruct[question.axisId]}`]}
                    axis={question.axisId}
                    axisLabel={copy[`research.axes.${question.axisId}`]}
                    developerLabel={
                        question.modelId === 'dev' ?
                            copy['test.developerHeading']
                        :   undefined
                    }
                    hint={
                        hint && {
                            text: copy[
                                `research.suggestions.${question.id}` as keyof Messages
                            ],
                            sources: hint.sources,
                        }
                    }
                    response={progress.answersById[question.id]}
                    choices={[
                        copy['research.answer-scale.stronglyDisagree'],
                        copy['research.answer-scale.disagree'],
                        copy['research.answer-scale.neutral'],
                        copy['research.answer-scale.agree'],
                        copy['research.answer-scale.stronglyAgree'],
                    ]}
                    copy={{
                        prompt: copy['test.prompt'],
                        unsure: copy['research.answer-scale.unsure'],
                        unsureNote: copy['test.unsureNote'],
                        keyboard: copy['test.keyboard'],
                        back: copy['test.back'],
                        next: copy['test.next'],
                        finish: copy['test.finish'],
                        source: common['common.source'],
                        sources: common['common.sources'],
                    }}
                    atFirst={index === 0}
                    atLast={atLast}
                    onAnswer={(response) =>
                        progress.answerQuestion(question.id, response)
                    }
                    onBack={progress.previousQuestion}
                    onContinue={progress.nextQuestion}
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck
                            aria-hidden="true"
                            className="size-4 shrink-0"
                        />
                        {common['test.privacy']}
                    </p>
                    {restartAction}
                </div>
                <DialogContent
                    closeLabel={closeLabel}
                    aria-describedby={undefined}
                >
                    <DialogTitle className="font-heading">
                        {copy['session.completed.heading']}
                    </DialogTitle>
                    <DialogFooter
                        closeLabel={closeLabel}
                        className="flex-col gap-3 sm:flex-wrap sm:justify-start"
                    >
                        <DialogClose asChild>
                            <Button
                                onClick={progress.reviewAnswers}
                                className="whitespace-normal"
                            >
                                {copy['session.completed.edit']}
                            </Button>
                        </DialogClose>
                        {restartAction}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div className="space-y-5">
            <h1 className="font-heading text-[length:var(--font-size-headline)] font-medium">
                {copy['test.heading']}
            </h1>
            {storageNotice && (
                <p
                    role="status"
                    className="rounded-md border border-border bg-card px-4 py-3 text-sm"
                >
                    {storageNotice}
                </p>
            )}
            {renderQuestionnaire()}
            {storage !== 'pending' &&
                (progress.status === 'not-started' ||
                    storage === 'invalid' ||
                    storage === 'incompatible') && (
                    <Link
                        className="inline-block text-sm text-ring underline"
                        to={`/${lang}/`}
                    >
                        {common['recovery.home']}
                    </Link>
                )}
        </div>
    );
}
