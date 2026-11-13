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

// Supply every primary question, including Unsure entries, to establish coverage.
// Under the current contract, weight 1 is primary and weight 0.5 is secondary.
export function calculateAxesScore(
    axes: { axisId: AxisId; answers: QuestionAnswer[] }[],
): UserAxesScore {
    const axesScore = [];
    for (const { axisId, answers } of axes) {
        const primaryAnswers = answers.filter(({ weight }) => weight === 1);
        const certainPrimaryAnswers = primaryAnswers.filter((a) => !a.unsure);
        const certainAnswers = answers.filter((a) => !a.unsure);

        // Only primary responses establish eligibility; round the minimum up.
        if (
            certainPrimaryAnswers.length < Math.ceil(primaryAnswers.length / 2)
        ) {
            axesScore.push({ axisId, score: null });
        }

        // Require answered primary statements in both key directions.
        else if (
            !certainPrimaryAnswers.some(({ key }) => key === 1) ||
            !certainPrimaryAnswers.some(({ key }) => key === -1)
        ) {
            axesScore.push({ axisId, score: null });
        } else {
            const score = calculateScore(
                certainAnswers.map(({ key, value, weight }) => ({
                    key: key * value,
                    weight,
                })),
            );
            axesScore.push({ axisId, score: Math.round(score) });
        }
    }

    return axesScore;
}
