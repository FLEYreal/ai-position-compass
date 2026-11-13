import { describe, expect, test } from 'vitest';
import {
    calculateAxesScore,
    calculateScore,
    type AnswerValue,
    type QuestionAnswer,
} from '@/entities/scoring';
import {
    type AxisId,
    type QuestionKey,
    type QuestionWeight,
} from '@/shared/config';

const answer = (
    key: QuestionKey,
    value: AnswerValue,
    weight: QuestionWeight = 1,
    unsure = false,
): QuestionAnswer => ({ key, value, weight, unsure });
const keys: QuestionKey[] = [1, -1, 1, -1, 1, -1, 1];
const regulation = (values: (AnswerValue | 'unsure')[]): QuestionAnswer[] =>
    values.map((value, i) =>
        answer(keys[i], value === 'unsure' ? 0 : value, 1, value === 'unsure'),
    );
const score = (answers: QuestionAnswer[], axisId: AxisId = 'regulation') =>
    calculateAxesScore([{ axisId, answers }]);

describe('calculateScore: already-oriented weighted contributions', () => {
    // Intermediate arithmetic retains precision; the public axis score rounds.
    test.each([
        { name: 'high pole', input: [{ key: 1, weight: 1 }], expected: 100 },
        { name: 'low pole', input: [{ key: -1, weight: 1 }], expected: 0 },
        { name: 'neutral', input: [{ key: 0, weight: 1 }], expected: 50 },
        { name: 'agree', input: [{ key: 0.5, weight: 1 }], expected: 75 },
        { name: 'disagree', input: [{ key: -0.5, weight: 1 }], expected: 25 },
        {
            name: 'equal opposing contributions',
            input: [
                { key: 1, weight: 1 },
                { key: -1, weight: 1 },
            ],
            expected: 50,
        },
        {
            name: 'secondary weight changes numerator and denominator',
            input: [
                { key: 1, weight: 1 },
                { key: -1, weight: 0.5 },
            ],
            expected: 66.66666666666667,
        },
        {
            name: 'neutral retains denominator weight',
            input: [
                { key: 1, weight: 1 },
                { key: 0, weight: 1 },
            ],
            expected: 75,
        },
        {
            name: 'fractional intermediate',
            input: [
                { key: 1, weight: 1 },
                { key: 0.5, weight: 1 },
                { key: 0, weight: 1 },
                { key: -0.5, weight: 1 },
            ],
            expected: 62.5,
        },
    ])('$name', ({ input, expected }) => {
        expect(calculateScore(input)).toBeCloseTo(expected, 10);
    });
});

