import { ArrowLeft, ArrowRight, Check, CircleHelp } from 'lucide-react';
import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import type { AnswerValue, QuestionResponse } from '@/entities/scoring';
import type { AxisId, SuggestionDefinition } from '@/shared/config';
import { cn } from '@/shared/lib';
import { AxisIcon, Button, RadioGroup, RadioGroupItem } from '@/shared/ui';

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

    function handleShortcut(event: KeyboardEvent<HTMLDivElement>) {
        if (
            event.defaultPrevented ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.repeat ||
            event.nativeEvent.isComposing ||
            !(event.target instanceof HTMLElement) ||
            !event.target.closest('[data-answer]')
        )
            return;

        const next =
            event.code === 'KeyU' || event.key.toLowerCase() === 'u' ?
                'unsure'
            :   agreementValues[Number(event.key) - 1];
        if (next === undefined) return;

        event.preventDefault();
        onAnswer(next);
        event.currentTarget
            .querySelector<HTMLElement>(`[data-answer="${next}"]`)
            ?.focus();
    }

    return (
        <section className="relative isolate overflow-hidden rounded-[15px] border border-t-[3px] border-border border-t-foreground bg-card px-[30px] pt-7 pb-[25px] max-[800px]:px-[21px] max-[800px]:py-[22px] max-[560px]:rounded-[13px] max-[560px]:px-[17px] max-[560px]:py-5">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 right-3 -z-10 font-heading text-[90px] leading-none font-medium text-foreground/[0.065] tabular-nums max-[560px]:top-0.5 max-[560px]:text-[62px]"
            >
                {String(position).padStart(2, '0')}
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[length:var(--font-size-construct)] font-semibold">
                {developerLabel && (
                    <span className="w-full text-muted-foreground">
                        {developerLabel}
                    </span>
                )}
                <span className="rounded-sm bg-foreground px-2 py-1 text-background">
                    {construct}
                </span>
                <span
                    className="inline-flex items-center gap-1.5 rounded-sm bg-current/10 px-2 py-1"
                    style={{ color: `var(--axis-${axisToken})` }}
                >
                    <AxisIcon axis={axis} size={15} />
                    {axisLabel}
                </span>
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
                    className="mt-4 flex max-w-[68ch] items-start gap-3 rounded-[7px] border border-border bg-background p-3 text-sm"
                >
                    <CircleHelp
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-ring"
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
                                            className="text-ring underline underline-offset-2"
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
            <div className="mt-6" onKeyDown={handleShortcut}>
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
                                    className="text-xs text-muted-foreground"
                                    aria-hidden="true"
                                >
                                    {index + 1}
                                </kbd>
                            </button>
                        </RadioGroupItem>
                    ))}
                </RadioGroup>
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Button
                        variant={
                            response === 'unsure' ? 'secondary' : 'outline'
                        }
                        size="sm"
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
                        className="text-xs text-muted-foreground"
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
                    className="order-last col-span-2 text-xs text-muted-foreground sm:order-0 sm:col-span-1 sm:text-center"
                >
                    {copy.keyboard}
                </p>
                <Button
                    disabled={response === undefined}
                    onClick={onContinue}
                    className="justify-self-end whitespace-normal max-[360px]:px-3"
                >
                    {atLast ? copy.finish : copy.next}
                    <ArrowRight aria-hidden="true" />
                </Button>
            </div>
        </section>
    );
}
