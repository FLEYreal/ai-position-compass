import { cn } from '@/shared/lib';
import type { Language } from '@/shared/config';
import { Progress } from './progress';
import { Ruler } from './ruler';

export function QuestionProgress({
    total,
    answered,
    currentQuestion,
    language = 'en',
    note,
    label,
    className,
}: {
    total: number;
    answered: number;
    currentQuestion?: number;
    language?: Language;
    note?: string;
    label?: string;
    className?: string;
}) {
    const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0;
    const done =
        Number.isFinite(answered) ?
            Math.max(0, Math.min(count, Math.floor(answered)))
        :   0;
    const current =
        currentQuestion == null || !Number.isFinite(currentQuestion) ?
            Math.min(count, done + 1)
        :   Math.max(0, Math.min(count, Math.floor(currentQuestion)));
    const remaining = count - done;
    const percent = count === 0 ? 0 : (done / count) * 100;
    const t = (en: string, ru: string) => (language === 'ru' ? ru : en);
    const summary = t(
        `${done} answered · ${remaining} remaining`,
        `Ответов: ${done} · Осталось: ${remaining}`,
    );
    return (
        <section
            className={cn('min-w-0 text-ring', className)}
            aria-label={t('Question progress', 'Прогресс вопросов')}
        >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 text-[length:var(--font-size-construct)] text-muted-foreground">
                <span>
                    {label ??
                        (done === count && count > 0 ?
                            t('COMPLETE', 'ЗАВЕРШЕНО')
                        :   t('QUESTION', 'ВОПРОС'))}{' '}
                    <strong className="ml-2 text-lg font-medium text-ring tabular-nums">
                        {String(current).padStart(2, '0')}
                    </strong>{' '}
                    / {String(count).padStart(2, '0')}
                </span>
                {note && <span className="text-xs italic">{note}</span>}
            </div>
            <Progress
                value={percent}
                aria-label={t('Answered questions', 'Отвеченные вопросы')}
                aria-valuetext={summary}
                className="mt-3 h-auto overflow-visible rounded-none bg-transparent"
            >
                <Ruler
                    value={percent}
                    variant="progress"
                    labels={Array.from({ length: 5 }, (_, index) =>
                        String(Math.round((index * count) / 4)),
                    )}
                />
            </Progress>
            <p
                className="mt-1 text-xs text-muted-foreground"
                aria-live="polite"
            >
                {summary}
            </p>
        </section>
    );
}
