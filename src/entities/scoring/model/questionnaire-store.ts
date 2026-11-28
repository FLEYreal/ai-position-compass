import { create } from 'zustand';
import { persist, type PersistStorage } from 'zustand/middleware';
import type { ModeledQuestionDefinition } from '@/shared/config';
import {
    calculateQuestionnaireResult,
    type QuestionnaireResult,
} from './questionnaire-result';
import {
    getSelectedQuestions,
    isQuestionResponse,
    isRecord,
    newQuestionnaireProgress,
    parseQuestionnaireProgress,
    QuestionnaireRestoreError,
    type QuestionnaireProgress,
    type QuestionResponse,
} from './questionnaire-progress';

const storageName = 'questionnaire';
const storageVersion = 1;

type QuestionnaireStore = QuestionnaireProgress & {
    start: (includeDeveloper: boolean) => void;
    reviewAnswers: () => void;
    answerQuestion: (questionId: string, response: QuestionResponse) => void;
    getCurrentQuestion: () => ModeledQuestionDefinition | null;
    nextQuestion: () => void;
    previousQuestion: () => void;
    createResult: () => QuestionnaireResult | null;
    reset: (includeDeveloper?: boolean) => boolean;
};

type StorageStatus =
    | 'pending'
    | 'ready'
    | 'invalid'
    | 'incompatible'
    | 'unavailable'
    | 'save-failed';

// Restore and write notices use a separate state so reporting them never writes progress.
const storageStatus = create<StorageStatus>()(() => 'pending');

export function useQuestionnaireStorageStatus() {
    return storageStatus();
}

function canEdit() {
    const status = storageStatus.getState();
    return (
        status === 'ready' ||
        status === 'unavailable' ||
        status === 'save-failed'
    );
}

const progressStorage: PersistStorage<unknown> = {
    getItem(name) {
        let raw: string | null;
        try {
            raw = window.localStorage.getItem(name);
        } catch {
            throw new QuestionnaireRestoreError('unavailable');
        }
        if (raw === null) return null;

        const saved: unknown = JSON.parse(raw);
        if (
            !isRecord(saved) ||
            typeof saved.version !== 'number' ||
            !Number.isInteger(saved.version) ||
            !Object.hasOwn(saved, 'state')
        ) {
            throw new QuestionnaireRestoreError('invalid');
        }
        return { version: saved.version, state: saved.state };
    },
    setItem(name, value) {
        try {
            window.localStorage.setItem(name, JSON.stringify(value));
            storageStatus.setState('ready');
        } catch {
            storageStatus.setState('save-failed');
        }
    },
    removeItem(name) {
        window.localStorage.removeItem(name);
    },
};

function persistedProgress(
    state: QuestionnaireProgress,
): QuestionnaireProgress {
    const {
        questionnaireVersion,
        answersById,
        currentQuestionId,
        status,
        includeDeveloper,
    } = state;
    return {
        questionnaireVersion,
        answersById,
        currentQuestionId,
        status,
        includeDeveloper,
    };
}

export const useQuestionnaireStore = create<QuestionnaireStore>()(
    persist<QuestionnaireStore, [], [], unknown>(
        (set, get) => ({
            ...newQuestionnaireProgress(),
            start: (includeDeveloper) => {
                if (canEdit() && get().status === 'not-started') {
                    set({
                        ...newQuestionnaireProgress(includeDeveloper),
                        status: 'in-process',
                    });
                }
            },
            reviewAnswers: () => {
                const { status, includeDeveloper } = get();
                if (canEdit() && status === 'finished') {
                    set({
                        currentQuestionId:
                            getSelectedQuestions(includeDeveloper)[0].id,
                    });
                }
            },
            answerQuestion: (questionId, response) => {
                const { answersById, includeDeveloper } = get();
                if (
                    !canEdit() ||
                    !isQuestionResponse(response) ||
                    answersById[questionId] === response ||
                    !getSelectedQuestions(includeDeveloper).some(
                        ({ id }) => id === questionId,
                    )
                ) {
                    return;
                }
                set({
                    answersById: { ...answersById, [questionId]: response },
                    status: 'in-process',
                });
            },
            getCurrentQuestion: () => {
                const { currentQuestionId, includeDeveloper } = get();
                return (
                    getSelectedQuestions(includeDeveloper).find(
                        ({ id }) => id === currentQuestionId,
                    ) ?? null
                );
            },
            nextQuestion: () => {
                const { currentQuestionId, answersById, includeDeveloper } =
                    get();
                if (
                    !canEdit() ||
                    !Object.hasOwn(answersById, currentQuestionId)
                )
                    return;
                const questions = getSelectedQuestions(includeDeveloper);
                const next =
                    questions[
                        questions.findIndex(
                            ({ id }) => id === currentQuestionId,
                        ) + 1
                    ];
                if (next) set({ currentQuestionId: next.id });
            },
            previousQuestion: () => {
                if (!canEdit()) return;
                const { currentQuestionId, includeDeveloper } = get();
                const questions = getSelectedQuestions(includeDeveloper);
                const previous =
                    questions[
                        questions.findIndex(
                            ({ id }) => id === currentQuestionId,
                        ) - 1
                    ];
                if (previous) set({ currentQuestionId: previous.id });
            },
            createResult: () => {
                if (!canEdit()) return null;
                const progress = get();
                const result = calculateQuestionnaireResult(progress);
                if (result && progress.status !== 'finished') {
                    set({ status: 'finished' });
                }
                return result;
            },
            reset: (includeDeveloper) => {
                const status = storageStatus.getState();
                if (status === 'pending') return false;
                if (status === 'invalid' || status === 'incompatible') {
                    try {
                        progressStorage.removeItem?.(storageName);
                    } catch {
                        return false;
                    }
                }
                set(newQuestionnaireProgress(includeDeveloper));
                return true;
            },
        }),
        {
            name: storageName,
            version: storageVersion,
            skipHydration: true,
            storage: progressStorage,
            partialize: persistedProgress,
            migrate: () => {
                throw new QuestionnaireRestoreError('incompatible');
            },
            merge: (saved, current) => ({
                ...current,
                ...(saved === undefined ?
                    newQuestionnaireProgress()
                :   parseQuestionnaireProgress(saved)),
            }),
            onRehydrateStorage: () => {
                storageStatus.setState('pending');
                return (_state, error) => {
                    if (error === undefined) {
                        storageStatus.setState('ready');
                    } else {
                        storageStatus.setState(
                            error instanceof QuestionnaireRestoreError ?
                                error.status
                            :   'invalid',
                        );
                    }
                };
            },
        },
    ),
);

let restorePromise: Promise<void> | undefined;

export function restoreQuestionnaireProgress() {
    if (typeof window === 'undefined') return;

    // Remounts reuse the current answers, including any writes that failed.
    restorePromise ??= Promise.resolve().then(() =>
        useQuestionnaireStore.persist.rehydrate(),
    );
    return restorePromise;
}
