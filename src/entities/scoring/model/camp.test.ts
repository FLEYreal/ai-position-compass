import { describe, expect, test } from 'vitest';
import {
    calculateCampMatch,
    findCampMatches,
    type CampAxisScore,
    type UserAxisScore,
} from '@/entities/scoring';
import {
    coreCamps,
    devCamps,
    getSetting,
    type CampDefinition,
    type CampPosition,
} from '@/shared/config';

// SPEC's starting policies, independent of the production settings object.
const corePolicy = {
    axesThreshold: 4,
    axesMatchThreshold: 3,
    wildcardOffset: 20,
    campMatchThreshold: 70,
};
const devPolicy = {
    axesThreshold: 2,
    axesMatchThreshold: 2,
    wildcardOffset: 20,
    campMatchThreshold: 70,
};
const corePositions = (score: CampPosition = 50): CampAxisScore[] => [
    { axisId: 'regulation', score },
    { axisId: 'control', score },
    { axisId: 'geopolitics', score },
    { axisId: 'openness', score },
];
const devPositions = (score: CampPosition = 50): CampAxisScore[] => [
    { axisId: 'openSourcePreference', score },
    { axisId: 'aiDelegation', score },
];

describe('calculateCampMatch: distance over supplied module scores', () => {
    test('identical defined positions have similarity 100', () => {
        expect(
            calculateCampMatch({
                user: corePositions(),
                camp: corePositions(),
                settings: corePolicy,
            }),
        ).toBe(100);
    });

    test('equal 33-point differences in either direction give similarity 67', () => {
        const user: UserAxisScore[] = [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 17 },
        ];
        expect(
            calculateCampMatch({
                user,
                camp: corePositions(),
                settings: devPolicy,
            }),
        ).toBe(67);
    });

    test('uses RMS rather than absolute mean or unnormalized Euclidean distance', () => {
        // Differences 0, 10, -20, wildcard 20 -> RMS 15 -> similarity 85.
        const user: UserAxisScore[] = [
            { axisId: 'regulation', score: 50 },
            { axisId: 'control', score: 60 },
            { axisId: 'geopolitics', score: 30 },
            { axisId: 'capability', score: 80 },
        ];
        expect(
            calculateCampMatch({
                user,
                camp: corePositions(),
                settings: corePolicy,
            }),
        ).toBe(85);
    });

    test('a wildcard contributes 20 points inside RMS, not a final subtraction', () => {
        const user: UserAxisScore[] = [
            ...corePositions().slice(0, 3),
            { axisId: 'capability', score: 0 },
        ];
        // 3 exact axes + 1 wildcard -> sqrt(400/4) = 10 -> 90.
        expect(
            calculateCampMatch({
                user,
                camp: corePositions(),
                settings: corePolicy,
            }),
        ).toBe(90);
    });

    test('the wildcard discrepancy can be supplied explicitly', () => {
        const user: UserAxisScore[] = [
            ...corePositions().slice(0, 3),
            { axisId: 'capability', score: 100 },
        ];
        expect(
            calculateCampMatch({
                user,
                camp: corePositions(),
                settings: { ...corePolicy, wildcardOffset: 10 },
            }),
        ).toBe(95);
    });

    test('Undefined defining and wildcard axes add neither charge nor denominator', () => {
        const user: UserAxisScore[] = [
            ...corePositions().slice(0, 3),
            { axisId: 'openness', score: null },
            { axisId: 'capability', score: null },
        ];
        expect(
            calculateCampMatch({
                user,
                camp: corePositions(),
                settings: corePolicy,
            }),
        ).toBe(100);
    });

    test('zero is a present user score, not missing information', () => {
        expect(
            calculateCampMatch({
                user: [
                    { axisId: 'openSourcePreference', score: 0 },
                    { axisId: 'aiDelegation', score: 0 },
                ],
                camp: devPositions(17),
                settings: devPolicy,
            }),
        ).toBe(83);
    });

    test('wildcards cannot satisfy the minimum shared defining-axis count', () => {
        const user: UserAxisScore[] = [
            ...corePositions().slice(0, 2),
            { axisId: 'capability', score: 50 },
            { axisId: 'labor', score: 50 },
        ];
        expect(
            calculateCampMatch({
                user,
                camp: corePositions(),
                settings: corePolicy,
            }),
        ).toBeNull();
    });

    test.each([
        { user: [] },
        { user: [{ axisId: 'regulation', score: null }] },
    ] satisfies { user: UserAxisScore[] }[])(
        'no scored shared axes produce no similarity: %j',
        ({ user }) => {
            expect(
                calculateCampMatch({
                    user,
                    camp: corePositions(),
                    settings: corePolicy,
                }),
            ).toBeNull();
        },
    );

    test('user order and camp position order cannot affect distance or mutate inputs', () => {
        const user: UserAxisScore[] = [
            { axisId: 'regulation', score: 50 },
            { axisId: 'control', score: 60 },
            { axisId: 'geopolitics', score: 30 },
            { axisId: 'capability', score: 80 },
        ];
        const camp = corePositions();
        const before = structuredClone({ user, camp });
        expect(calculateCampMatch({ user, camp, settings: corePolicy })).toBe(
            85,
        );
        expect(
            calculateCampMatch({
                user: user.toReversed(),
                camp: camp.toReversed(),
                settings: corePolicy,
            }),
        ).toBe(85);
        expect({ user, camp }).toEqual(before);
    });
});

