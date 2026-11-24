export type ModelId = 'dev' | 'core'; // Id of the questionnary
export type QuestionKey = -1 | 1; // How question answer influences an axis position
export type QuestionWeight = 0.5 | 1;
export type CampPosition = 17 | 33 | 50 | 67 | 83; // What position on an axis satisfies the camp requirement

/* --- AXES --- */
export type CoreAxisDefinition = { readonly id: string };
export type DevAxisDefinition = { readonly id: string };
export type AxisDefinition = { readonly id: string; readonly modelId: ModelId };

const v1CoreAxes = [
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

const v1DevAxes = [
    { id: 'openSourcePreference' },
    { id: 'aiDelegation' },
    { id: 'displacementRisk' },
] as const satisfies DevAxisDefinition[];

export const coreAxes = v1CoreAxes;
export const devAxes = v1DevAxes;

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

const v1AxisConstruct = {
    regulation: 'value',
    control: 'value',
    geopolitics: 'value',
    openness: 'value',
    capability: 'belief',
    existentialRisk: 'belief',
    ecology: 'belief',
    creativity: 'belief',
    labor: 'belief',
    surveillance: 'belief',
    openSourcePreference: 'value',
    aiDelegation: 'value',
    displacementRisk: 'belief',
} as const satisfies Record<AxisId, 'belief' | 'value'>;

export const axisConstruct = v1AxisConstruct;

/* --- QUESTIONS --- */
export type QuestionDefinition<TAxisId extends AxisId = AxisId> = {
    readonly id: string; // Gives each question a unique identifier
    readonly axisId: TAxisId; // Answers a question "What axis this question influences/belongs to?"
    readonly key: QuestionKey; // "How this question influences the axis it belongs to?"
    readonly weight: QuestionWeight; // "How strongly this question influences the axis it belongs to??"
    readonly secondary?: {
        // Any other questions it influences?
        readonly axisId: TAxisId;
        readonly key: QuestionKey;
        readonly weight: QuestionWeight;
    }[];
};

// Fixed presentation order: interleave value and belief axes and spread out question keys.
export const coreQuestions = [
    {
        id: 'S7',
        axisId: 'surveillance',
        key: 1,
        weight: 1,
    },
    {
        id: 'K6',
        axisId: 'creativity',
        key: -1,
        weight: 1,
    },
    {
        id: 'O3',
        axisId: 'openness',
        key: 1,
        weight: 1,
    },
    {
        id: 'X7',
        axisId: 'existentialRisk',
        key: -1,
        weight: 1,
    },
    {
        id: 'R5',
        axisId: 'regulation',
        key: 1,
        weight: 1,
    },
    {
        id: 'S4',
        axisId: 'surveillance',
        key: -1,
        weight: 1,
    },
    {
        id: 'X5',
        axisId: 'existentialRisk',
        key: 1,
        weight: 1,
    },
    {
        id: 'O6',
        axisId: 'openness',
        key: -1,
        weight: 1,
    },
    {
        id: 'C1',
        axisId: 'control',
        key: 1,
        weight: 1,
    },
    {
        id: 'X6',
        axisId: 'existentialRisk',
        key: -1,
        weight: 1,
    },
    {
        id: 'P7',
        axisId: 'capability',
        key: 1,
        weight: 1,
    },
    {
        id: 'C2',
        axisId: 'control',
        key: -1,
        weight: 1,
    },
    {
        id: 'L1',
        axisId: 'labor',
        key: 1,
        weight: 1,
    },
    {
        id: 'A3',
        axisId: 'geopolitics',
        key: -1,
        weight: 1,
    },
    {
        id: 'O7',
        axisId: 'openness',
        key: 1,
        weight: 1,
    },
    {
        id: 'L4',
        axisId: 'labor',
        key: -1,
        weight: 1,
    },
    {
        id: 'S3',
        axisId: 'surveillance',
        key: 1,
        weight: 1,
    },
    {
        id: 'C3',
        axisId: 'control',
        key: 1,
        weight: 1,
    },
    {
        id: 'P2',
        axisId: 'capability',
        key: -1,
        weight: 1,
    },
    {
        id: 'K1',
        axisId: 'creativity',
        key: 1,
        weight: 1,
        secondary: [{ axisId: 'labor', key: 1, weight: 0.5 }],
    },
    {
        id: 'O2',
        axisId: 'openness',
        key: -1,
        weight: 1,
    },
    {
        id: 'P3',
        axisId: 'capability',
        key: 1,
        weight: 1,
    },
    {
        id: 'R2',
        axisId: 'regulation',
        key: -1,
        weight: 1,
    },
    {
        id: 'A4',
        axisId: 'geopolitics',
        key: 1,
        weight: 1,
    },
    {
        id: 'S6',
        axisId: 'surveillance',
        key: -1,
        weight: 1,
    },
    {
        id: 'L5',
        axisId: 'labor',
        key: 1,
        weight: 1,
    },
    {
        id: 'C6',
        axisId: 'control',
        key: -1,
        weight: 1,
    },
    {
        id: 'X3',
        axisId: 'existentialRisk',
        key: 1,
        weight: 1,
    },
    {
        id: 'L6',
        axisId: 'labor',
        key: -1,
        weight: 1,
    },
    {
        id: 'C7',
        axisId: 'control',
        key: 1,
        weight: 1,
    },
    {
        id: 'X4',
        axisId: 'existentialRisk',
        key: -1,
        weight: 1,
    },
    {
        id: 'R7',
        axisId: 'regulation',
        key: 1,
        weight: 1,
    },
    {
        id: 'K4',
        axisId: 'creativity',
        key: -1,
        weight: 1,
    },
    {
        id: 'E7',
        axisId: 'ecology',
        key: 1,
        weight: 1,
    },
    {
        id: 'O1',
        axisId: 'openness',
        key: 1,
        weight: 1,
    },
    {
        id: 'R6',
        axisId: 'regulation',
        key: -1,
        weight: 1,
    },
    {
        id: 'S5',
        axisId: 'surveillance',
        key: 1,
        weight: 1,
    },
    {
        id: 'C4',
        axisId: 'control',
        key: -1,
        weight: 1,
    },
    {
        id: 'L3',
        axisId: 'labor',
        key: 1,
        weight: 1,
    },
    {
        id: 'E4',
        axisId: 'ecology',
        key: -1,
        weight: 1,
    },
    {
        id: 'C5',
        axisId: 'control',
        key: 1,
        weight: 1,
        secondary: [{ axisId: 'geopolitics', key: 1, weight: 0.5 }],
    },
    {
        id: 'P6',
        axisId: 'capability',
        key: -1,
        weight: 1,
    },
    {
        id: 'X1',
        axisId: 'existentialRisk',
        key: 1,
        weight: 1,
    },
    {
        id: 'A5',
        axisId: 'geopolitics',
        key: -1,
        weight: 1,
    },
    {
        id: 'E3',
        axisId: 'ecology',
        key: 1,
        weight: 1,
    },
    {
        id: 'S2',
        axisId: 'surveillance',
        key: -1,
        weight: 1,
    },
    {
        id: 'R1',
        axisId: 'regulation',
        key: 1,
        weight: 1,
        secondary: [{ axisId: 'control', key: 1, weight: 0.5 }],
    },
    {
        id: 'X2',
        axisId: 'existentialRisk',
        key: -1,
        weight: 1,
    },
    {
        id: 'S1',
        axisId: 'surveillance',
        key: 1,
        weight: 1,
    },
    {
        id: 'A6',
        axisId: 'geopolitics',
        key: 1,
        weight: 1,
    },
    {
        id: 'E2',
        axisId: 'ecology',
        key: -1,
        weight: 1,
    },
    {
        id: 'K5',
        axisId: 'creativity',
        key: 1,
        weight: 1,
    },
    {
        id: 'A7',
        axisId: 'geopolitics',
        key: -1,
        weight: 1,
    },
    {
        id: 'E5',
        axisId: 'ecology',
        key: 1,
        weight: 1,
    },
    {
        id: 'R4',
        axisId: 'regulation',
        key: -1,
        weight: 1,
    },
    {
        id: 'P1',
        axisId: 'capability',
        key: 1,
        weight: 1,
    },
    {
        id: 'K2',
        axisId: 'creativity',
        key: -1,
        weight: 1,
    },
    {
        id: 'A2',
        axisId: 'geopolitics',
        key: 1,
        weight: 1,
    },
    {
        id: 'L2',
        axisId: 'labor',
        key: -1,
        weight: 1,
    },
    {
        id: 'R3',
        axisId: 'regulation',
        key: 1,
        weight: 1,
    },
    {
        id: 'P4',
        axisId: 'capability',
        key: -1,
        weight: 1,
    },
    {
        id: 'L7',
        axisId: 'labor',
        key: 1,
        weight: 1,
    },
    {
        id: 'A1',
        axisId: 'geopolitics',
        key: -1,
        weight: 1,
    },
    {
        id: 'P5',
        axisId: 'capability',
        key: 1,
        weight: 1,
    },
    {
        id: 'O4',
        axisId: 'openness',
        key: -1,
        weight: 1,
    },
    {
        id: 'K7',
        axisId: 'creativity',
        key: 1,
        weight: 1,
    },
] as const satisfies QuestionDefinition<CoreAxisId>[];

// The optional developer module follows the core questions.
export const devQuestions = [
    {
        id: 'G5',
        axisId: 'aiDelegation',
        key: 1,
        weight: 1,
    },
    {
        id: 'D2',
        axisId: 'openSourcePreference',
        key: -1,
        weight: 1,
    },
    {
        id: 'H5',
        axisId: 'displacementRisk',
        key: 1,
        weight: 1,
    },
    {
        id: 'D1',
        axisId: 'openSourcePreference',
        key: 1,
        weight: 1,
    },
    {
        id: 'H4',
        axisId: 'displacementRisk',
        key: -1,
        weight: 1,
    },
    {
        id: 'D3',
        axisId: 'openSourcePreference',
        key: 1,
        weight: 1,
    },
    {
        id: 'G4',
        axisId: 'aiDelegation',
        key: -1,
        weight: 1,
    },
    {
        id: 'H3',
        axisId: 'displacementRisk',
        key: 1,
        weight: 1,
    },
    {
        id: 'D4',
        axisId: 'openSourcePreference',
        key: -1,
        weight: 1,
    },
    {
        id: 'G3',
        axisId: 'aiDelegation',
        key: 1,
        weight: 1,
    },
    {
        id: 'H2',
        axisId: 'displacementRisk',
        key: -1,
        weight: 1,
    },
    {
        id: 'D5',
        axisId: 'openSourcePreference',
        key: 1,
        weight: 1,
    },
    {
        id: 'G2',
        axisId: 'aiDelegation',
        key: -1,
        weight: 1,
    },
    {
        id: 'H1',
        axisId: 'displacementRisk',
        key: 1,
        weight: 1,
    },
    {
        id: 'G1',
        axisId: 'aiDelegation',
        key: 1,
        weight: 1,
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
    readonly sources?: readonly {
        readonly name: string;
        readonly url: string;
    }[];
};

const downloadableModelsSources = [
    {
        name: 'OpenAI',
        url: 'https://openai.com/blog/introducing-gpt-oss',
    },
] as const;

export const coreSuggestions = [
    {
        id: 'CS1',
        questionId: 'L5',
        sources: [
            {
                name: 'Business & Human Rights Resource Centre',
                url: 'https://www.business-humanrights.org/en/latest-news/openai-and-sama-hired-underpaid-workers-in-kenia-to-filter-toxic-content-for-chatgpt',
            },
        ],
    },
    {
        id: 'CS2',
        questionId: 'O1',
        sources: downloadableModelsSources,
    },
    {
        id: 'CS3',
        questionId: 'A3',
        sources: [
            {
                name: 'TechCrunch',
                url: 'https://techcrunch.com/2025/04/15/us-government-imposes-license-requirement-on-nvidia-h20-exports',
            },
        ],
    },
    {
        id: 'CS4',
        questionId: 'E3',
        sources: [
            {
                name: 'Fortune',
                url: 'https://www.fortune.com/2026/07/24/why-youre-paying-for-data-center-electricity-power/',
            },
            {
                name: 'SemiAnalysis',
                url: 'https://newsletter.semianalysis.com/p/are-ai-datacenters-increasing-electric',
            },
        ],
    },
    { id: 'CS5', questionId: 'P7' },
    {
        id: 'CS6',
        questionId: 'X4',
        sources: [
            {
                name: 'OpenAI',
                url: 'https://openai.com/index/hugging-face-incident-and-the-road-ahead/',
            },
        ],
    },
    {
        id: 'CS7',
        questionId: 'O3',
        sources: downloadableModelsSources,
    },
    {
        id: 'CS8',
        questionId: 'X6',
        sources: [
            {
                name: 'Wikipedia (EN)',
                url: 'https://en.wikipedia.org/wiki/Superintelligence',
            },
            {
                name: 'Википедия (RU)',
                url: 'https://ru.wikipedia.org/wiki/Искусственный_сверхинтеллект',
            },
        ],
    },
    {
        id: 'CS9',
        questionId: 'C3',
        sources: [
            {
                name: 'Levels of AGI',
                url: 'https://proceedings.mlr.press/v235/morris24b.html',
            },
        ],
    },
    {
        id: 'CS10',
        questionId: 'R3',
        sources: [
            {
                name: 'Anthropic',
                url: 'https://www.anthropic.com/threat-intelligence-report-september-2026',
            },
        ],
    },
] as const satisfies readonly SuggestionDefinition[];

export const devSuggestions = [
    { id: 'DS6', questionId: 'D2' },
] as const satisfies readonly SuggestionDefinition[];

export type ModeledSuggestionDefinition = SuggestionDefinition & {
    readonly modelId: ModelId;
};
export const suggestions: readonly ModeledSuggestionDefinition[] = [
    ...coreSuggestions.map((suggestion) => ({
        ...suggestion,
        modelId: 'core' as const,
    })),
    ...devSuggestions.map((suggestion) => ({
        ...suggestion,
        modelId: 'dev' as const,
    })),
];

/* --- CAMPS --- */
export type CampDefinition<TAxisId extends AxisId = AxisId> = {
    readonly id: string;
    readonly positions: {
        readonly axisId: TAxisId;
        readonly score: CampPosition;
    }[];
};

// Published positions belong to result format v1. Preserve them when adding a new version.
const v1CoreCamps = [
    {
        id: 'accelerationists',
        positions: [
            { axisId: 'regulation', score: 17 },
            { axisId: 'control', score: 17 },
            { axisId: 'geopolitics', score: 17 },
            { axisId: 'openness', score: 83 },
            { axisId: 'capability', score: 83 },
            { axisId: 'existentialRisk', score: 17 },
            { axisId: 'labor', score: 33 },
        ],
    },
    {
        id: 'securitists',
        positions: [
            { axisId: 'regulation', score: 50 },
            { axisId: 'control', score: 83 },
            { axisId: 'geopolitics', score: 17 },
            { axisId: 'openness', score: 17 },
            { axisId: 'capability', score: 83 },
            { axisId: 'existentialRisk', score: 67 },
        ],
    },
    {
        id: 'safetyCamp',
        positions: [
            { axisId: 'regulation', score: 67 },
            { axisId: 'control', score: 83 },
            { axisId: 'geopolitics', score: 83 },
            { axisId: 'openness', score: 17 },
            { axisId: 'capability', score: 83 },
            { axisId: 'existentialRisk', score: 83 },
        ],
    },
    {
        id: 'pauseCamp',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 83 },
            { axisId: 'geopolitics', score: 83 },
            { axisId: 'openness', score: 17 },
            { axisId: 'capability', score: 83 },
            { axisId: 'existentialRisk', score: 83 },
        ],
    },
    {
        id: 'cautiousBuilders',
        positions: [
            { axisId: 'regulation', score: 33 },
            { axisId: 'control', score: 17 },
            { axisId: 'openness', score: 50 },
            { axisId: 'capability', score: 83 },
            { axisId: 'existentialRisk', score: 50 },
        ],
    },
    {
        id: 'guardedOptimists',
        positions: [
            { axisId: 'regulation', score: 33 },
            { axisId: 'control', score: 33 },
            { axisId: 'openness', score: 83 },
            { axisId: 'capability', score: 83 },
            { axisId: 'existentialRisk', score: 67 },
            { axisId: 'surveillance', score: 67 },
        ],
    },
    {
        id: 'ethicsCamp',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 83 },
            { axisId: 'capability', score: 33 },
            { axisId: 'existentialRisk', score: 17 },
            { axisId: 'ecology', score: 83 },
            { axisId: 'creativity', score: 83 },
            { axisId: 'labor', score: 83 },
            { axisId: 'surveillance', score: 83 },
        ],
    },
    {
        id: 'normalTechnologyCamp',
        positions: [
            { axisId: 'regulation', score: 50 },
            { axisId: 'control', score: 50 },
            { axisId: 'geopolitics', score: 67 },
            { axisId: 'openness', score: 67 },
            { axisId: 'capability', score: 50 },
            { axisId: 'existentialRisk', score: 17 },
            { axisId: 'labor', score: 50 },
        ],
    },
    {
        id: 'hypeSkeptics',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 83 },
            { axisId: 'capability', score: 17 },
            { axisId: 'existentialRisk', score: 17 },
        ],
    },
    {
        id: 'populists',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 83 },
            { axisId: 'capability', score: 50 },
            { axisId: 'labor', score: 83 },
        ],
    },
    {
        id: 'creativesCopyright',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'capability', score: 50 },
            { axisId: 'creativity', score: 83 },
            { axisId: 'labor', score: 83 },
        ],
    },
    {
        id: 'unconcerned',
        positions: [
            { axisId: 'regulation', score: 33 },
            { axisId: 'capability', score: 50 },
            { axisId: 'existentialRisk', score: 17 },
            { axisId: 'ecology', score: 17 },
            { axisId: 'creativity', score: 17 },
            { axisId: 'labor', score: 17 },
            { axisId: 'surveillance', score: 17 },
        ],
    },
    {
        id: 'existentialWorriers',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 83 },
            { axisId: 'capability', score: 50 },
            { axisId: 'existentialRisk', score: 83 },
        ],
    },
    {
        id: 'laborCritics',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 83 },
            { axisId: 'capability', score: 17 },
            { axisId: 'labor', score: 83 },
        ],
    },
    {
        id: 'surveillanceCritics',
        positions: [
            { axisId: 'regulation', score: 83 },
            { axisId: 'control', score: 50 },
            { axisId: 'capability', score: 67 },
            { axisId: 'surveillance', score: 83 },
        ],
    },
] as const satisfies CampDefinition<CoreAxisId>[];

