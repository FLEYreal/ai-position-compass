import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import {
    restoreQuestionnaireProgress,
    useQuestionnaireStore,
} from '@/entities/scoring';
import {
    coreQuestions,
    devQuestions,
    questionnaireVersion,
} from '@/shared/config';

beforeEach(() => {
    localStorage.clear();
});

afterEach(() => {
    vi.restoreAllMocks();
});

test('restores responses and saves only questionnaire progress', async () => {
    localStorage.setItem(
        'questionnaire',
        JSON.stringify({
            version: 1,
            state: {
                questionnaireVersion,
                answersById: { S7: 0 },
                currentQuestionId: 'K6',
                status: 'in-process',
                includeDeveloper: false,
            },
        }),
    );

    await useQuestionnaireStore.persist.rehydrate();

    const { answersById, currentQuestionId, answerQuestion } =
        useQuestionnaireStore.getState();
    expect(answersById).toEqual({ S7: 0 });
    expect(currentQuestionId).toBe('K6');

    answerQuestion('K6', 'unsure');

    expect(JSON.parse(localStorage.getItem('questionnaire')!)).toEqual({
        version: 1,
        state: {
            questionnaireVersion,
            answersById: { S7: 0, K6: 'unsure' },
            currentQuestionId: 'K6',
            status: 'in-process',
            includeDeveloper: false,
        },
    });
});

test('creates a result from the current responses and keeps rankings separate', async () => {
    await useQuestionnaireStore.persist.rehydrate();
    const { reset, answerQuestion, createResult } =
        useQuestionnaireStore.getState();
    reset(true);
    expect(createResult()).toBeNull();

    for (const { id } of coreQuestions) answerQuestion(id, 0);
    expect(createResult()).toBeNull();

    for (const { id } of devQuestions) answerQuestion(id, 'unsure');
    const result = createResult();

    expect(result?.includeDeveloper).toBe(true);
    expect(result?.axisScores.map(({ score }) => score)).toEqual([
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        50,
        null,
        null,
        null,
    ]);
    expect(result?.campMatches.core.length).toBeGreaterThan(0);
    expect(result?.campMatches.dev).toEqual([]);
    expect(useQuestionnaireStore.getState().status).toBe('finished');
});

test.each([1, 999])(
    'keeps incompatible questionnaire version %i in storage until a confirmed reset',
    async (version) => {
        const incompatible = JSON.stringify({
            version: 1,
            state: {
                questionnaireVersion: version,
                answersById: { S7: 1 },
                currentQuestionId: 'S7',
                status: 'in-process',
                includeDeveloper: false,
            },
        });
        localStorage.setItem('questionnaire', incompatible);
        await useQuestionnaireStore.persist.rehydrate();

        const { answerQuestion, createResult, reset } =
            useQuestionnaireStore.getState();
        answerQuestion('S7', 0.5);

        expect(createResult()).toBeNull();
        expect(localStorage.getItem('questionnaire')).toBe(incompatible);

        reset();
        await useQuestionnaireStore.persist.rehydrate();
        expect(useQuestionnaireStore.getState().answersById).toEqual({});
    },
);

test('keeps the live answer when storage cannot save it', async () => {
    await useQuestionnaireStore.persist.rehydrate();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new DOMException('Storage is full', 'QuotaExceededError');
    });

    useQuestionnaireStore.getState().answerQuestion('S7', 0.5);
    useQuestionnaireStore.getState().nextQuestion();

    expect(useQuestionnaireStore.getState().answersById).toEqual({ S7: 0.5 });
    expect(useQuestionnaireStore.getState().currentQuestionId).toBe('K6');
});

test('keeps newer in-memory responses when the questionnaire remounts', async () => {
    await restoreQuestionnaireProgress();
    const { answerQuestion } = useQuestionnaireStore.getState();
    answerQuestion('S7', 0);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new DOMException('Storage is full', 'QuotaExceededError');
    });

    answerQuestion('S7', 'unsure');
    await restoreQuestionnaireProgress();

    expect(useQuestionnaireStore.getState().answersById).toEqual({
        S7: 'unsure',
    });
});

test('returns the v1 axis order and undefined developer scores for a core-only result', async () => {
    await useQuestionnaireStore.persist.rehydrate();
    const { answerQuestion, createResult } = useQuestionnaireStore.getState();
    for (const { id } of coreQuestions) answerQuestion(id, 0);

    const result = createResult();
    expect(result?.includeDeveloper).toBe(false);
    expect(result?.axisScores).toEqual([
        { axisId: 'regulation', score: 50 },
        { axisId: 'control', score: 50 },
        { axisId: 'geopolitics', score: 50 },
        { axisId: 'openness', score: 50 },
        { axisId: 'capability', score: 50 },
        { axisId: 'existentialRisk', score: 50 },
        { axisId: 'ecology', score: 50 },
        { axisId: 'creativity', score: 50 },
        { axisId: 'labor', score: 50 },
        { axisId: 'surveillance', score: 50 },
        { axisId: 'openSourcePreference', score: null },
        { axisId: 'aiDelegation', score: null },
        { axisId: 'displacementRisk', score: null },
    ]);
    expect(result?.campMatches.dev).toEqual([]);
});

test('restores a started developer questionnaire before its first answer', async () => {
    await useQuestionnaireStore.persist.rehydrate();

    const { start } = useQuestionnaireStore.getState();
    start(true);
    start(false);

    await useQuestionnaireStore.persist.rehydrate();

    expect(useQuestionnaireStore.getState()).toMatchObject({
        answersById: {},
        currentQuestionId: coreQuestions[0].id,
        includeDeveloper: true,
        status: 'in-process',
    });
});

test('keeps damaged progress available for another clear attempt if removal fails', async () => {
    localStorage.setItem('questionnaire', 'damaged data');
    await useQuestionnaireStore.persist.rehydrate();
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementationOnce(() => {
        throw new DOMException('Storage is blocked', 'SecurityError');
    });

    const { reset } = useQuestionnaireStore.getState();
    expect(reset()).toBe(false);
    expect(localStorage.getItem('questionnaire')).toBe('damaged data');
    expect(reset()).toBe(true);

    await useQuestionnaireStore.persist.rehydrate();
    expect(useQuestionnaireStore.getState().status).toBe('not-started');
});

test('rejects a saved position reached by skipping unanswered questions', async () => {
    await useQuestionnaireStore.persist.rehydrate();
    const saved = JSON.stringify({
        version: 1,
        state: {
            questionnaireVersion,
            answersById: { K6: 0 },
            currentQuestionId: 'K6',
            status: 'in-process',
            includeDeveloper: false,
        },
    });
    localStorage.setItem('questionnaire', saved);
    await useQuestionnaireStore.persist.rehydrate();

    useQuestionnaireStore.getState().start(true);

    expect(useQuestionnaireStore.getState().status).toBe('not-started');
    expect(localStorage.getItem('questionnaire')).toBe(saved);
});
