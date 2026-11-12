import { describe, expect, test } from 'vitest';
import {
    calculateAxesScore,
    calculateScore,
    type QuestionAnswer,
} from './axis';
import { type QuestionKey, type QuestionWeight } from '@/shared/config';

describe('calculateScore', () => {
    test('empty answers → 50 (default centre)', () => {
        expect(calculateScore([])).toBe(50);
    });

    test('all neutral → 50', () => {
        expect(
            calculateScore([
                { key: 0, weight: 1 },
                { key: 0, weight: 2 },
                { key: 0, weight: 3 },
            ]),
        ).toBe(50);
    });

    test('all strongly agree → 100', () => {
        expect(
            calculateScore([
                { key: 1, weight: 1 },
                { key: 1, weight: 1 },
                { key: 1, weight: 1 },
            ]),
        ).toBe(100);
    });

    test('all strongly disagree → 0', () => {
        expect(
            calculateScore([
                { key: -1, weight: 1 },
                { key: -1, weight: 2 },
                { key: -1, weight: 3 },
            ]),
        ).toBe(0);
    });

    test('single strongly agree → 100', () => {
        expect(calculateScore([{ key: 1, weight: 1 }])).toBe(100);
    });

    test('single agree → 75', () => {
        expect(calculateScore([{ key: 0.5, weight: 1 }])).toBe(75);
    });

    test('single neutral → 50', () => {
        expect(calculateScore([{ key: 0, weight: 1 }])).toBe(50);
    });

    test('single disagree → 25', () => {
        expect(calculateScore([{ key: -0.5, weight: 1 }])).toBe(25);
    });

    test('single strongly disagree → 0', () => {
        expect(calculateScore([{ key: -1, weight: 1 }])).toBe(0);
    });

    test('equal opposite answers cancel → 50', () => {
        expect(
            calculateScore([
                { key: 1, weight: 1 },
                { key: -1, weight: 1 },
            ]),
        ).toBe(50);

        expect(
            calculateScore([
                { key: 0.5, weight: 2 },
                { key: -0.5, weight: 2 },
            ]),
        ).toBe(50);
    });

    test('stronger weight dominates', () => {
        // +1 with weight 3 vs -1 with weight 1 → S = (3 - 1) / 4 = 0.5 → P = 75
        expect(
            calculateScore([
                { key: 1, weight: 3 },
                { key: -1, weight: 1 },
            ]),
        ).toBe(75);
    });

    test('mixed keys with different weights', () => {
        // (1*2) + (0.5*1) + (-0.5*1) + (-1*2) = 2 + 0.5 - 0.5 - 2 = 0 → 50
        expect(
            calculateScore([
                { key: 1, weight: 2 },
                { key: 0.5, weight: 1 },
                { key: -0.5, weight: 1 },
                { key: -1, weight: 2 },
            ]),
        ).toBe(50);
    });

    test('mostly agree → above 50', () => {
        // (1 + 0.5 + 0 + -0.5) / 4 = 1/4 = 0.25 → 62.5
        expect(
            calculateScore([
                { key: 1, weight: 1 },
                { key: 0.5, weight: 1 },
                { key: 0, weight: 1 },
                { key: -0.5, weight: 1 },
            ]),
        ).toBe(62.5);
    });

    test('mostly disagree → below 50', () => {
        // (-1 + -0.5 + 0 + 0.5) / 4 = -1/4 = -0.25 → 37.5
        expect(
            calculateScore([
                { key: -1, weight: 1 },
                { key: -0.5, weight: 1 },
                { key: 0, weight: 1 },
                { key: 0.5, weight: 1 },
            ]),
        ).toBe(37.5);
    });

    test('produces exact decimal results', () => {
        // (1*1 + 0.5*1) / 2 = 0.75 → 87.5
        expect(
            calculateScore([
                { key: 1, weight: 1 },
                { key: 0.5, weight: 1 },
            ]),
        ).toBe(87.5);
    });
});