const v1DevCamps = [
    {
        id: 'vibeCoders',
        positions: [
            { axisId: 'aiDelegation', score: 83 },
            { axisId: 'displacementRisk', score: 50 },
        ],
    },
    {
        id: 'vibeFounders',
        positions: [
            { axisId: 'aiDelegation', score: 83 },
            { axisId: 'displacementRisk', score: 83 },
        ],
    },
    {
        id: 'openSourceAdvocatesSelfHosters',
        positions: [
            { axisId: 'openSourcePreference', score: 83 },
            { axisId: 'aiDelegation', score: 83 },
        ],
    },
    {
        id: 'craftspeople',
        positions: [
            { axisId: 'openSourcePreference', score: 83 },
            { axisId: 'aiDelegation', score: 17 },
        ],
    },
    {
        id: 'corporatePragmatists',
        positions: [
            { axisId: 'openSourcePreference', score: 17 },
            { axisId: 'aiDelegation', score: 83 },
        ],
    },
    {
        id: 'balancedUsers',
        positions: [
            { axisId: 'openSourcePreference', score: 50 },
            { axisId: 'aiDelegation', score: 50 },
            { axisId: 'displacementRisk', score: 50 },
        ],
    },
    {
        id: 'skeptics',
        positions: [
            { axisId: 'aiDelegation', score: 17 },
            { axisId: 'displacementRisk', score: 17 },
        ],
    },
] as const satisfies CampDefinition<DevAxisId>[];

