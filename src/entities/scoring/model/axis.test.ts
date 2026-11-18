import { describe, expect, test } from 'vitest';
import {
    calculateAxesScore,
    calculateScore,
    type AnswerValue,
    type QuestionAnswer,
} from '@/entities/scoring';
import {
    axes,
    coreQuestions,
    devQuestions,
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
    const source = (
        value: AnswerValue,
        key: QuestionKey = 1,
        unsure = false,
    ) => ({
        ...answer(1, value, 1, unsure),
        secondary: [{ axisId: 'control' as const, key, weight: 0.5 as const }],
    });
    const withSource = (
        answers: QuestionAnswer[],
        response: ReturnType<typeof source>,
    ) =>
        calculateAxesScore([
            { axisId: 'control', answers },
            { axisId: 'regulation', answers: [response] },
        ]);

    test.each([
        {
            name: 'half-weight disagreement',
            response: source(-1),
            expected: 56,
        },
        { name: 'its own reverse key', response: source(-1, -1), expected: 67 },
        {
            name: 'neutral denominator weight',
            response: source(0),
            expected: 61,
        },
        {
            name: 'Unsure contributes no weight',
            response: source(-1, 1, true),
            expected: 63,
        },
    ])(
        '$name -> $expected even when the source axis is Undefined',
        ({ response, expected }) => {
            // Primary sum 1, weight 4. Nested effects use the parent's response.
            expect(withSource(primary(), response)).toEqual([
                { axisId: 'control', score: expected },
                { axisId: 'regulation', score: null },
            ]);
        },
    );

    test('secondary evidence cannot rescue three of seven primary responses', () => {
        const insufficient = regulation([
            1,
            -1,
            1,
            'unsure',
            'unsure',
            'unsure',
            'unsure',
        ]);
        expect(withSource(insufficient, source(1, -1))).toEqual([
            { axisId: 'control', score: null },
            { axisId: 'regulation', score: null },
        ]);
    });

    test('a secondary negative key cannot supply missing primary direction', () => {
        const oneDirection = regulation([
            1,
            'unsure',
            1,
            'unsure',
            1,
            'unsure',
            1,
        ]);
        expect(withSource(oneDirection, source(1, -1))).toEqual([
            { axisId: 'control', score: null },
            { axisId: 'regulation', score: null },
        ]);
    });

    test('a target without primary answers remains Undefined', () => {
        expect(withSource([], source(1))).toEqual([
            { axisId: 'control', score: null },
            { axisId: 'regulation', score: null },
        ]);
    });

    test('multiple declared targets use their own keys without changing the source answer', () => {
        const response = {
            ...answer(1, 1),
            secondary: [
                {
                    axisId: 'control' as const,
                    key: 1 as const,
                    weight: 0.5 as const,
                },
                {
                    axisId: 'labor' as const,
                    key: -1 as const,
                    weight: 0.5 as const,
                },
            ],
        };
        const input = [
            {
                axisId: 'control' as const,
                answers: regulation([0, 0, 0, 0, 'unsure', 'unsure', 'unsure']),
            },
            {
                axisId: 'labor' as const,
                answers: regulation([0, 0, 0, 0, 'unsure', 'unsure', 'unsure']),
            },
            { axisId: 'regulation' as const, answers: [response] },
        ];
        const before = structuredClone(input);
        expect(calculateAxesScore(input)).toEqual([
            { axisId: 'control', score: 56 },
            { axisId: 'labor', score: 44 },
            { axisId: 'regulation', score: null },
        ]);
        expect(input).toEqual(before);
    });

    test('multiple source questions contribute to the same target', () => {
        const input = [
            { axisId: 'control' as const, answers: primary() },
            { axisId: 'regulation' as const, answers: [source(1), source(-1)] },
        ];
        // Primary sum 1; opposing effects cancel, but both add .5 weight: 60.
        expect(calculateAxesScore(input)).toEqual([
            { axisId: 'control', score: 60 },
            { axisId: 'regulation', score: null },
        ]);
    });

    test('source/target input order does not change secondary scoring', () => {
        const input = [
            { axisId: 'control' as const, answers: primary() },
            { axisId: 'regulation' as const, answers: [source(-1)] },
        ];
        expect(calculateAxesScore(input.toReversed())).toEqual([
            { axisId: 'regulation', score: null },
            { axisId: 'control', score: 56 },
        ]);
    });

    test('effects aimed at an omitted axis do not create extra output axes', () => {
        expect(
            calculateAxesScore([
                { axisId: 'regulation', answers: [source(1)] },
            ]),
        ).toEqual([{ axisId: 'regulation', score: null }]);
    });

    test('an answer is primary because of its placement, regardless of its weight', () => {
        // Structural regression: do not infer the contribution role from weight.
        const answers = [
            answer(1, 0, 0.5),
            answer(-1, 0, 0.5),
            answer(1, 0, 0.5),
            answer(-1, 0, 1, true),
            answer(1, 0, 1, true),
        ];
        expect(score(answers, 'openSourcePreference')).toEqual([
            { axisId: 'openSourcePreference', score: 50 },
        ]);
    });

    test('no secondary field and an empty secondary list behave identically', () => {
        const answers = regulation([1, -1, 1, -1, 1, -1, 1]);
        expect(score(answers)).toEqual([{ axisId: 'regulation', score: 100 }]);
        expect(score(answers.map((a) => ({ ...a, secondary: [] })))).toEqual([
            { axisId: 'regulation', score: 100 },
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

describe('canonical question inputs: SPEC and research archive', () => {
    test('preserves the explicit axis IDs and order', () => {
        expect(axes.map((a) => a.id)).toEqual([
            'regulation',
            'control',
            'geopolitics',
            'openness',
            'capability',
            'existentialRisk',
            'ecology',
            'creativity',
            'labor',
            'surveillance',
            'openSourcePreference',
            'aiDelegation',
            'displacementRisk',
        ]);
    });
    test('retains the canonical module counts', () => {
        expect(coreQuestions).toHaveLength(66);
        expect(devQuestions).toHaveLength(15);
    });
    test('preserves the three declared secondary links', () => {
        const links = coreQuestions.flatMap((q) =>
            'secondary' in q ?
                q.secondary.map((s) => ({ questionId: q.id, ...s }))
            :   [],
        );
        expect(
            links.sort((a, b) => a.questionId.localeCompare(b.questionId)),
        ).toEqual([
            { questionId: 'C5', axisId: 'geopolitics', key: 1, weight: 0.5 },
            { questionId: 'K1', axisId: 'labor', key: 1, weight: 0.5 },
            { questionId: 'R1', axisId: 'control', key: 1, weight: 0.5 },
        ]);
    });
});
