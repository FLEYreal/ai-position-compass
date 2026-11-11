export type ModelId = 'dev' | 'core'; // Id of the questionnary
export type QuestionKey = -1 | -0.5 | 0.5 | 1; // How question answer influences an axis position
export type CampPosition = 17 | 33 | 50 | 67 | 83; // What position on an axis satisfies the camp requirement

/* --- AXES --- */
export type CoreAxisDefinition = { readonly id: string };
export type DevAxisDefinition = { readonly id: string };
export type AxisDefinition = { readonly id: string; readonly modelId: ModelId };

export const coreAxes = [
    { id: 'regulation' },
    { id: 'control' },
    { id: 'geopolitics' },
    { id: 'openness' },
    { id: 'capability' },
    { id: 'existentialRisk' },
    { id: 'ecology' },
    { id: 'creativity' },
    { id: 'labor' },
    { id: 'surveillance' },
] as const satisfies CoreAxisDefinition[];

export const devAxes = [
    { id: 'openSourcePreference' },
    { id: 'aiDelegation' },
    { id: 'dispacementRisk' },
] as const satisfies DevAxisDefinition[];

// Merge all axes together and add a model id
export const axes = [
    ...coreAxes.map(
        ({ id }) => ({ id, modelId: 'core' }) satisfies AxisDefinition,
    ),
    ...devAxes.map(
        ({ id }) => ({ id, modelId: 'dev' }) satisfies AxisDefinition,
    ),
] as const satisfies AxisDefinition[];

export type CoreAxisId = (typeof coreAxes)[number]['id'];
export type DevAxisId = (typeof devAxes)[number]['id'];
export type AxisId = (typeof axes)[number]['id'];

/* --- QUESTIONS --- */
export type QuestionDefinition<TAxisId extends AxisId = AxisId> = {
    readonly id: string; // Gives each question a unique identifier
    readonly axisId: TAxisId; // Answers a question "What axis this question influences/belongs to?"
    readonly key: QuestionKey; // "How this question influences the axis it belongs to?"
    readonly secondary?: {
        // Any other questions it influences?
        readonly axisId: TAxisId;
        readonly key: QuestionKey;
    }[];
};