export type ModeledCampDefinition = CampDefinition & {
    readonly modelId: ModelId;
};
export const coreCamps = v1CoreCamps;
export const devCamps = v1DevCamps;

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

export type CoreCampId = (typeof coreCamps)[number]['id'];
export type DevCampId = (typeof devCamps)[number]['id'];
export type CampId = (typeof camps)[number]['id'];

/* --- PEOPLE --- */
export type PeopleDefinition<TCampId extends CampId = CampId> = {
    readonly id: string;
    readonly campIds: TCampId[]; // One person can take part in multiple camps
    readonly sources: string[]; // A list of links to the source
};

export const corePeople = [
    // 2023: techno-optimism and opposition to barriers on open-source AI.
    {
        id: 'marc-andreessen',
        campIds: ['accelerationists'],
        sources: [
            'https://a16z.com/ai-will-save-the-world/',
            'https://a16z.com/the-techno-optimist-manifesto/',
        ],
    },
    // 2026-09: accelerationist example in the faction overviews.
    {
        id: 'david-sacks',
        campIds: ['accelerationists'],
        sources: [
            'https://www.kunc.org/npr-news/2026-09-26/the-ai-safety-debate-is-confusing-heres-our-guide-to-the-different-factions',
            'https://www.euronews.com/next/2026/09/15/doomers-vs-boosters-whos-who-in-the-global-fight-over-the-risks-of-ai',
        ],
    },
    // 2026-09-15: booster example in the Euronews overview.
    {
        id: 'jensen-huang',
        campIds: ['accelerationists'],
        sources: [
            'https://www.euronews.com/next/2026/09/15/doomers-vs-boosters-whos-who-in-the-global-fight-over-the-risks-of-ai',
        ],
    },
    // 2026-03 to 2026-10; caveat: also backed voluntary safety commitments.
    {
        id: 'donald-trump',
        campIds: ['accelerationists'],
        sources: [
            'https://www.kunc.org/npr-news/2026-09-26/the-ai-safety-debate-is-confusing-heres-our-guide-to-the-different-factions',
            'https://www.ropesgray.com/en/insights/alerts/2026/03/examining-the-landscape-and-limitations-of-the-federal-push-to-override-state-ai-regulation',
            'https://www.axios.com/2026/10/08/trump-ai-super-intelligence-white-house',
        ],
    },
    // 2024-06: Situational Awareness, national security and securing AI secrets.
    {
        id: 'leopold-aschenbrenner',
        campIds: ['securitists'],
        sources: ['https://situational-awareness.ai/'],
    },
    // 2025-03; caveat: deterrence rather than an unchecked race.
    {
        id: 'eric-schmidt',
        campIds: ['securitists'],
        sources: ['https://arxiv.org/abs/2503.05628'],
    },
    // 2025-01-29 export controls; 2023 AI-risk statement. Caveat: spans both camps.
    {
        id: 'dario-amodei',
        campIds: ['securitists', 'safetyCamp'],
        sources: [
            'https://www.404media.co/anthropic-ceo-says-limiting-chinas-access-to-ai-chips-is-existentially-important/',
            'https://www.safe.ai/work/statement-on-ai-risk',
        ],
    },
    // 2023 AI-risk statement; caveat: distinguishes open code from open weights.
    {
        id: 'geoffrey-hinton',
        campIds: ['safetyCamp'],
        sources: [
            'https://www.safe.ai/work/statement-on-ai-risk',
            'https://officechai.com/ai/releasing-foundational-model-weights-is-like-making-nuclear-material-freely-available-geoffrey-hinton/',
        ],
    },
    // 2023: signatory of the CAIS AI-risk statement.
    {
        id: 'yoshua-bengio',
        campIds: ['safetyCamp'],
        sources: ['https://www.safe.ai/work/statement-on-ai-risk'],
    },
    // 2025-04-03: co-author of AI 2027.
    {
        id: 'daniel-kokotajlo',
        campIds: ['safetyCamp'],
        sources: ['https://ai-2027.com/'],
    },
    // 2023: signatory of the CAIS AI-risk statement.
    {
        id: 'stuart-russell',
        campIds: ['safetyCamp'],
        sources: ['https://www.safe.ai/work/statement-on-ai-risk'],
    },
    // 2025-09-16: co-author of If Anyone Builds It, Everyone Dies.
    {
        id: 'eliezer-yudkowsky',
        campIds: ['pauseCamp'],
        sources: ['https://ifanyonebuildsit.com/'],
    },
    // 2025-09-16: co-author of If Anyone Builds It, Everyone Dies.
    {
        id: 'nate-soares',
        campIds: ['pauseCamp'],
        sources: ['https://ifanyonebuildsit.com/'],
    },
    // 2025-10: prohibition until safety and public buy-in.
    {
        id: 'max-tegmark',
        campIds: ['pauseCamp'],
        sources: [
            'https://superintelligence-statement.org/',
            'https://cyberscoop.com/ai-superintelligence-ban-open-letter-future-of-life-harry-meghan-tech-leaders/',
        ],
    },
    // 2026-09 overview; 2023 AI-risk statement. Caveat: safety commitments alongside development.
    {
        id: 'sam-altman',
        campIds: ['cautiousBuilders'],
        sources: [
            'https://www.euronews.com/next/2026/09/15/doomers-vs-boosters-whos-who-in-the-global-fight-over-the-risks-of-ai',
            'https://www.safe.ai/work/statement-on-ai-risk',
        ],
    },
    // 2023-05-23: supports AI regulation; caveat: older statement.
    {
        id: 'sundar-pichai',
        campIds: ['cautiousBuilders'],
        sources: [
            'https://www.cityam.com/google-boss-sundar-pichai-warns-ai-is-too-important-not-to-regulate/',
        ],
    },
    // 2020-01-23: AI ethics and cooperation; caveat: older statement.
    {
        id: 'satya-nadella',
        campIds: ['cautiousBuilders'],
        sources: [
            'https://www.cnbc.com/2020/01/23/microsoft-ceo-at-davos-china-cares-as-deeply-about-ai-ethics-as-us.html',
        ],
    },
    // 2025-01-05: defensive technology and distributed power, with caution about superintelligence.
    {
        id: 'vitalik-buterin',
        campIds: ['guardedOptimists'],
        sources: ['https://vitalik.eth.limo/general/2025/01/05/dacc2.html'],
    },
    // 2026-07-23: favors lab peer review; caveat: signed the pause letter in 2023.
    {
        id: 'elon-musk',
        campIds: ['guardedOptimists'],
        sources: [
            'https://fortune.com/article/elon-musk-says-rival-ai-labs-should-peer-review-frontier-models-before-release-with-government-as-last-resort/',
        ],
    },
    // 2025-01-26; caveat: close to accelerationists.
    {
        id: 'reid-hoffman',
        campIds: ['guardedOptimists'],
        sources: [
            'https://techcrunch.com/2025/01/26/why-reid-hoffman-feels-optimistic-about-our-ai-future',
        ],
    },
    // 2021: co-author of Stochastic Parrots on present harms.
    {
        id: 'timnit-gebru',
        campIds: ['ethicsCamp'],
        sources: ['https://dl.acm.org/doi/10.1145/3442188.3445922'],
    },
    // 2021 Stochastic Parrots; 2025 The AI Con on hype and present harms.
    {
        id: 'emily-bender',
        campIds: ['ethicsCamp'],
        sources: [
            'https://dl.acm.org/doi/10.1145/3442188.3445922',
            'https://www.penguin.co.uk/books/468070/the-ai-con-by-hanna-emily-m-bender-and-alex/9781847928610',
        ],
    },
    // 2023: Unmasking AI on discrimination and surveillance. Caveat: spans both camps.
    {
        id: 'joy-buolamwini',
        campIds: ['ethicsCamp', 'surveillanceCritics'],
        sources: [
            'https://www.penguinrandomhouse.com/books/670356/unmasking-ai-by-joy-buolamwini/',
        ],
    },
    // 2025-04-15: co-author of AI as Normal Technology.
    {
        id: 'arvind-narayanan',
        campIds: ['normalTechnologyCamp'],
        sources: ['https://knightcolumbia.org/content/ai-as-normal-technology'],
    },
    // 2025-04-15: co-author of AI as Normal Technology.
    {
        id: 'sayash-kapoor',
        campIds: ['normalTechnologyCamp'],
        sources: ['https://knightcolumbia.org/content/ai-as-normal-technology'],
    },
    // 2026-09-26: normal-technology example in the NPR overview.
    {
        id: 'fei-fei-li',
        campIds: ['normalTechnologyCamp'],
        sources: [
            'https://www.kunc.org/npr-news/2026-09-26/the-ai-safety-debate-is-confusing-heres-our-guide-to-the-different-factions',
        ],
    },
    // 2024: Taming Silicon Valley; skepticism and calls for regulation.
    {
        id: 'gary-marcus',
        campIds: ['hypeSkeptics'],
        sources: [
            'https://mitpress.mit.edu/9780262551069/taming-silicon-valley/',
        ],
    },
    // 2025-07-21: The Hater's Guide to the AI Bubble.
    {
        id: 'ed-zitron',
        campIds: ['hypeSkeptics'],
        sources: ['https://www.wheresyoured.at/the-haters-gui/'],
    },
    // 2025: co-author of The AI Con.
    {
        id: 'alex-hanna',
        campIds: ['hypeSkeptics'],
        sources: [
            'https://www.penguin.co.uk/books/468070/the-ai-con-by-hanna-emily-m-bender-and-alex/9781847928610',
        ],
    },
    // 2026-09-26: jobs and opposition to China; differs from Sanders on cooperation.
    {
        id: 'steve-bannon',
        campIds: ['populists'],
        sources: [
            'https://www.kunc.org/npr-news/2026-09-26/the-ai-safety-debate-is-confusing-heres-our-guide-to-the-different-factions',
        ],
    },
    // 2026-09-26: populist example in the NPR overview.
    {
        id: 'tucker-carlson',
        campIds: ['populists'],
        sources: [
            'https://www.kunc.org/npr-news/2026-09-26/the-ai-safety-debate-is-confusing-heres-our-guide-to-the-different-factions',
        ],
    },
    // 2026-09-26: pause, ban and cooperation with China. Caveat: spans both camps.
    {
        id: 'bernie-sanders',
        campIds: ['populists', 'pauseCamp'],
        sources: [
            'https://www.kunc.org/npr-news/2026-09-26/the-ai-safety-debate-is-confusing-heres-our-guide-to-the-different-factions',
        ],
    },
    // 2024-10: training-statement organizer; demand concerns unlicensed training.
    {
        id: 'ed-newton-rex',
        campIds: ['creativesCopyright'],
        sources: [
            'https://www.aitrainingstatement.org/',
            'https://www.techradar.com/computing/artificial-intelligence/kevin-bacon-julianne-moore-thom-yorke-and-10k-creators-sign-warning-against-ai-use-of-their-work',
        ],
    },
    // 2024-10: signatory opposing unlicensed AI training.
    {
        id: 'kazuo-ishiguro',
        campIds: ['creativesCopyright'],
        sources: ['https://www.aitrainingstatement.org/'],
    },
    // 2024-10: signatory opposing unlicensed AI training.
    {
        id: 'thom-yorke',
        campIds: ['creativesCopyright'],
        sources: ['https://www.aitrainingstatement.org/'],
    },
    // 2024-10: signatory opposing unlicensed AI training.
    {
        id: 'julianne-moore',
        campIds: ['creativesCopyright'],
        sources: ['https://www.aitrainingstatement.org/'],
    },
    // 2026-06: criticism of using AI promises to justify layoffs.
    {
        id: 'cory-doctorow',
        campIds: ['laborCritics'],
        sources: [
            'https://jacobin.com/2026/06/ai-bubble-layoffs-workers-copyright',
        ],
    },
    // 2023-09-26: Blood in the Machine on technology and labor power.
    {
        id: 'brian-merchant',
        campIds: ['laborCritics'],
        sources: [
            'https://www.hbglibrary.com/titles/brian-merchant/blood-in-the-machine/9780316487740/',
        ],
    },
    // 2024-12-06: automation, productivity uncertainty and effects on workers.
    {
        id: 'daron-acemoglu',
        campIds: ['laborCritics'],
        sources: [
            'https://economics.mit.edu/news/daron-acemoglu-what-do-we-know-about-economics-ai',
        ],
    },
    // 2025-03-07: privacy and security concerns about agentic AI.
    {
        id: 'meredith-whittaker',
        campIds: ['surveillanceCritics'],
        sources: [
            'https://techcrunch.com/2025/03/07/signal-president-meredith-whittaker-calls-out-agentic-ai-as-having-profound-security-and-privacy-issues',
        ],
    },
    // 2024-06; caveat: also dismisses exaggerated AI-safety panic.
    {
        id: 'edward-snowden',
        campIds: ['surveillanceCritics'],
        sources: [
            'https://the-decoder.com/edward-snowden-warns-against-chatgpt-and-openai-after-former-nsa-director-joins-board/',
        ],
    },
    // 2025-10-22; caveat for all four signatories: moderate capability expectations unproven.
    {
        id: 'prince-harry',
        campIds: ['existentialWorriers'],
        sources: [
            'https://cyberscoop.com/ai-superintelligence-ban-open-letter-future-of-life-harry-meghan-tech-leaders/',
        ],
    },
    // 2025-10-22: superintelligence-ban signatory; see capability caveat above.
    {
        id: 'meghan-markle',
        campIds: ['existentialWorriers'],
        sources: [
            'https://cyberscoop.com/ai-superintelligence-ban-open-letter-future-of-life-harry-meghan-tech-leaders/',
        ],
    },
    // 2025-10-22: superintelligence-ban signatory; see capability caveat above.
    {
        id: 'steve-wozniak',
        campIds: ['existentialWorriers'],
        sources: [
            'https://cyberscoop.com/ai-superintelligence-ban-open-letter-future-of-life-harry-meghan-tech-leaders/',
        ],
    },
    // 2025-10-22: superintelligence-ban signatory; see capability caveat above.
    {
        id: 'richard-branson',
        campIds: ['existentialWorriers'],
        sources: [
            'https://cyberscoop.com/ai-superintelligence-ban-open-letter-future-of-life-harry-meghan-tech-leaders/',
        ],
    },
] as const satisfies PeopleDefinition<CoreCampId>[];

