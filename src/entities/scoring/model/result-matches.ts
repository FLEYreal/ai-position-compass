import { resultV1Scoring } from '@/shared/config';
import type { UserAxisScore } from './axis';
import { findCampMatches } from './camp';

// These definitions belong to v1. Keep their positions and matching parameters
// when a later result version introduces new rules.
const { coreAxes, devAxes, coreCamps, devCamps, settings } = resultV1Scoring;
const v1CoreAxisIds = new Set<string>(coreAxes.map(({ id }) => id));
const v1DevAxisIds = new Set<string>(devAxes.map(({ id }) => id));
const { core, dev, ...commonSettings } = settings;
const v1CoreSettings = { ...commonSettings, ...core };
const v1DevSettings = { ...commonSettings, ...dev };

export function rankV1CampMatches({
    axisScores,
    includeDeveloper,
}: {
    axisScores: readonly UserAxisScore[];
    includeDeveloper: boolean;
}) {
    return {
        core: findCampMatches({
            user: axisScores.filter(({ axisId }) => v1CoreAxisIds.has(axisId)),
            camps: coreCamps,
            settings: v1CoreSettings,
        }),
        dev:
            includeDeveloper ?
                findCampMatches({
                    user: axisScores.filter(({ axisId }) =>
                        v1DevAxisIds.has(axisId),
                    ),
                    camps: devCamps,
                    settings: v1DevSettings,
                })
            :   [],
    };
}