export const coreQuestions = [
    {
        id: 'R1',
        axisId: 'regulation',
        key: 1,
        secondary: [{ axisId: 'control', key: 0.5 }],
    },
    {
        id: 'R2',
        axisId: 'regulation',
        key: -1,
    },
    {
        id: 'R3',
        axisId: 'regulation',
        key: 1,
    },
    {
        id: 'R4',
        axisId: 'regulation',
        key: -1,
    },
    {
        id: 'R5',
        axisId: 'regulation',
        key: 1,
    },
    {
        id: 'R6',
        axisId: 'regulation',
        key: -1,
    },
    {
        id: 'R7',
        axisId: 'regulation',
        key: 1,
    },
    {
        id: 'C1',
        axisId: 'control',
        key: 1,
    },
    {
        id: 'C2',
        axisId: 'control',
        key: -1,
    },
    {
        id: 'C3',
        axisId: 'control',
        key: 1,
    },
    {
        id: 'C4',
        axisId: 'control',
        key: -1,
    },
    {
        id: 'C5',
        axisId: 'control',
        key: 1,
        secondary: [{ axisId: 'geopolitics', key: 0.5 }],
    },
    {
        id: 'C6',
        axisId: 'control',
        key: -1,
    },
    {
        id: 'C7',
        axisId: 'control',
        key: 1,
    },
    {
        id: 'A1',
        axisId: 'geopolitics',
        key: -1,
    },
    {
        id: 'A2',
        axisId: 'geopolitics',
        key: 1,
    },
    {
        id: 'A3',
        axisId: 'geopolitics',
        key: -1,
    },
    {
        id: 'A4',
        axisId: 'geopolitics',
        key: 1,
    },
    {
        id: 'A5',
        axisId: 'geopolitics',
        key: -1,
    },
    {
        id: 'A6',
        axisId: 'geopolitics',
        key: 1,
    },
    {
        id: 'A7',
        axisId: 'geopolitics',
        key: -1,
    },
    {
        id: 'O1',
        axisId: 'openness',
        key: 1,
    },
    {
        id: 'O2',
        axisId: 'openness',
        key: -1,
    },
    {
        id: 'O3',
        axisId: 'openness',
        key: 1,
    },
    {
        id: 'O4',
        axisId: 'openness',
        key: -1,
    },
    {
        id: 'O6',
        axisId: 'openness',
        key: -1,
    },
    {
        id: 'O7',
        axisId: 'openness',
        key: 1,
    },
    {
        id: 'P1',
        axisId: 'capability',
        key: 1,
    },
    {
        id: 'P2',
        axisId: 'capability',
        key: -1,
    },
    {
        id: 'P3',
        axisId: 'capability',
        key: 1,
    },
    {
        id: 'P4',
        axisId: 'capability',
        key: -1,
    },
    {
        id: 'P5',
        axisId: 'capability',
        key: 1,
    },
    {
        id: 'P6',
        axisId: 'capability',
        key: -1,
    },
    {
        id: 'P7',
        axisId: 'capability',
        key: 1,
    },
    {
        id: 'X1',
        axisId: 'existentialRisk',
        key: 1,
    },
    {
        id: 'X2',
        axisId: 'existentialRisk',
        key: -1,
    },
    {
        id: 'X3',
        axisId: 'existentialRisk',
        key: 1,
    },
    {
        id: 'X4',
        axisId: 'existentialRisk',
        key: -1,
    },
    {
        id: 'X5',
        axisId: 'existentialRisk',
        key: 1,
    },
    {
        id: 'X6',
        axisId: 'existentialRisk',
        key: -1,
    },
    {
        id: 'X7',
        axisId: 'existentialRisk',
        key: -1,
    },
    {
        id: 'E2',
        axisId: 'ecology',
        key: -1,
    },
    {
        id: 'E3',
        axisId: 'ecology',
        key: 1,
    },
    {
        id: 'E4',
        axisId: 'ecology',
        key: -1,
    },
    {
        id: 'E5',
        axisId: 'ecology',
        key: 1,
    },
    {
        id: 'E7',
        axisId: 'ecology',
        key: 1,
    },
    {
        id: 'K1',
        axisId: 'creativity',
        key: 1,
        secondary: [{ axisId: 'labor', key: 0.5 }],
    },
    {
        id: 'K2',
        axisId: 'creativity',
        key: -1,
    },
    {
        id: 'K4',
        axisId: 'creativity',
        key: -1,
    },
    {
        id: 'K5',
        axisId: 'creativity',
        key: 1,
    },
    {
        id: 'K6',
        axisId: 'creativity',
        key: -1,
    },
    {
        id: 'K7',
        axisId: 'creativity',
        key: 1,
    },
    {
        id: 'L1',
        axisId: 'labor',
        key: 1,
    },
    {
        id: 'L2',
        axisId: 'labor',
        key: -1,
    },
    {
        id: 'L3',
        axisId: 'labor',
        key: 1,
    },
    {
        id: 'L4',
        axisId: 'labor',
        key: -1,
    },
    {
        id: 'L5',
        axisId: 'labor',
        key: 1,
    },
    {
        id: 'L6',
        axisId: 'labor',
        key: -1,
    },
    {
        id: 'L7',
        axisId: 'labor',
        key: 1,
    },
    {
        id: 'S1',
        axisId: 'surveillance',
        key: 1,
    },
    {
        id: 'S2',
        axisId: 'surveillance',
        key: -1,
    },
    {
        id: 'S3',
        axisId: 'surveillance',
        key: 1,
    },
    {
        id: 'S4',
        axisId: 'surveillance',
        key: -1,
    },
    {
        id: 'S5',
        axisId: 'surveillance',
        key: 1,
    },
    {
        id: 'S6',
        axisId: 'surveillance',
        key: -1,
    },
    {
        id: 'S7',
        axisId: 'surveillance',
        key: 1,
    },
] as const satisfies QuestionDefinition<CoreAxisId>[];

export const devQuestions = [
    {
        id: 'D1',
        axisId: 'openSourcePreference',
        key: 1,
    },
    {
        id: 'D2',
        axisId: 'openSourcePreference',
        key: -1,
    },
    {
        id: 'D3',
        axisId: 'openSourcePreference',
        key: 1,
    },
    {
        id: 'D4',
        axisId: 'openSourcePreference',
        key: -1,
    },
    {
        id: 'D5',
        axisId: 'openSourcePreference',
        key: 1,
    },
    {
        id: 'G1',
        axisId: 'aiDelegation',
        key: 1,
    },
    {
        id: 'G2',
        axisId: 'aiDelegation',
        key: -1,
    },
    {
        id: 'G3',
        axisId: 'aiDelegation',
        key: 1,
    },
    {
        id: 'G4',
        axisId: 'aiDelegation',
        key: -1,
    },
    {
        id: 'G5',
        axisId: 'aiDelegation',
        key: 1,
    },
    {
        id: 'H1',
        axisId: 'dispacementRisk',
        key: 1,
    },
    {
        id: 'H2',
        axisId: 'dispacementRisk',
        key: -1,
    },
    {
        id: 'H3',
        axisId: 'dispacementRisk',
        key: 1,
    },
    {
        id: 'H4',
        axisId: 'dispacementRisk',
        key: -1,
    },
    {
        id: 'H5',
        axisId: 'dispacementRisk',
        key: 1,
    },
] as const satisfies QuestionDefinition<DevAxisId>[];

