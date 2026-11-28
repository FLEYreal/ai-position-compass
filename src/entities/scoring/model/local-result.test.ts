import { afterEach, expect, test, vi } from 'vitest';
import {
    encodeResultPayload,
    getLocalResultState,
    getSelectedQuestions,
    readLocalResultProgress,
    restoreQuestionnaireProgress,
    useQuestionnaireStore,
} from '@/entities/scoring';

afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
});

test('requires the original local answers even when edited answers yield the same scores', async () => {
    const digests = new Map<string, number>();
    vi.stubGlobal('crypto', {
        subtle: {
            digest: async (_algorithm: string, bytes: Uint8Array) => {
                const input = new TextDecoder().decode(bytes);
                if (!digests.has(input)) digests.set(input, digests.size + 1);
                const output = new Uint8Array(32);
                output[0] = digests.get(input)!;
                return output.buffer;
            },
        },
    });
    localStorage.clear();
    await restoreQuestionnaireProgress();
    const store = useQuestionnaireStore.getState();
    store.reset(false);
    store.start(false);
    const questions = getSelectedQuestions(false);
    for (const { id } of questions) store.answerQuestion(id, 'unsure');

    const original = store.createResult()!;
    const payload = encodeResultPayload(original);
    const state = await getLocalResultState(useQuestionnaireStore.getState());

    expect(await readLocalResultProgress(payload, undefined)).toBeNull();
    expect(await readLocalResultProgress(payload, state)).toMatchObject({
        answersById: { [questions[0].id]: 'unsure' },
    });

    store.answerQuestion(questions[0].id, 0);
    expect(encodeResultPayload(store.createResult()!)).toBe(payload);
    expect(await readLocalResultProgress(payload, state)).toBeNull();
});
