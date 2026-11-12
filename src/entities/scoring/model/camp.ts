import { rms } from '@/shared/lib/math';
import type { UserAxesScore, CampAxesScore } from './axis';
import type { CampDefinition } from '@/shared/config';

// passesThreshold marks camps whose similarity is too low to show it to the user as a fitting camp
export type CampMatch = {
    id: CampDefinition['id'];
    match: number;
    passesThreshold: boolean;
};

// Gets a list of camps and a result and then sorts all the camps by how close they are to the user score
export function calculateCampMatch({
    user,
    camp,
    settings,
}: {
    user: UserAxesScore;
    camp: CampAxesScore;
    settings?: Partial<{ axesMatchThreshold: number; wildcardOffset: number }>;
}): number | null {
    let scored = 0; // How many axes are scored
    const diffSet = []; // A set of calculated difference between user and camp axis position

    for (let i = 0; user.length > i; i++) {
        const userScore = user[i].score;
        const campAxis = camp.find((v) => v.axisId === user[i].axisId);
        if (userScore == null) continue;
        if (!campAxis) {
            diffSet.push(settings?.wildcardOffset ?? 20); // 20 is a default offset
            continue;
        }
        diffSet.push(userScore - campAxis.score);
        scored += 1;
    }

    // Refuse to give match % if there's too few axes that user and camp positions have in common
    if ((settings?.axesMatchThreshold ?? 2) > scored) return null;
    return 100 - rms(diffSet);
}

export function findCampMatches({
    user,
    camps,
    settings,
}: {
    user: UserAxesScore;
    camps: CampDefinition[];
    settings?: Partial<{
        campMatchThreshold: number;
        axesThreshold: number;
        axesMatchThreshold: number;
        wildcardOffset: number;
    }>;
}): CampMatch[] {
    if (
        user.filter(({ score }) => score !== null).length <
        (settings?.axesThreshold ?? 2)
    ) {
        return [];
    }

    const campMatches: CampMatch[] = [];

    for (const { id, positions } of camps) {
        let passesThreshold = true;
        const campMatch = calculateCampMatch({
            user,
            camp: positions,
            settings: {
                axesMatchThreshold: settings?.axesMatchThreshold,
                wildcardOffset: settings?.wildcardOffset,
            },
        });

        if (campMatch === null) continue;
        if (campMatch <= (settings?.campMatchThreshold ?? 45))
            passesThreshold = false;
        campMatches.push({ id, match: campMatch, passesThreshold });
    }

    return campMatches.toSorted((a, b) => b.match - a.match);
}
