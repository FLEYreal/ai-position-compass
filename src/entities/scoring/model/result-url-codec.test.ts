import { expect, test } from 'vitest';
import {
    decodeResultPayload,
    encodeResultPayload,
    useQuestionnaireStore,
    type UserAxisScore,
} from '@/entities/scoring';
import { coreQuestions, devQuestions } from '@/shared/config';

// A v1 test vector independent of the codec and the current app axis order.
const payload = 'AQEAAQsYITJDU2Nk_yo-';
const axisScores: UserAxisScore[] = [
    { axisId: 'regulation', score: 0 },
    { axisId: 'control', score: 1 },
    { axisId: 'geopolitics', score: 11 },
    { axisId: 'openness', score: 24 },
    { axisId: 'capability', score: 33 },
    { axisId: 'existentialRisk', score: 50 },
    { axisId: 'ecology', score: 67 },
    { axisId: 'creativity', score: 83 },
    { axisId: 'labor', score: 99 },
    { axisId: 'surveillance', score: 100 },
    { axisId: 'openSourcePreference', score: null },
    { axisId: 'aiDelegation', score: 42 },
    { axisId: 'displacementRisk', score: 62 },
];

test('encodes the exact v1 wire format regardless of input order', () => {
    expect(
        encodeResultPayload({
            axisScores: axisScores.toReversed(),
            includeDeveloper: true,
        }),
    ).toBe(payload);
    expect(decodeResultPayload(payload)).toEqual({
        ok: true,
        version: 1,
        axisScores,
        includeDeveloper: true,
    });
});

test('preserves every whole score from zero to one hundred', () => {
    for (let score = 0; score <= 100; score++) {
        const scores = axisScores.map(({ axisId }) => ({ axisId, score }));
        expect(
            decodeResultPayload(
                encodeResultPayload({
                    axisScores: scores,
                    includeDeveloper: true,
                }),
            ),
        ).toMatchObject({ ok: true, axisScores: scores });
    }
});

test.each([
    [false, 'AQAAAQsYITJDU2Nk____'],
    [true, 'AQEAAQsYITJDU2Nk____'],
] as const)(
    'preserves developer participation (%s) with three Undefined developer axes',
    (includeDeveloper, expectedPayload) => {
        const scores = [
            ...axisScores.slice(0, -3),
            ...axisScores
                .slice(-3)
                .map(({ axisId }) => ({ axisId, score: null })),
        ];
        expect(
            encodeResultPayload({ axisScores: scores, includeDeveloper }),
        ).toBe(expectedPayload);
        expect(decodeResultPayload(expectedPayload)).toMatchObject({
            ok: true,
            axisScores: scores,
            includeDeveloper,
        });
    },
);

test.each([false, true])(
    'round-trips a questionnaire result through a URL with developer participation %s',
    async (includeDeveloper) => {
        localStorage.clear();
        await useQuestionnaireStore.persist.rehydrate();
        const { reset, answerQuestion, createResult } =
            useQuestionnaireStore.getState();
        reset(includeDeveloper);
        const questions =
            includeDeveloper ?
                [...coreQuestions, ...devQuestions]
            :   coreQuestions;
        for (const { id } of questions) answerQuestion(id, 0);

        const result = createResult();
        expect(result).not.toBeNull();
        const query = new URLSearchParams({ r: encodeResultPayload(result!) });
        localStorage.clear();

        expect(
            decodeResultPayload(new URLSearchParams(query.toString()).get('r')),
        ).toEqual({
            ok: true,
            version: 1,
            axisScores: result?.axisScores,
            includeDeveloper,
        });
    },
);

test('reports an absent query parameter as missing', () => {
    expect(decodeResultPayload(new URLSearchParams().get('r'))).toEqual({
        ok: false,
        reason: 'missing',
    });
});

test.each([
    ['empty value', ''],
    ['truncated value', payload.slice(1)],
    ['extra base64 group', payload + 'AAAA'],
    ['padding', payload.slice(0, -1) + '='],
    ['standard base64 alphabet', 'AQEAAQsYITJDU2Nk/yo+'],
    ['whitespace', payload.slice(0, -1) + '\n'],
    ['reserved flag bit', 'AQMAAQsYITJDU2Nk_yo-'],
    ['score byte 101', 'AQFlAQsYITJDU2Nk_yo-'],
    ['score byte 254', 'AQH-AQsYITJDU2Nk_yo-'],
    ['scores for a skipped developer module', 'AQAAAQsYITJDU2Nk_yo-'],
])('rejects %s', (_, invalidPayload) => {
    expect(decodeResultPayload(invalidPayload)).toEqual({
        ok: false,
        reason: 'invalid',
    });
});

test('reports an unknown version', () => {
    expect(decodeResultPayload('AgEAAQsYITJDU2Nk_yo-')).toEqual({
        ok: false,
        reason: 'unsupported-version',
    });
});

test.each([-1, 0.5, 101, 255, NaN, Infinity])(
    'rejects an invalid encoder score of %s',
    (score) => {
        expect(() =>
            encodeResultPayload({
                axisScores: [
                    { axisId: 'regulation', score },
                    ...axisScores.slice(1),
                ],
                includeDeveloper: true,
            }),
        ).toThrow(RangeError);
    },
);

test('rejects missing, duplicate, or contradictory scores at encode time', () => {
    expect(() =>
        encodeResultPayload({
            axisScores: axisScores.slice(1),
            includeDeveloper: true,
        }),
    ).toThrow(RangeError);
    expect(() =>
        encodeResultPayload({
            axisScores: [axisScores[1], ...axisScores.slice(1)],
            includeDeveloper: true,
        }),
    ).toThrow(RangeError);
    expect(() =>
        encodeResultPayload({ axisScores, includeDeveloper: false }),
    ).toThrow(RangeError);
});