// No named examples were supplied for the other developer camps.
export const devPeople = [
    // 2025-02; caveat: describes casual projects, not a blanket production recommendation.
    {
        id: 'andrej-karpathy',
        campIds: ['vibeCoders'],
        sources: [
            'https://x.com/karpathy/status/1886192184808149383',
            'https://en.wikipedia.org/wiki/Vibe_coding',
        ],
    },
] as const satisfies PeopleDefinition<DevCampId>[];

export type ModeledPeopleDefinition = PeopleDefinition & {
    readonly modelId: ModelId;
};
export const people = [
    ...corePeople.map(
        (person) =>
            ({
                ...person,
                modelId: 'core',
            }) satisfies ModeledPeopleDefinition,
    ),
    ...devPeople.map(
        (person) =>
            ({
                ...person,
                modelId: 'dev',
            }) satisfies ModeledPeopleDefinition,
    ),
] as const satisfies ModeledPeopleDefinition[];

export type CorePersonId = (typeof corePeople)[number]['id'];
export type DevPersonId = (typeof devPeople)[number]['id'];
export type PersonId = (typeof people)[number]['id'];

export type Setting = {
    campMatchThreshold?: number; // Minimum similarity for a close match
    axesThreshold?: number; // Minimum number of axes defined by a camp
    axesMatchThreshold?: number; // How many axes both user and camp must have defined in common to pass
    wildcardOffset?: number; // Pull similarity down if camp doesn't have the position user has a position on; Otherwise, camps with few defined axis positions will get prioritized
};

