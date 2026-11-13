import { describe, expect, test } from 'vitest';
import {
    calculateAxesScore,
    type AnswerValue,
    type QuestionAnswer,
} from '@/entities/scoring';
import type { QuestionKey } from '@/shared/config';

const keys: QuestionKey[] = [1, -1, 1, -1, 1, -1, 1];
const responses = (values: AnswerValue[]): QuestionAnswer[] =>
    values.map((value, i) => ({
        key: keys[i],
        value,
        weight: 1,
        unsure: false,
    }));

describe('calculateAxesScore: separate statement keys and response values', () => {
    test.each([
        {
            name: 'neutral responses',
            values: [0, 0, 0, 0, 0, 0, 0],
            expected: 50,
        },
        {
            name: 'high-pole responses',
            values: [1, -1, 1, -1, 1, -1, 1],
            expected: 100,
        },
        {
            name: 'low-pole responses',
            values: [-1, 1, -1, 1, -1, 1, -1],
            expected: 0,
        },
        {
            name: 'half-strength high-pole responses',
            values: [0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5],
            expected: 75,
        },
        {
            name: 'half-strength low-pole responses',
            values: [-0.5, 0.5, -0.5, 0.5, -0.5, 0.5, -0.5],
            expected: 25,
        },
    ] satisfies { name: string; values: AnswerValue[]; expected: number }[])(
        '$name -> $expected',
        ({ values, expected }) => {
            expect(
                calculateAxesScore([
                    { axisId: 'regulation', answers: responses(values) },
                ]),
            ).toEqual([{ axisId: 'regulation', score: expected }]);
        },
    );

    test('checks the original statement directions rather than multiplied contributions', () => {
        // Every oriented contribution is positive, but both statement directions exist.
        const answers = responses([1, -1, 1, -1, 1, -1, 1]);
        expect(calculateAxesScore([{ axisId: 'regulation', answers }])).toEqual(
            [{ axisId: 'regulation', score: 100 }],
        );
    });

    test('opposing response signs do not replace an unanswered statement direction', () => {
        const answers = responses([1, 0, -1, 0, 0.5, 0, -0.5]).map((a) => ({
            ...a,
            unsure: a.key === -1,
        }));
        expect(calculateAxesScore([{ axisId: 'regulation', answers }])).toEqual(
            [{ axisId: 'regulation', score: null }],
        );
    });

    test('Unsure values do not affect either the score or its denominator', () => {
        const first = responses([1, -1, 1, -1, 1, -1, 1]).map((a, i) => ({
            ...a,
            unsure: i >= 4,
        }));
        const changed = first.map((a) =>
            a.unsure ? { ...a, value: 0 as const } : a,
        );
        expect(
            calculateAxesScore([{ axisId: 'regulation', answers: first }]),
        ).toEqual([{ axisId: 'regulation', score: 100 }]);
        expect(
            calculateAxesScore([{ axisId: 'regulation', answers: changed }]),
        ).toEqual([{ axisId: 'regulation', score: 100 }]);
    });

    test('does not modify question keys or responses while calculating', () => {
        const answers = responses([1, -1, 1, -1, 1, -1, 1]);
        const before = structuredClone(answers);
        expect(calculateAxesScore([{ axisId: 'regulation', answers }])).toEqual(
            [{ axisId: 'regulation', score: 100 }],
        );
        expect(answers).toEqual(before);
    });
});
