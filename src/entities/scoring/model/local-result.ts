import { calculateQuestionnaireResult } from './questionnaire-result';
import {
    getSelectedQuestions,
    isRecord,
    type QuestionnaireProgress,
} from './questionnaire-progress';
import {
    restoreQuestionnaireProgress,
    useQuestionnaireStore,
} from './questionnaire-store';
import { encodeResultPayload } from './result-url-codec';

export type LocalResultState = { localResultFingerprint: string };

function isLocalResultState(state: unknown): state is LocalResultState {
    return (
        isRecord(state) &&
        typeof state.localResultFingerprint === 'string' &&
        /^[0-9a-f]{64}$/.test(state.localResultFingerprint)
    );
}

export async function getLocalResultState({
    questionnaireVersion,
    includeDeveloper,
    answersById,
}: QuestionnaireProgress): Promise<LocalResultState | undefined> {
    if (!globalThis.crypto?.subtle) return undefined;

    // Keep the reference private to browser history. Cursor and locale can change
    // without changing the answers that produced this result.
    const answers = getSelectedQuestions(includeDeveloper).map(({ id }) => [
        id,
        answersById[id],
    ]);
    const data = new TextEncoder().encode(
        JSON.stringify([questionnaireVersion, includeDeveloper, answers]),
    );
    try {
        const digest = await crypto.subtle.digest('SHA-256', data);
        return {
            localResultFingerprint: Array.from(new Uint8Array(digest), (byte) =>
                byte.toString(16).padStart(2, '0'),
            ).join(''),
        };
    } catch {
        return undefined;
    }
}

export async function readLocalResultProgress(
    payload: string,
    state: unknown,
): Promise<QuestionnaireProgress | null> {
    if (!isLocalResultState(state)) return null;

    await restoreQuestionnaireProgress();
    const progress = useQuestionnaireStore.getState();
    if (progress.status !== 'finished') return null;
    const localResult = calculateQuestionnaireResult(progress);
    if (!localResult || encodeResultPayload(localResult) !== payload)
        return null;

    const reference = await getLocalResultState(progress);
    const current = useQuestionnaireStore.getState();
    return (
            reference?.localResultFingerprint ===
                state.localResultFingerprint &&
                current.status === 'finished' &&
                current.answersById === progress.answersById
        ) ?
            progress
        :   null;
}