const v1Settings: Setting & Record<ModelId, Setting> = {
    campMatchThreshold: 70,
    wildcardOffset: 20,
    core: {
        axesThreshold: 4,
        axesMatchThreshold: 3,
    },
    dev: {
        axesThreshold: 2,
        axesMatchThreshold: 2,
    },
} as const;

export const settings = v1Settings;

export const resultV1Scoring = {
    coreAxes: v1CoreAxes,
    devAxes: v1DevAxes,
    axisConstruct: v1AxisConstruct,
    coreCamps: v1CoreCamps,
    devCamps: v1DevCamps,
    settings: v1Settings,
} as const;

/* --- VERSION --- */
export const questionnaireVersion: number = 2;

/* --- CONFIG --- */
export const scoringConfig = {
    axes,
    questions,
    camps,
    people,
    suggestions,
    settings,
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
    const secondsMultiplier = 30; // Estimation on how many seconds it takes a user to complete one question.
    return Math.floor((getQuestionCount(type) * secondsMultiplier) / 60);
}

// Find the right setting for the model type
export function getSetting(
    keys: (keyof Setting)[], // array of setting keys
    modelId?: ModelId,
): Partial<Setting> {
    const result: Partial<Setting> = {};

    for (const key of keys) {
        result[key] =
            settings[key] ?? (modelId ? settings[modelId][key] : undefined);
    }

    return result;
}