export type ModeledQuestionDefinition = QuestionDefinition & {
    readonly modelId: ModelId;
};
export const questions = [
    ...coreQuestions.map(
        (question) =>
            ({
                ...question,
                modelId: 'core',
            }) satisfies ModeledQuestionDefinition,
    ),
    ...devQuestions.map(
        (question) =>
            ({
                ...question,
                modelId: 'dev',
            }) satisfies ModeledQuestionDefinition,
    ),
] as const satisfies ModeledQuestionDefinition[];

/* --- SUGGESTIONS --- */
export type SuggestionDefinition = {
    readonly id: string;
    readonly questionId: string;
};

export const coreSuggestions = [
    { id: 'CS1', questionId: 'L5' },
    { id: 'CS2', questionId: 'O1' },
    { id: 'CS3', questionId: 'A3' },
    { id: 'CS4', questionId: 'E3' },
    { id: 'CS5', questionId: 'P7' },
    { id: 'CS6', questionId: 'X7' },
] as const satisfies SuggestionDefinition[];
export const devSuggestions = [
    { id: 'DS6', questionId: 'D2' },
] as const satisfies SuggestionDefinition[];

export type ModeledSuggestionDefinition = SuggestionDefinition & {
    readonly modelId: ModelId;
};
export const suggestions = [
    ...coreSuggestions.map(
        (suggestion) =>
            ({
                ...suggestion,
                modelId: 'core',
            }) satisfies ModeledSuggestionDefinition,
    ),
    ...devSuggestions.map(
        (suggestion) =>
            ({
                ...suggestion,
                modelId: 'dev',
            }) satisfies ModeledSuggestionDefinition,
    ),
] as const satisfies SuggestionDefinition[];

/* --- CAMPS --- */
export type CampDefinition<TAxisId extends AxisId = AxisId> = {
    readonly id: string;
    readonly positions: {
        readonly axisId: TAxisId;
        readonly position: CampPosition;
    }[];
};

export const coreCamps = [
    {
        id: 'accelerationists',
        positions: [
            { axisId: 'regulation', position: 17 },
            { axisId: 'control', position: 17 },
            { axisId: 'geopolitics', position: 17 },
            { axisId: 'openness', position: 83 },
            { axisId: 'capability', position: 83 },
            { axisId: 'existentialRisk', position: 17 },
            { axisId: 'labor', position: 33 },
        ],
    },
    {
        id: 'securitists',
        positions: [
            { axisId: 'regulation', position: 33 },
            { axisId: 'control', position: 83 },
            { axisId: 'geopolitics', position: 17 },
            { axisId: 'openness', position: 17 },
            { axisId: 'capability', position: 83 },
            { axisId: 'existentialRisk', position: 67 },
        ],
    },
    {
        id: 'safetyCamp',
        positions: [
            { axisId: 'regulation', position: 67 },
            { axisId: 'control', position: 83 },
            { axisId: 'geopolitics', position: 83 },
            { axisId: 'openness', position: 17 },
            { axisId: 'capability', position: 83 },
            { axisId: 'existentialRisk', position: 83 },
        ],
    },
    {
        id: 'pauseCamp',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'control', position: 83 },
            { axisId: 'geopolitics', position: 83 },
            { axisId: 'openness', position: 17 },
            { axisId: 'capability', position: 83 },
            { axisId: 'existentialRisk', position: 83 },
        ],
    },
    {
        id: 'cautiousBuilders',
        positions: [
            { axisId: 'regulation', position: 33 },
            { axisId: 'control', position: 17 },
            { axisId: 'openness', position: 33 },
            { axisId: 'capability', position: 83 },
            { axisId: 'existentialRisk', position: 33 },
        ],
    },
    {
        id: 'guardedOptimists',
        positions: [
            { axisId: 'regulation', position: 33 },
            { axisId: 'control', position: 33 },
            { axisId: 'openness', position: 83 },
            { axisId: 'capability', position: 83 },
            { axisId: 'existentialRisk', position: 67 },
            { axisId: 'surveillance', position: 67 },
        ],
    },
    {
        id: 'ethicsCamp',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'control', position: 83 },
            { axisId: 'capability', position: 33 },
            { axisId: 'existentialRisk', position: 17 },
            { axisId: 'ecology', position: 83 },
            { axisId: 'creativity', position: 83 },
            { axisId: 'labor', position: 83 },
            { axisId: 'surveillance', position: 83 },
        ],
    },
    {
        id: 'normalTechnologyCamp',
        positions: [
            { axisId: 'regulation', position: 33 },
            { axisId: 'control', position: 33 },
            { axisId: 'geopolitics', position: 67 },
            { axisId: 'openness', position: 67 },
            { axisId: 'capability', position: 33 },
            { axisId: 'existentialRisk', position: 17 },
            { axisId: 'labor', position: 33 },
        ],
    },
    {
        id: 'hypeSkeptics',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'control', position: 83 },
            { axisId: 'capability', position: 17 },
            { axisId: 'existentialRisk', position: 17 },
        ],
    },
    {
        id: 'populists',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'control', position: 83 },
            { axisId: 'capability', position: 33 },
            { axisId: 'labor', position: 83 },
        ],
    },
    {
        id: 'creativesCopyright',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'capability', position: 33 },
            { axisId: 'creativity', position: 83 },
            { axisId: 'labor', position: 83 },
        ],
    },
    {
        id: 'unconcerned',
        positions: [
            { axisId: 'regulation', position: 33 },
            { axisId: 'capability', position: 33 },
            { axisId: 'existentialRisk', position: 17 },
            { axisId: 'ecology', position: 17 },
            { axisId: 'creativity', position: 17 },
            { axisId: 'labor', position: 17 },
            { axisId: 'surveillance', position: 17 },
        ],
    },
    {
        id: 'existentialWorriers',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'control', position: 83 },
            { axisId: 'capability', position: 33 },
            { axisId: 'existentialRisk', position: 83 },
        ],
    },
    {
        id: 'laborCritics',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'control', position: 83 },
            { axisId: 'capability', position: 17 },
            { axisId: 'labor', position: 83 },
        ],
    },
    {
        id: 'surveillanceCritics',
        positions: [
            { axisId: 'regulation', position: 83 },
            { axisId: 'control', position: 33 },
            { axisId: 'capability', position: 67 },
            { axisId: 'surveillance', position: 83 },
        ],
    },
] as const satisfies CampDefinition<CoreAxisId>[];