describe('calculateAxesScore: response meaning and canonical precision', () => {
    test.each([
        {
            name: 'neutral across both directions',
            values: [0, 0, 0, 0, 0, 0, 0],
            expected: 50,
        },
        {
            name: 'agreement with high-key and disagreement with low-key statements',
            values: [1, -1, 1, -1, 1, -1, 1],
            expected: 100,
        },
        {
            name: 'the low-pole response pattern',
            values: [-1, 1, -1, 1, -1, 1, -1],
            expected: 0,
        },
        {
            name: 'all positive responses still cover both statement directions',
            values: [1, 1, 1, 1, 1, 1, 1],
            expected: 57,
        },
        {
            name: 'half-strength responses',
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
            expect(score(regulation(values))).toEqual([
                { axisId: 'regulation', score: expected },
            ]);
        },
    );

    test('rounds the final 62.5 to 63 without rounding contributions', () => {
        // Oriented sum: 1 - 1 + .5 + .5 = 1, denominator 4.
        expect(
            score(regulation([1, 1, 0.5, -0.5, 'unsure', 'unsure', 'unsure'])),
        ).toEqual([{ axisId: 'regulation', score: 63 }]);
    });

    test('Unsure values cannot move a score', () => {
        const first = regulation([1, -1, 1, -1, 'unsure', 'unsure', 'unsure']);
        const changed = first.map((a) =>
            a.unsure ? { ...a, value: -1 as const } : a,
        );
        expect(score(first)).toEqual([{ axisId: 'regulation', score: 100 }]);
        expect(score(changed)).toEqual([{ axisId: 'regulation', score: 100 }]);
    });
});

describe('calculateAxesScore: primary coverage', () => {
    test('no supplied axes produce no scored axes', () => {
        expect(calculateAxesScore([])).toEqual([]);
    });
    test('an axis with no responses is Undefined', () => {
        expect(score([])).toEqual([{ axisId: 'regulation', score: null }]);
    });
    test('all Unsure is Undefined rather than neutral', () => {
        expect(score(regulation(Array(7).fill('unsure')))).toEqual([
            { axisId: 'regulation', score: null },
        ]);
    });
    test('three of seven primary responses are insufficient', () => {
        expect(
            score(
                regulation([1, -1, 1, 'unsure', 'unsure', 'unsure', 'unsure']),
            ),
        ).toEqual([{ axisId: 'regulation', score: null }]);
    });
    test('four of seven neutral primary responses satisfy coverage', () => {
        expect(
            score(regulation([0, 0, 0, 0, 'unsure', 'unsure', 'unsure'])),
        ).toEqual([{ axisId: 'regulation', score: 50 }]);
    });
    test.each([
        { axisId: 'openSourcePreference', directions: [1, -1, 1, -1, 1] },
        { axisId: 'openness', directions: [1, -1, 1, -1, -1, 1] },
    ] satisfies { axisId: AxisId; directions: QuestionKey[] }[])(
        '$axisId requires three primary responses',
        ({ axisId, directions }) => {
            const below = directions.map((key, i) => answer(key, 0, 1, i >= 2));
            const enough = directions.map((key, i) =>
                answer(key, 0, 1, i >= 3),
            );
            expect(score(below, axisId)).toEqual([{ axisId, score: null }]);
            expect(score(enough, axisId)).toEqual([{ axisId, score: 50 }]);
        },
    );
    test('opposite response signs do not replace missing primary key coverage', () => {
        expect(
            score(regulation([1, 'unsure', -1, 'unsure', 0, 'unsure', 0.5])),
        ).toEqual([{ axisId: 'regulation', score: null }]);
    });
    test('an Unsure negative-key statement cannot supply primary key coverage', () => {
        expect(
            score(regulation([1, 'unsure', 1, 'unsure', 1, 'unsure', 1])),
        ).toEqual([{ axisId: 'regulation', score: null }]);
    });
});

describe('calculateAxesScore: secondary contributions', () => {
    const primary = () =>
        regulation([1, 1, 1, 0, 'unsure', 'unsure', 'unsure']);
    test.each([
        {
            name: 'half-weight disagreement',
            secondary: answer(1, -1, 0.5),
            expected: 56,
        },
        {
            name: 'its own reverse key',
            secondary: answer(-1, -1, 0.5),
            expected: 67,
        },
        {
            name: 'neutral denominator weight',
            secondary: answer(1, 0, 0.5),
            expected: 61,
        },
        {
            name: 'Unsure contributes no weight',
            secondary: answer(1, -1, 0.5, true),
            expected: 63,
        },
    ])('$name -> $expected', ({ secondary, expected }) => {
        // Primary sum 1, weight 4. Secondary cases yield .5/4.5, 1.5/4.5,
        // 1/4.5, and 1/4 respectively, then normalize and round once.
        expect(score([...primary(), secondary], 'control')).toEqual([
            { axisId: 'control', score: expected },
        ]);
    });
    test('secondary evidence cannot rescue three of seven primary responses', () => {
        const primary = regulation([
            1,
            -1,
            1,
            'unsure',
            'unsure',
            'unsure',
            'unsure',
        ]);
        expect(score([...primary, answer(-1, 1, 0.5)], 'control')).toEqual([
            { axisId: 'control', score: null },
        ]);
    });
    test('a secondary negative key cannot supply missing primary direction', () => {
        const primary = regulation([1, 'unsure', 1, 'unsure', 1, 'unsure', 1]);
        expect(score([...primary, answer(-1, 1, 0.5)], 'control')).toEqual([
            { axisId: 'control', score: null },
        ]);
    });
});

describe('calculateAxesScore: independent, repeatable calculations', () => {
    test('scores each axis independently without mutating inputs', () => {
        const input = [
            {
                axisId: 'regulation' as const,
                answers: regulation([1, -1, 1, -1, 1, -1, 1]),
            },
            {
                axisId: 'control' as const,
                answers: regulation(Array(7).fill('unsure')),
            },
        ];
        const before = structuredClone(input);
        const expected = [
            { axisId: 'regulation', score: 100 },
            { axisId: 'control', score: null },
        ];
        expect(calculateAxesScore(input)).toEqual(expected);
        expect(calculateAxesScore(input)).toEqual(expected);
        expect(input).toEqual(before);
    });
    test('response order cannot change the canonical result', () => {
        const input = regulation([
            1,
            1,
            0.5,
            -0.5,
            'unsure',
            'unsure',
            'unsure',
        ]);
        expect(score(input.toReversed())).toEqual([
            { axisId: 'regulation', score: 63 },
        ]);
    });
});
