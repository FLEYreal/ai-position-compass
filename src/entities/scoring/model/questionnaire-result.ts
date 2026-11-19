import {
    coreAxes,
    coreCamps,
    devAxes,
    devCamps,
    settings,
} from '@/shared/config';
import { calculateAxesScore, type UserAxisScore } from './axis';
import { findCampMatches, type CampMatch } from './camp';
import {
    getSelectedQuestions,
    type QuestionAnswer,
    type QuestionnaireProgress,
} from './questionnaire-progress';

export type QuestionnaireResult = {
    axisScores: UserAxisScore[];
    includeDeveloper: boolean;
    campMatches: { core: CampMatch[]; dev: CampMatch[] };
};

export function calculateQuestionnaireResult({
    answersById,
    includeDeveloper,
}: QuestionnaireProgress): QuestionnaireResult | null {
    const answers: QuestionAnswer[] = [];
    for (const question of getSelectedQuestions(includeDeveloper)) {
        const response = answersById[question.id];
        if (response === undefined) return null;

        answers.push({
            ...question,
            value: response === 'unsure' ? 0 : response,
            unsure: response === 'unsure',
        });
    }

    const selectedAxes =
        includeDeveloper ? [...coreAxes, ...devAxes] : coreAxes;
    const scores = calculateAxesScore(
        selectedAxes.map(({ id: axisId }) => ({
            axisId,
            answers: answers.filter((answer) => answer.axisId === axisId),
        })),
    );
    const coreScores = scores.slice(0, coreAxes.length);
    const devScores =
        includeDeveloper ?
            scores.slice(coreAxes.length)
        :   devAxes.map(({ id: axisId }) => ({ axisId, score: null }));
    const { core, dev, ...commonSettings } = settings;

    return {
        axisScores: [...coreScores, ...devScores],
        includeDeveloper,
        campMatches: {
            core: findCampMatches({
                user: coreScores,
                camps: coreCamps,
                settings: { ...commonSettings, ...core },
            }),
            dev:
                includeDeveloper ?
                    findCampMatches({
                        user: devScores,
                        camps: devCamps,
                        settings: { ...commonSettings, ...dev },
                    })
                :   [],
        },
    };
}
