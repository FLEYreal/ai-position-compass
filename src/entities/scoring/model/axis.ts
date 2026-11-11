import {
    type AxisId,
    type QuestionKey,
    type QuestionWeight,
} from '@/shared/config';

// Unsure marks person's answer where they choose to not answer question.
export type QuestionAnswer = {
    key: QuestionKey;
    weight: QuestionWeight;
    unsure: boolean;
};

// When score is null, it means that function couldn't reliably identify person's axis position
export type AxesScore = {
    axisId: AxisId;
    score: number | null;
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
): AxesScore {
    const axesScore = [];
    for (const { axisId, answers } of axes) {
        const certainAnswers = answers
            .filter((a) => !a.unsure)
            .map(({ key, weight }) => ({ key, weight }));

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
            const score = calculateScore(certainAnswers);
            axesScore.push({ axisId, score });
        }
    }

    return axesScore;
}
