import type { AxisId } from '@/shared/config';
import type { UserAxisScore } from './axis';

// The wire order is part of v1 and stays fixed if the app's axis order changes.
const V1_AXIS_IDS = [
    'regulation',
    'control',
    'geopolitics',
    'openness',
    'capability',
    'existentialRisk',
    'ecology',
    'creativity',
    'labor',
    'surveillance',
    'openSourcePreference',
    'aiDelegation',
    'displacementRisk',
] as const satisfies readonly AxisId[];

const V1_VERSION = 1;
const V1_PAYLOAD_LENGTH = 20;
const V1_DEVELOPER_START = 10;
const DEVELOPER_FLAG = 1;
const UNDEFINED_SCORE = 255;

type ResultScores = {
    axisScores: readonly UserAxisScore[];
    includeDeveloper: boolean;
};

export type ResultUrlDecodeResult =
    | {
          ok: true;
          version: typeof V1_VERSION;
          axisScores: UserAxisScore[];
          includeDeveloper: boolean;
      }
    | { ok: false; reason: 'missing' | 'invalid' | 'unsupported-version' };

function hasConsistentDeveloperScores(
    includeDeveloper: boolean,
    scoreBytes: number[],
): boolean {
    return (
        includeDeveloper ||
        scoreBytes
            .slice(V1_DEVELOPER_START)
            .every((byte) => byte === UNDEFINED_SCORE)
    );
}

/** Returns the canonical v1 value to use for the `r` query parameter. */
export function encodeResultPayload({
    axisScores,
    includeDeveloper,
}: ResultScores): string {
    const scoresByAxis = new Map(
        axisScores.map(({ axisId, score }) => [axisId, score]),
    );
    if (
        axisScores.length !== V1_AXIS_IDS.length ||
        scoresByAxis.size !== V1_AXIS_IDS.length
    ) {
        throw new RangeError('Expected exactly one score per v1 axis');
    }
    if (typeof includeDeveloper !== 'boolean') {
        throw new TypeError('Expected a boolean developer participation flag');
    }

    const scoreBytes = V1_AXIS_IDS.map((axisId) => {
        const score = scoresByAxis.get(axisId);
        if (score === null) return UNDEFINED_SCORE;
        if (
            score === undefined ||
            !Number.isInteger(score) ||
            score < 0 ||
            score > 100
        ) {
            throw new RangeError(`Invalid score for ${axisId}`);
        }
        return score;
    });
    if (!hasConsistentDeveloperScores(includeDeveloper, scoreBytes)) {
        throw new RangeError('Skipped developer axes must be Undefined');
    }

    const flags = includeDeveloper ? DEVELOPER_FLAG : 0;
    // Fifteen bytes fill five base64 groups, so no padding is needed.
    return btoa(String.fromCharCode(V1_VERSION, flags, ...scoreBytes))
        .replaceAll('+', '-')
        .replaceAll('/', '_');
}

/** Decodes the value from `searchParams.get('r')` without accessing saved progress. */
export function decodeResultPayload(
    payload: string | null,
): ResultUrlDecodeResult {
    if (payload === null) return { ok: false, reason: 'missing' };
    // Every sextet carries data in v1. Exact length and alphabet enforce canonical form.
    if (
        payload.length !== V1_PAYLOAD_LENGTH ||
        /[^A-Za-z0-9_-]/.test(payload)
    ) {
        return { ok: false, reason: 'invalid' };
    }

    const binary = atob(payload.replaceAll('-', '+').replaceAll('_', '/'));
    const [version, flags, ...scoreBytes] = Array.from(binary, (byte) =>
        byte.charCodeAt(0),
    );
    if (version !== V1_VERSION) {
        return { ok: false, reason: 'unsupported-version' };
    }
    if (flags !== 0 && flags !== DEVELOPER_FLAG) {
        return { ok: false, reason: 'invalid' };
    }

    const includeDeveloper = flags === DEVELOPER_FLAG;
    if (
        scoreBytes.some((byte) => byte > 100 && byte !== UNDEFINED_SCORE) ||
        !hasConsistentDeveloperScores(includeDeveloper, scoreBytes)
    ) {
        return { ok: false, reason: 'invalid' };
    }

    const axisScores = V1_AXIS_IDS.map((axisId, index) => ({
        axisId,
        score: scoreBytes[index] === UNDEFINED_SCORE ? null : scoreBytes[index],
    }));
    return { ok: true, version, includeDeveloper, axisScores };
}
