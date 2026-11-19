import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { QuestionAnswer } from './questionnaire-progress';
import type { CampMatch } from './camp';
import type { UserAxisScore } from './axis';
import { questionnaireVersion } from '@/shared/config';

export type QuestionnaireResult = {
    campMatches: CampMatch[];
    axisScores: UserAxisScore[];
};

export type QuestionnaireStore = {
    questionnaireVersion: typeof questionnaireVersion;
    questionAnswers: QuestionAnswer[];
    questionnaireResult: QuestionnaireResult | null;
    status: 'not-started' | 'in-process' | 'finished';
    includeDeveloper: boolean; // Whether user

    editQuestion: () => void;
    answerQuestion: (answer: QuestionAnswer) => void; // Answer question
    getCurrentQuestion: () => QuestionAnswer | null; // Gives you currently asked question
    createResult: () => QuestionnaireResult | null;
    reset: () => void; // Reset entire questionnary for user to start over
};

export const useQuestionnaireStore = create<QuestionnaireStore>()(
    persist(
        (): QuestionnaireStore => ({
            questionnaireVersion,
            questionAnswers: [],
            questionnaireResult: null,
            status: 'not-started',
            includeDeveloper: false,
            editQuestion: () => {},
            answerQuestion: () => {},
            getCurrentQuestion: () => null,
            createResult: () => null,
            reset: () => {},
        }),
        {
            name: 'questionnaire',
            version: questionnaireVersion,
            skipHydration: true,
            storage: createJSONStorage(() => localStorage),

            // Migrate old version storage structure towards new one
            migrate: (persistedState, persistedVersion) => {
                if (persistedVersion === 1) return persistedState;
            },
        },
    ),
);