describe('calculateAxesScore', () => {
    const answer = (
        key: QuestionKey,
        weight: QuestionWeight,
        unsure = false,
    ): QuestionAnswer => ({ key, weight, unsure });

    test('single axis with valid answers → calculated score', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'capability',
                    answers: [answer(1, 1), answer(-1, 1)],
                },
            ]),
        ).toEqual([{ axisId: 'capability', score: 50 }]);
    });

    test('unsure answers are excluded from the score', () => {
        // Certain answers: +1 (weight 1), -1 (weight 1) → 50
        expect(
            calculateAxesScore([
                {
                    axisId: 'aiDelegation',
                    answers: [
                        answer(1, 1),
                        answer(1, 0.5, true),
                        answer(-1, 1),
                        answer(-1, 0.5, true),
                    ],
                },
            ]),
        ).toEqual([{ axisId: 'aiDelegation', score: 50 }]);
    });

    test('weights affect the resulting score', () => {
        // Certain answers: +1 (weight 1), -1 (weight 0.5)
        // Weighted mean: (1 - 0.5) / 1.5 = 1/3 → 66.666...
        expect(
            calculateAxesScore([
                {
                    axisId: 'regulation',
                    answers: [
                        answer(1, 1),
                        answer(-1, 0.5),
                        answer(1, 0.5, true),
                    ],
                },
            ]),
        ).toEqual([
            {
                axisId: 'regulation',
                score: ((1 / 3 + 1) / 2) * 100,
            },
        ]);
    });

    test('calculates each axis independently', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'capability',
                    answers: [answer(1, 1), answer(-1, 1)],
                },
                {
                    axisId: 'ecology',
                    answers: [answer(1, 1), answer(-1, 0.5, true)],
                },
            ]),
        ).toEqual([
            { axisId: 'capability', score: 50 },
            { axisId: 'ecology', score: null },
        ]);
    });

    test('preserves the input axis order', () => {
        const result = calculateAxesScore([
            {
                axisId: 'labor',
                answers: [answer(1, 1), answer(-1, 1)],
            },
            {
                axisId: 'surveillance',
                answers: [answer(1, 0.5), answer(-1, 1)],
            },
            {
                axisId: 'creativity',
                answers: [answer(1, 1), answer(-1, 0.5, true)],
            },
        ]);

        expect(result.map(({ axisId }) => axisId)).toEqual([
            'labor',
            'surveillance',
            'creativity',
        ]);
    });

    test('empty answers → null', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'openness',
                    answers: [],
                },
            ]),
        ).toEqual([{ axisId: 'openness', score: null }]);
    });

    test('all answers unsure → null', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'geopolitics',
                    answers: [answer(1, 1, true), answer(-1, 1, true)],
                },
            ]),
        ).toEqual([{ axisId: 'geopolitics', score: null }]);
    });

    test('too few certain answers → null', () => {
        // 4 questions require at least floor(4 / 2) = 2 certain answers;
        // only 1 is certain.
        expect(
            calculateAxesScore([
                {
                    axisId: 'existentialRisk',
                    answers: [
                        answer(1, 1),
                        answer(-1, 0.5, true),
                        answer(1, 0.5, true),
                        answer(-1, 1, true),
                    ],
                },
            ]),
        ).toEqual([{ axisId: 'existentialRisk', score: null }]);
    });

    test('exactly half of answers certain is sufficient for an even number of questions', () => {
        // 4 questions, 2 certain answers → threshold met
        expect(
            calculateAxesScore([
                {
                    axisId: 'dispacementRisk',
                    answers: [
                        answer(1, 1),
                        answer(-1, 1),
                        answer(1, 0.5, true),
                        answer(-1, 0.5, true),
                    ],
                },
            ]),
        ).toEqual([{ axisId: 'dispacementRisk', score: 50 }]);
    });

    test('uneven number of questions uses floor for the threshold', () => {
        // 5 questions require at least floor(5 / 2) = 2 certain answers
        expect(
            calculateAxesScore([
                {
                    axisId: 'openSourcePreference',
                    answers: [
                        answer(1, 1),
                        answer(-1, 1),
                        answer(1, 0.5, true),
                        answer(-1, 0.5, true),
                        answer(1, 1, true),
                    ],
                },
            ]),
        ).toEqual([{ axisId: 'openSourcePreference', score: 50 }]);
    });

    test('only positive answers → null', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'capability',
                    answers: [answer(1, 1), answer(1, 0.5)],
                },
            ]),
        ).toEqual([{ axisId: 'capability', score: null }]);
    });

    test('only negative answers → null', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'aiDelegation',
                    answers: [answer(-1, 1), answer(-1, 0.5)],
                },
            ]),
        ).toEqual([{ axisId: 'aiDelegation', score: null }]);
    });

    test('one positive and one negative unsure answer → null', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'control',
                    answers: [answer(1, 1, true), answer(-1, 1, true)],
                },
            ]),
        ).toEqual([{ axisId: 'control', score: null }]);
    });

    test('opposite poles must be among certain answers', () => {
        expect(
            calculateAxesScore([
                {
                    axisId: 'geopolitics',
                    answers: [
                        answer(1, 1),
                        answer(-1, 0.5, true),
                        answer(1, 0.5, true),
                    ],
                },
            ]),
        ).toEqual([{ axisId: 'geopolitics', score: null }]);
    });
});
