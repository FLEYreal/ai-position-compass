import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { AxisScale, QuestionProgress } from './index';

const englishProgress = {
    progressLabel: 'Question progress',
    answeredLabel: 'Answered questions',
    questionLabel: 'QUESTION',
    completeLabel: 'COMPLETE',
    summary: (answered: number, remaining: number) =>
        `${answered} answered · ${remaining} remaining`,
};
const russianProgress = {
    progressLabel: 'Прогресс вопросов',
    answeredLabel: 'Отвеченные вопросы',
    questionLabel: 'ВОПРОС',
    completeLabel: 'ЗАВЕРШЕНО',
    summary: (answered: number, remaining: number) =>
        `Ответов: ${answered} · Осталось: ${remaining}`,
};

describe('question progress', () => {
    test('reports answered and remaining counts independently of the current question', () => {
        const { rerender } = render(
            <QuestionProgress
                messages={englishProgress}
                total={66}
                answered={12}
                currentQuestion={25}
            />,
        );
        const progress = screen.getByRole('progressbar', {
            name: 'Answered questions',
        });
        expect(progress).toHaveAttribute(
            'aria-valuetext',
            '12 answered · 54 remaining',
        );
        expect(Number(progress.getAttribute('aria-valuenow'))).toBeCloseTo(
            (12 / 66) * 100,
        );
        expect(screen.getByText('25')).toBeInTheDocument();
        rerender(
            <QuestionProgress
                messages={englishProgress}
                total={81}
                answered={81}
            />,
        );
        expect(progress).toHaveAttribute('aria-valuenow', '100');
        expect(progress).toHaveAttribute(
            'aria-valuetext',
            '81 answered · 0 remaining',
        );
        expect(
            screen.getByText('COMPLETE', { exact: false }),
        ).toBeInTheDocument();
    });
    test('handles an empty questionnaire without invalid progress values', () => {
        render(
            <QuestionProgress
                total={0}
                answered={0}
                messages={russianProgress}
            />,
        );
        expect(screen.getByRole('progressbar')).toHaveAttribute(
            'aria-valuenow',
            '0',
        );
        expect(screen.getByRole('progressbar')).toHaveAttribute(
            'aria-valuetext',
            'Ответов: 0 · Осталось: 0',
        );
    });
});

describe('axis scale', () => {
    test('exposes a measurement rather than claiming task completion', () => {
        const { rerender } = render(
            <AxisScale
                undefinedLabel="Axis is undefined"
                value={39}
                label="Regulation"
                lowLabel="Let them build"
                highLabel="Strict oversight"
                annotation="you are here"
            />,
        );
        expect(
            screen.getByRole('meter', { name: 'Regulation' }),
        ).toHaveAttribute('value', '39');
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        rerender(
            <AxisScale
                undefinedLabel="Axis is undefined"
                value={100}
                label="Regulation"
                lowLabel="Let them build"
                highLabel="Strict oversight"
            />,
        );
        expect(screen.getByRole('meter')).toHaveAttribute('value', '100');
    });
    test('does not represent an undefined coordinate as a zero score', () => {
        const { container } = render(
            <AxisScale
                value={null}
                label="Ecology"
                lowLabel="Low harm"
                highLabel="High harm"
                undefinedLabel="Недостаточно данных"
            />,
        );
        expect(screen.queryByRole('meter')).not.toBeInTheDocument();
        expect(
            screen.getByRole('group', { name: 'Ecology' }),
        ).toBeInTheDocument();
        expect(screen.getByText('Недостаточно данных')).toBeInTheDocument();
        expect(container.querySelector('svg')).not.toBeInTheDocument();
        expect(screen.getByText('Low harm')).toBeInTheDocument();
        expect(screen.getByText('High harm')).toBeInTheDocument();
    });
});