describe('findCampMatches: eligibility belongs to the camp definition', () => {
    test('a core camp with four definitions and three shared scores is eligible', () => {
        const result = findCampMatches({
            user: corePositions().slice(0, 3),
            camps: [{ id: 'core-candidate', positions: corePositions() }],
            settings: corePolicy,
        });
        expect(result).toEqual([
            { id: 'core-candidate', match: 100, passesThreshold: true },
        ]);
    });

    test('a core camp with only three definitions is ineligible even with four user scores', () => {
        expect(
            findCampMatches({
                user: corePositions(),
                camps: [
                    {
                        id: 'too-narrow',
                        positions: corePositions().slice(0, 3),
                    },
                ],
                settings: corePolicy,
            }),
        ).toEqual([]);
    });

    test('four definitions do not rescue only two shared core scores', () => {
        expect(
            findCampMatches({
                user: [
                    ...corePositions().slice(0, 2),
                    { axisId: 'capability', score: 50 },
                    { axisId: 'labor', score: 50 },
                ],
                camps: [
                    { id: 'insufficient-overlap', positions: corePositions() },
                ],
                settings: corePolicy,
            }),
        ).toEqual([]);
    });

    test('a developer camp needs only two definitions and two shared scores', () => {
        expect(
            findCampMatches({
                user: devPositions(),
                camps: [{ id: 'dev-candidate', positions: devPositions() }],
                settings: devPolicy,
            }),
        ).toEqual([{ id: 'dev-candidate', match: 100, passesThreshold: true }]);
    });

    test('one developer definition is insufficient', () => {
        expect(
            findCampMatches({
                user: devPositions(),
                camps: [
                    { id: 'too-narrow', positions: devPositions().slice(0, 1) },
                ],
                settings: devPolicy,
            }),
        ).toEqual([]);
    });

    test('no eligible camps return an empty list, with no fabricated match', () => {
        expect(
            findCampMatches({
                user: [],
                camps: [{ id: 'candidate', positions: corePositions() }],
                settings: corePolicy,
            }),
        ).toEqual([]);
        expect(
            findCampMatches({
                user: corePositions(),
                camps: [],
                settings: corePolicy,
            }),
        ).toEqual([]);
    });
});

