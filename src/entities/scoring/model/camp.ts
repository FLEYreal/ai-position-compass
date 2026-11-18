import { rms } from '@/shared/lib/math';
import type { UserAxesScore, CampAxesScore } from './axis';
import type { CampDefinition, Setting } from '@/shared/config';

// passesThreshold marks camps whose similarity is too low to show it to the user as a fitting camp
export type CampMatch = {
    id: CampDefinition['id'];
    match: number;
    passesThreshold: boolean;
};

// Computes similarity over the scored axes in one module.
export function calculateCampMatch({
    user,
    camp,
    settings,
}: {
    user: UserAxesScore;
    camp: CampAxesScore;
    settings?: Pick<Setting, 'axesMatchThreshold' | 'wildcardOffset'>;
}): number | null {
    let sharedAxes = 0;
    const differences: number[] = [];

    for (const { axisId, score } of user) {
        if (score == null) continue;
        const campAxis = camp.find((position) => position.axisId === axisId);
        if (!campAxis) {
            differences.push(settings?.wildcardOffset ?? 20);
            continue;
        }
        differences.push(score - campAxis.score);
        sharedAxes += 1;
    }

    if (
        differences.length === 0 ||
        sharedAxes < (settings?.axesMatchThreshold ?? 2)
    ) {
        return null;
    }
    return 100 - rms(differences);
}

// Supply the scores, camps and settings for a single module.
export function findCampMatches({
    user,
    camps,
    settings,
}: {
    user: UserAxesScore;
    camps: CampDefinition[];
    settings?: Setting;
}): CampMatch[] {
    const campMatches: CampMatch[] = [];
    const minimumDefiningAxes = settings?.axesThreshold ?? 2;
    const closeMatchThreshold = settings?.campMatchThreshold ?? 70;

    for (const { id, positions } of camps) {
        if (positions.length < minimumDefiningAxes) continue;
        const match = calculateCampMatch({ user, camp: positions, settings });
        if (match === null) continue;
        campMatches.push({
            id,
            match,
            passesThreshold: match >= closeMatchThreshold,
        });
    }

    return campMatches.sort((a, b) => {
        if (a.match !== b.match) return b.match - a.match;
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
    });
}
