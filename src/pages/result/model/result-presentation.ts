import {
    decodeResultPayload,
    rankV1CampMatches,
    type CampMatch,
    type ResultUrlDecodeResult,
} from '@/entities/scoring';
import { people, resultV1Scoring, type AxisId } from '@/shared/config';
import type { Messages } from '../i18n';
import { publicNames } from '../i18n/public-names';

const { coreAxes, coreCamps, devCamps, axisConstruct } = resultV1Scoring;
const v1CampCopy = [
    ...coreCamps.map(({ id }) => ({
        id,
        key: `research.camps.core.${id}` as const,
    })),
    ...devCamps.map(({ id }) => ({
        id,
        key: `research.camps.dev.${id}` as const,
    })),
];

export type DecodedResult = Extract<ResultUrlDecodeResult, { ok: true }>;

export function readResultQuery(search: string) {
    const payloads = new URLSearchParams(search).getAll('r');
    if (payloads.length > 1) return { ok: false, reason: 'invalid' } as const;
    const [payload] = payloads;
    const decoded = decodeResultPayload(payload ?? null);
    return decoded.ok ? { ...decoded, payload } : decoded;
}

function tokenName(id: string) {
    return id.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase());
}

function presentCamp(match: CampMatch, copy: Messages) {
    // Ranking and presentation use the same retained v1 camp definitions.
    const { id, key } = v1CampCopy.find(({ id }) => id === match.id)!;
    const score = Math.round(match.match);
    return {
        id,
        token: tokenName(id),
        name: copy[`${key}.name`],
        description: copy[`${key}.description`],
        context: copy[`${key}.context`],
        score,
        similarity: copy['result.match'].replace('{score}', String(score)),
        close: match.passesThreshold,
        voices: people
            .filter(({ campIds }) => campIds.some((campId) => campId === id))
            .slice(0, 2)
            .map(({ id, sources }) => ({
                id,
                sources,
                name: publicNames[id],
            })),
    };
}

export function presentResult(result: DecodedResult, copy: Messages) {
    const matching = rankV1CampMatches(result);
    const developerMatch = matching.dev[0];
    const isCore = (axisId: AxisId) => coreAxes.some(({ id }) => id === axisId);
    const axes = result.axisScores
        .filter(({ axisId }) => result.includeDeveloper || isCore(axisId))
        .map(({ axisId, score }) => {
            const [label, endpoints] =
                copy[`research.axes.${axisId}`].split(' · ');
            const [low, high] = endpoints.split(' ↔ ');
            return {
                id: axisId,
                token: tokenName(axisId),
                label,
                low,
                high,
                score,
                construct: axisConstruct[axisId],
                core: isCore(axisId),
            };
        });
    return {
        values: axes.filter((axis) => axis.core && axis.construct === 'value'),
        beliefs: axes.filter(
            (axis) => axis.core && axis.construct === 'belief',
        ),
        developer:
            result.includeDeveloper ?
                {
                    axes: axes.filter((axis) => !axis.core),
                    camp:
                        developerMatch ?
                            presentCamp(developerMatch, copy)
                        :   null,
                }
            :   null,
        coreCamps: matching.core
            .slice(0, 3)
            .map((match) => presentCamp(match, copy)),
        allUndefined: axes.every(({ score }) => score === null),
        someUndefined: axes.some(({ score }) => score === null),
    };
}

export type ResultPresentation = ReturnType<typeof presentResult>;
export type ResultAxis = ResultPresentation['values'][number];
export type ResultCamp = ResultPresentation['coreCamps'][number];