describe('findCampMatches: deterministic ranking and low-match behavior', () => {
    test('ranks by decreasing similarity without mutating the supplied camps', () => {
        const camps: CampDefinition[] = [
            { id: 'far', positions: corePositions(17) },
            { id: 'close', positions: corePositions(50) },
            { id: 'middle', positions: corePositions(33) },
        ];
        const before = structuredClone(camps);
        expect(
            findCampMatches({
                user: corePositions(),
                camps,
                settings: corePolicy,
            }),
        ).toEqual([
            { id: 'close', match: 100, passesThreshold: true },
            { id: 'middle', match: 83, passesThreshold: true },
            { id: 'far', match: 67, passesThreshold: false },
        ]);
        expect(camps).toEqual(before);
    });

    test('breaks exact ties by stable camp ID independently of input order', () => {
        const camps = [
            { id: 'zeta', positions: devPositions() },
            { id: 'alpha', positions: devPositions() },
        ];
        expect(
            findCampMatches({
                user: devPositions(),
                camps,
                settings: devPolicy,
            }).map((c) => c.id),
        ).toEqual(['alpha', 'zeta']);
        expect(
            findCampMatches({
                user: devPositions(),
                camps: camps.toReversed(),
                settings: devPolicy,
            }).map((c) => c.id),
        ).toEqual(['alpha', 'zeta']);
    });

    test('preserves unrounded similarity for rankings that display the same percentage', () => {
        const user: UserAxisScore[] = [
            { axisId: 'openSourcePreference', score: 49 },
            { axisId: 'aiDelegation', score: 49 },
        ];
        const camps: CampDefinition[] = [
            {
                id: 'a-farther',
                positions: [
                    { axisId: 'openSourcePreference', score: 33 },
                    { axisId: 'aiDelegation', score: 50 },
                ],
            },
            {
                id: 'z-nearer',
                positions: [
                    { axisId: 'openSourcePreference', score: 50 },
                    { axisId: 'aiDelegation', score: 33 },
                ],
            },
        ];
        // Change one user coordinate so the distances are close but not equal.
        user[1].score = 48;
        const result = findCampMatches({ user, camps, settings: devPolicy });
        // RMS sqrt(226/2) vs sqrt(260/2): both similarities display as 89.
        expect(result.map((c) => c.id)).toEqual(['z-nearer', 'a-farther']);
        expect(result[0].match).toBeCloseTo(89.36985418726535, 10);
        expect(result[1].match).toBeCloseTo(88.59824574900863, 10);
        expect(result.map((c) => Math.round(c.match))).toEqual([89, 89]);
    });

    test('below the default 70 threshold remains a comparison but is not a close match', () => {
        const user = devPositions().map((p) => ({ ...p, score: 19 }));
        expect(
            findCampMatches({
                user,
                camps: [{ id: 'nearest', positions: devPositions() }],
            }),
        ).toEqual([{ id: 'nearest', match: 69, passesThreshold: false }]);
    });

    test('exactly 70 passes the agreed threshold', () => {
        const user = devPositions().map((p) => ({ ...p, score: 20 }));
        expect(
            findCampMatches({
                user,
                camps: [{ id: 'boundary', positions: devPositions() }],
                settings: devPolicy,
            }),
        ).toEqual([{ id: 'boundary', match: 70, passesThreshold: true }]);
    });

    test('uses raw similarity for the threshold even if the display rounds to 70', () => {
        // Differences 30, 30, 31 -> similarity 69.66300388414612.
        const user: UserAxisScore[] = [
            { axisId: 'regulation', score: 47 },
            { axisId: 'control', score: 47 },
            { axisId: 'geopolitics', score: 48 },
        ];
        const camp = corePositions(17).slice(0, 3);
        const result = findCampMatches({
            user,
            camps: [{ id: 'near-boundary', positions: camp }],
            settings: { ...devPolicy, axesThreshold: 3 },
        });
        expect(result).toHaveLength(1);
        expect(result[0].match).toBeCloseTo(69.66300388414612, 10);
        expect(Math.round(result[0].match)).toBe(70);
        expect(result[0].passesThreshold).toBe(false);
    });
});

describe('configured camp matching policies', () => {
    test('the default close-match policy is 70, with the 20-point wildcard discrepancy', () => {
        expect(getSetting(['campMatchThreshold', 'wildcardOffset'])).toEqual({
            campMatchThreshold: 70,
            wildcardOffset: 20,
        });
    });
});

describe('canonical camp positions from the research archive', () => {
    // Research LEVEL.MODERATE is 50. These copied coordinates drifted during import.
    test.each([
        ['securitists', 'regulation'],
        ['cautiousBuilders', 'openness'],
        ['cautiousBuilders', 'existentialRisk'],
        ['normalTechnologyCamp', 'regulation'],
        ['normalTechnologyCamp', 'control'],
        ['normalTechnologyCamp', 'capability'],
        ['normalTechnologyCamp', 'labor'],
        ['populists', 'capability'],
        ['creativesCopyright', 'capability'],
        ['unconcerned', 'capability'],
        ['existentialWorriers', 'capability'],
        ['surveillanceCritics', 'control'],
        ['vibeCoders', 'displacementRisk'],
        ['balancedUsers', 'openSourcePreference'],
        ['balancedUsers', 'aiDelegation'],
        ['balancedUsers', 'displacementRisk'],
    ])('%s retains its canonical moderate position on %s', (campId, axisId) => {
        const camp = [...coreCamps, ...devCamps].find((c) => c.id === campId);
        expect(camp?.positions.find((p) => p.axisId === axisId)?.score).toBe(
            50,
        );
    });
});
