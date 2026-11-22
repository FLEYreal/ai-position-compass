import {
    getSelectedQuestions,
    loadQuestionnaireMessages,
    rankV1CampMatches,
    readLocalResultProgress,
    type CampMatch,
    type QuestionnaireMessages,
    type QuestionnaireProgress,
    type QuestionResponse,
} from '@/entities/scoring';
import { projectName, resultV1Scoring, type Language } from '@/shared/config';
import type { Messages } from '../i18n';
import type {
    DecodedResult,
    ResultAxis,
    ResultPresentation,
} from '../model/result-presentation';
import { downloadBlob } from './download-blob';

function presentAnswers(
    progress: QuestionnaireProgress,
    copy: QuestionnaireMessages,
) {
    const labelKeys = {
        [-1]: 'stronglyDisagree',
        [-0.5]: 'disagree',
        0: 'neutral',
        0.5: 'agree',
        1: 'stronglyAgree',
        unsure: 'unsure',
    } as const satisfies Record<QuestionResponse, string>;
    return getSelectedQuestions(progress.includeDeveloper).map(
        (question, index) => {
            // The finished progress has a response for each selected question.
            const answer = progress.answersById[question.id]!;
            const titleKey =
                `research.questions.${question.modelId}.${question.id}` as keyof QuestionnaireMessages;
            const labelKey =
                `research.answer-scale.${labelKeys[answer]}` as const;
            return {
                questionId: question.id,
                questionTitle: copy[titleKey],
                order: index + 1,
                module: question.modelId,
                answer,
                answerLabel: copy[labelKey],
                scoring: {
                    axisId: question.axisId,
                    key: question.key,
                    weight: question.weight,
                    secondary:
                        'secondary' in question ? question.secondary : null,
                },
            };
        },
    );
}

function presentAxes(axes: readonly ResultAxis[]) {
    return axes.map(({ id, label, construct, low, high, score }) => ({
        axisId: id,
        axisTitle: label,
        construct,
        lowPole: low,
        highPole: high,
        score,
    }));
}

function presentSimilarities(
    definitions: readonly {
        id: string;
        name: string;
        positions: readonly { axisId: string; score: number }[];
    }[],
    matches: readonly CampMatch[],
) {
    const info = new Map(
        matches.map((match, index) => [match.id, { match, rank: index + 1 }]),
    );
    return definitions
        .map((camp) => {
            const ranked = info.get(camp.id);
            return {
                campId: camp.id,
                campName: camp.name,
                positions: camp.positions,
                eligible: ranked !== undefined,
                rank: ranked?.rank ?? null,
                similarity: ranked?.match.match ?? null,
                passesThreshold: ranked?.match.passesThreshold ?? null,
            };
        })
        .sort(
            (a, b) =>
                (a.rank ?? definitions.length + 1) -
                (b.rank ?? definitions.length + 1),
        );
}

export async function saveResultJson({
    language,
    decoded,
    copy,
    result,
    projectUrl,
    locationState,
}: {
    language: Language;
    decoded: DecodedResult & { payload: string };
    copy: Messages;
    result: ResultPresentation;
    projectUrl: string;
    locationState: unknown;
}) {
    const progress = await readLocalResultProgress(
        decoded.payload,
        locationState,
    );
    const answers =
        progress ?
            presentAnswers(progress, await loadQuestionnaireMessages(language))
        :   null;
    const matches = rankV1CampMatches(decoded);

    const data = {
        schemaVersion: 1,
        resultVersion: decoded.version,
        questionnaireVersion: progress?.questionnaireVersion ?? null,
        project: { name: projectName, url: projectUrl },
        language,
        includeDeveloper: decoded.includeDeveloper,
        answerAvailability: answers ? 'included' : 'unavailable',
        modules: {
            core: {
                axes: presentAxes([...result.values, ...result.beliefs]),
                camps: presentSimilarities(
                    resultV1Scoring.coreCamps.map((camp) => ({
                        ...camp,
                        name: copy[`research.camps.core.${camp.id}.name`],
                    })),
                    matches.core,
                ),
                answers:
                    answers?.filter(({ module }) => module === 'core') ?? null,
            },
            developer:
                result.developer ?
                    {
                        axes: presentAxes(result.developer.axes),
                        camps: presentSimilarities(
                            resultV1Scoring.devCamps.map((camp) => ({
                                ...camp,
                                name: copy[
                                    `research.camps.dev.${camp.id}.name`
                                ],
                            })),
                            matches.dev,
                        ),
                        answers:
                            answers?.filter(({ module }) => module === 'dev') ??
                            null,
                    }
                :   null,
        },
    };

    downloadBlob(
        new Blob([JSON.stringify(data, null, 2) + '\n'], {
            type: 'application/json',
        }),
        `ai-position-compass-${language}.json`,
    );
    return data.answerAvailability;
}
