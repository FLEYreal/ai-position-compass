import {
    ArrowLeft,
    ArrowRight,
    Check,
    CircleHelp,
    Command,
} from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { AnswerValue, QuestionResponse } from '@/entities/scoring';
import type { AxisId, SuggestionDefinition } from '@/shared/config';
import { cn } from '@/shared/lib';
import {
    AxisExplanation,
    AxisIcon,
    Button,
    DialogTrigger,
    RadioGroup,
    RadioGroupItem,
} from '@/shared/ui';

const agreementValues = [
    -1, -0.5, 0, 0.5, 1,
] as const satisfies readonly AnswerValue[];

export function QuestionSheet({
    id,
    position,
    statement,
    construct,
    axis,
    axisLabel,
    axisDescription,
    developerLabel,
    hint,
    response,
    choices,
    copy,
    atFirst,
    atLast,
    onAnswer,
    onBack,
    onContinue,
}: {
    id: string;
    position: number;
    statement: string;
    construct: string;
    axis: AxisId;
    axisLabel: string;
    axisDescription: string;
    developerLabel?: string;
    hint?: { text: string; sources: SuggestionDefinition['sources'] };
    response: QuestionResponse | undefined;
    choices: readonly string[];
    copy: {
        prompt: string;
        unsure: string;
        unsureNote: string;
        keyboard: string;
        back: string;
        next: string;
        finish: string;
        source: string;
        sources: string;
    };
    atFirst: boolean;
    atLast: boolean;
    onAnswer: (response: QuestionResponse) => void;
    onBack: () => void;
    onContinue: () => void;
}) {
    const heading = useRef<HTMLHeadingElement>(null);
    const answers = useRef<HTMLDivElement>(null);
    const prompt = useId();
    const shortcuts = useId();
    const hintId = useId();
    const unsureNote = useId();
    const axisToken = axis.replace(
        /[A-Z]/g,
        (letter) => '-' + letter.toLowerCase(),
    );
    const citations = hint?.sources ?? [];

    useEffect(() => {
        heading.current?.focus();
    }, [id]);

    useEffect(() => {
        function handleShortcut(event: KeyboardEvent) {
            if (
                event.defaultPrevented ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.repeat ||
                event.isComposing ||
                (event.target instanceof Element &&
                    event.target.closest(
                        'input, textarea, select, [contenteditable], [role="menu"]',
                    )) ||
                document.querySelector(
                    '[role="dialog"][data-state="open"], [role="alertdialog"][data-state="open"]',
                )
            )
                return;

            const next =
                event.code === 'KeyU' || event.key.toLowerCase() === 'u' ?
                    'unsure'
                :   agreementValues[Number(event.key) - 1];
            if (next === undefined) return;

            event.preventDefault();
            onAnswer(next);
            answers.current
                ?.querySelector<HTMLElement>(`[data-answer="${next}"]`)
                ?.focus();
        }

        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, [onAnswer]);

    const continueButton = (
        <Button
            disabled={response === undefined}
            onClick={atLast ? undefined : onContinue}
            className="justify-self-end whitespace-normal max-[360px]:px-3"
        >
            {atLast ? copy.finish : copy.next}
            <ArrowRight aria-hidden="true" />
        </Button>
    );

    return (
        <section className="relative isolate overflow-hidden rounded-[15px] border border-t-[3px] border-border border-t-foreground bg-card px-[30px] pt-7 pb-[25px] max-[800px]:px-[21px] max-[800px]:py-[22px] max-[560px]:rounded-[13px] max-[560px]:px-[17px] max-[560px]:py-5">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute top-3 right-3 -z-10 font-heading text-[90px] leading-none font-medium text-foreground/[0.065] tabular-nums max-[560px]:text-[62px]"
            >
                {String(position).padStart(2, '0')}
            </span>
            <div className="flex max-w-[calc(100%-7rem)] flex-wrap items-center gap-2 text-[length:var(--font-size-construct)] font-semibold max-[640px]:max-w-[calc(100%-5rem)] max-[640px]:flex-col max-[640px]:items-start">
                {developerLabel && (
                    <span className="w-full text-muted-foreground">
                        {developerLabel}
                    </span>
                )}
                <span className="rounded-sm bg-foreground px-2 py-1 text-background">
                    {construct}
                </span>
                <AxisExplanation
                    key={id}
                    label={axisLabel}
                    description={axisDescription}
                >
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-auto min-h-7 min-w-0 max-w-full justify-start gap-1.5 rounded-sm border-current/40 bg-current/10 px-2 py-1 text-left text-[length:var(--font-size-construct)] whitespace-normal hover:bg-current/15 aria-expanded:bg-current/15"
                        style={{ color: `var(--axis-${axisToken})` }}
                    >
                        <AxisIcon axis={axis} className="size-[15px]" />
                        {axisLabel}
                    </Button>
                </AxisExplanation>
            </div>
            <h2
                ref={heading}
                tabIndex={-1}
                className="mt-4 max-w-[42ch] font-sans text-[length:var(--font-size-question)] leading-[var(--line-height-question)] font-medium tracking-[var(--letter-spacing-question)] focus:outline-none max-[560px]:text-[23px]"
            >
                {statement}
            </h2>
            {hint && (
                <aside
                    id={hintId}
                    className="my-8 flex items-start gap-[13px] rounded-[7px] border border-primary bg-[var(--paper-deep)] px-4 py-3 text-sm leading-relaxed max-[560px]:gap-[9px] max-[560px]:px-3"
                >
                    <CircleHelp
                        aria-hidden="true"
                        className="mt-[3px] size-4 shrink-0 text-ring"
                    />
                    <div className="min-w-0">
                        <p>{hint.text}</p>
                        {citations.length > 0 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {citations.length === 1 ?
                                    copy.source
                                :   copy.sources}{' '}
                                {citations.map(({ name, url }, index) => (
                                    <span key={url}>
                                        {index > 0 && ' · '}
                                        <a
                                            className="font-semibold underline underline-offset-2"
                                            href={url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {name}
                                        </a>
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>
                </aside>
            )}
            <div className="mt-6" ref={answers}>
                <p id={prompt} className="mb-2 text-sm font-semibold">
                    {copy.prompt}
                </p>
                <RadioGroup
                    aria-labelledby={prompt}
                    aria-describedby={
                        hint ? `${hintId} ${shortcuts}` : shortcuts
                    }
                    orientation="vertical"
                    className="gap-2"
                    value={typeof response === 'number' ? String(response) : ''}
                    onValueChange={(value) => {
                        const selected = agreementValues.find(
                            (answer) => String(answer) === value,
                        );
                        if (selected !== undefined) onAnswer(selected);
                    }}
                >
                    {agreementValues.map((value, index) => (
                        <RadioGroupItem
                            key={value}
                            value={String(value)}
                            data-answer={value}
                            aria-keyshortcuts={String(index + 1)}
                            asChild
                        >
                            <button
                                type="button"
                                onClick={(event) => event.currentTarget.focus()}
                                className={cn(
                                    'grid min-h-[58px] w-full grid-cols-[1.25rem_1fr_auto] items-center gap-3 rounded-md border px-3 text-left text-sm hover:border-ring focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring max-[560px]:min-h-[54px]',
                                    response === value ?
                                        'border-ring bg-[var(--soft-orange)]'
                                    :   'border-border bg-background',
                                )}
                            >
                                <span
                                    className="grid size-4 place-items-center rounded-full border border-current text-ring"
                                    aria-hidden="true"
                                    style={{
                                        background:
                                            response === value ? undefined : (
                                                `conic-gradient(currentColor ${index * 25}%, transparent 0)`
                                            ),
                                    }}
                                >
                                    {response === value && (
                                        <Check size={11} strokeWidth={3} />
                                    )}
                                </span>
                                {choices[index]}
                                <kbd
                                    className="inline-flex items-center gap-1.5 px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                                    aria-hidden="true"
                                >
                                    <Command className="size-3.5" />
                                    {index + 1}
                                </kbd>
                            </button>
                        </RadioGroupItem>
                    ))}
                </RadioGroup>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="aria-pressed:border-ring aria-pressed:bg-[var(--soft-orange)] aria-pressed:hover:bg-[var(--soft-orange)]"
                        aria-pressed={response === 'unsure'}
                        aria-keyshortcuts="U"
                        aria-describedby={`${unsureNote} ${shortcuts}`}
                        data-answer="unsure"
                        onClick={() => onAnswer('unsure')}
                    >
                        {copy.unsure}
                        <kbd
                            aria-hidden="true"
                            className="font-mono text-[0.7em]"
                        >
                            U
                        </kbd>
                    </Button>
                    <span
                        id={unsureNote}
                        className="hidden text-xs text-muted-foreground sm:inline"
                    >
                        {copy.unsureNote}
                    </span>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-[1fr_auto] items-center gap-2 border-t border-border pt-4 sm:grid-cols-[auto_1fr_auto]">
                <Button
                    variant="ghost"
                    disabled={atFirst}
                    onClick={onBack}
                    className="justify-self-start px-2 sm:px-4"
                >
                    <ArrowLeft aria-hidden="true" />
                    {copy.back}
                </Button>
                <p
                    id={shortcuts}
                    className="hidden text-xs text-muted-foreground sm:block sm:text-center"
                >
                    {copy.keyboard}
                </p>
                {atLast ?
                    <DialogTrigger asChild>{continueButton}</DialogTrigger>
                :   continueButton}
            </div>
        </section>
    );
}
