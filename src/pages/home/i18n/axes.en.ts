import type { AxisId } from '@/shared/config';

export const axesCopy = {
    heading: 'What the compass measures',
    introduction:
        'Each axis measures one aspect of your views on AI. Values describe what you think should happen. Beliefs describe what you expect to happen. This lets your result show where you stand on each issue.',
    values: 'Core values',
    beliefs: 'Core beliefs',
    developer: 'Developer axes',
    developerDescription: 'Two values and one belief about software work.',
    axes: {
        regulation: {
            name: 'Regulation',
            description:
                'How much oversight should AI development and use have?',
        },
        control: {
            name: 'Control',
            description:
                'Who should make decisions about AI: companies or public institutions?',
        },
        geopolitics: {
            name: 'Geopolitics',
            description:
                'Should countries compete to develop AI or coordinate their efforts?',
        },
        openness: {
            name: 'Openness',
            description:
                'Should powerful models be released openly or under controlled access?',
        },
        capability: {
            name: 'Capability',
            description:
                'How transformative will AI become over the next 10–20 years?',
        },
        existentialRisk: {
            name: 'Existential risk',
            description:
                'How likely is a catastrophe on the scale of human extinction?',
        },
        ecology: {
            name: 'Ecology',
            description: 'How serious will the environmental costs of AI be?',
        },
        creativity: {
            name: 'Creativity',
            description: 'How much will AI harm creative work?',
        },
        labor: {
            name: 'Labor',
            description:
                'How much will AI harm jobs, wages, and working conditions?',
        },
        surveillance: {
            name: 'Surveillance',
            description:
                'How much will AI be used to watch and control people?',
        },
        openSourcePreference: {
            name: 'Open-source preference',
            description:
                'Would you work with closed APIs or models you can inspect and run yourself?',
        },
        aiDelegation: {
            name: 'AI delegation',
            description: 'How much of your coding would you hand over to AI?',
        },
        displacementRisk: {
            name: 'Displacement risk',
            description: 'How likely is AI to replace developers?',
        },
    } satisfies Record<AxisId, { name: string; description: string }>,
};