export const devCamps = [
    {
        id: 'vibeCoders',
        positions: [
            { axisId: 'aiDelegation', position: 83 },
            { axisId: 'dispacementRisk', position: 33 },
        ],
    },
    {
        id: 'vibeFounders',
        positions: [
            { axisId: 'aiDelegation', position: 83 },
            { axisId: 'dispacementRisk', position: 83 },
        ],
    },
    {
        id: 'openSourceAdvocatesSelfHosters',
        positions: [
            { axisId: 'openSourcePreference', position: 83 },
            { axisId: 'aiDelegation', position: 83 },
        ],
    },
    {
        id: 'craftspeople',
        positions: [
            { axisId: 'openSourcePreference', position: 83 },
            { axisId: 'aiDelegation', position: 17 },
        ],
    },
    {
        id: 'corporatePragmatists',
        positions: [
            { axisId: 'openSourcePreference', position: 17 },
            { axisId: 'aiDelegation', position: 83 },
        ],
    },
    {
        id: 'balancedUsers',
        positions: [
            { axisId: 'openSourcePreference', position: 33 },
            { axisId: 'aiDelegation', position: 33 },
            { axisId: 'dispacementRisk', position: 33 },
        ],
    },
    {
        id: 'skeptics',
        positions: [
            { axisId: 'aiDelegation', position: 17 },
            { axisId: 'dispacementRisk', position: 17 },
        ],
    },
] as const satisfies CampDefinition<DevAxisId>[];

export type ModeledCampDefinition = CampDefinition & {
    readonly modelId: ModelId;
};
export const camps = [
    ...coreCamps.map(
        (camp) =>
            ({
                ...camp,
                modelId: 'core',
            }) satisfies ModeledCampDefinition,
    ),
    ...devCamps.map(
        (camp) =>
            ({
                ...camp,
                modelId: 'dev',
            }) satisfies ModeledCampDefinition,
    ),
] as const satisfies ModeledCampDefinition[];

/* --- CONFIG --- */
export const scoringConfig = {
    axes,
    questions,
    camps,
} as const;

export function getQuestionCount(type?: ModelId) {
    switch (type) {
        case 'dev':
            return devQuestions.length;
        case 'core':
            return coreQuestions.length;
        case undefined:
            return questions.length;
        default: {
            const _exhaustiveCheck: never = type;
            throw new Error(`Unhandled type ${_exhaustiveCheck}`);
        }
    }
}

// Returns in minutes
export function getCompletionTime(type?: ModelId) {
    const secondsMultiplier = 15; // Estimation on how many seconds it takes a user to complete one question.
    return Math.floor((getQuestionCount(type) * secondsMultiplier) / 60);
}
