import {
    type AxisId,
    type CampPosition,
    type QuestionDefinition,
    type QuestionWeight,
} from '@/shared/config';

export type AnswerValue = -1 | -0.5 | 0 | 0.5 | 1;

// key describes the statement's direction; value describes the response.
// Secondary definitions inherit the parent's response and Unsure state.
export type QuestionAnswer = Pick<
    QuestionDefinition,
    'key' | 'weight' | 'secondary'
> & {
    value: AnswerValue;
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
// Each group's answers are primary to that axis; nested effects name their targets.
export function calculateAxesScore(
    axes: { axisId: AxisId; answers: QuestionAnswer[] }[],
): UserAxesScore {
    const secondaryByAxis = new Map<
        AxisId,
        { key: number; weight: QuestionWeight }[]
    >();

    // Collect effects before scoring so source eligibility and input order do
    // not determine whether an eligible target receives its secondary evidence.
    for (const { answers } of axes) {
        for (const answer of answers) {
            if (answer.unsure) continue;
            for (const secondary of answer.secondary ?? []) {
                const contributions =
                    secondaryByAxis.get(secondary.axisId) ?? [];
                contributions.push({
                    key: secondary.key * answer.value,
                    weight: secondary.weight,
                });
                secondaryByAxis.set(secondary.axisId, contributions);
            }
        }
    }

    const axesScore = [];
    for (const { axisId, answers } of axes) {
        const certainPrimaryAnswers = answers.filter((a) => !a.unsure);

        // Only primary responses establish eligibility; round the minimum up.
        if (certainPrimaryAnswers.length < Math.ceil(answers.length / 2)) {
            axesScore.push({ axisId, score: null });
        }

        // Require answered primary statements in both key directions.
        else if (
            !certainPrimaryAnswers.some(({ key }) => key === 1) ||
            !certainPrimaryAnswers.some(({ key }) => key === -1)
        ) {
            axesScore.push({ axisId, score: null });
        } else {
            const score = calculateScore([
                ...certainPrimaryAnswers.map(({ key, value, weight }) => ({
                    key: key * value,
                    weight,
                })),
                ...(secondaryByAxis.get(axisId) ?? []),
            ]);
            axesScore.push({ axisId, score: Math.round(score) });
        }
    }

    return axesScore;
}
