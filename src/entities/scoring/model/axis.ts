import {
    type AxisId,
    type CampPosition,
    type QuestionKey,
    type QuestionWeight,
} from '@/shared/config';

export type AnswerValue = -1 | -0.5 | 0 | 0.5 | 1;

// key describes the statement's direction; value describes the response.
// Unsure responses contribute neither value nor weight.
export type QuestionAnswer = {
    key: QuestionKey;
    value: AnswerValue;
    weight: QuestionWeight;
    unsure: boolean;
};

// When score is null, it means that function couldn't reliably identify person's axis position
export type UserAxesScore = {
    axisId: AxisId;
    score: number | null;
}[];

export type CampAxesScore = {
    axisId: AxisId;
    score: CampPosition;
}[];

export function calculateScore(keys: { key: number; weight: number }[]) {
    // If array of keys is empty
    if (!keys.length) return 50;

    // Step 1: Get sum of values
    let sumWeightedKeys = 0;
    let sumWeights = 0;

    for (const { weight, key } of keys) {
        sumWeightedKeys += weight * key;
        sumWeights += weight;
    }

    // Step 2: Calculate mean
    const mean = sumWeightedKeys / sumWeights;

    // Step 3: Calculate & return resulting score
    return ((mean + 1) / 2) * 100;
}

export function calculateAxesScore(
    axes: { axisId: AxisId; answers: QuestionAnswer[] }[],
): UserAxesScore {
    const axesScore = [];
    for (const { axisId, answers } of axes) {
        const certainAnswers = answers.filter((a) => !a.unsure);

        // Accept only if ~half of questions is answered
        if (certainAnswers.length < Math.floor(answers.length / 2)) {
            axesScore.push({ axisId, score: null });
        }

        // At least one question from -1 and 1 key should be answered to reduce agreability bias
        // (When people tend to agree with positive statements by default).
        else if (
            !certainAnswers.some(({ key }) => key > 0) ||
            !certainAnswers.some(({ key }) => key < 0)
        ) {
            axesScore.push({ axisId, score: null });
        } else {
            const score = calculateScore(
                certainAnswers.map(({ key, value, weight }) => ({
                    key: key * value,
                    weight,
                })),
            );
            axesScore.push({ axisId, score });
        }
    }

    return axesScore;
}
