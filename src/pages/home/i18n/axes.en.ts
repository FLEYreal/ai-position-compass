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
        regulation: 'Regulation',
        control: 'Control',
        geopolitics: 'Geopolitics',
        openness: 'Openness',
        capability: 'Capability',
        existentialRisk: 'Existential risk',
        ecology: 'Ecology',
        creativity: 'Creativity',
        labor: 'Labor',
        surveillance: 'Surveillance',
        openSourcePreference: 'Open-source preference',
        aiDelegation: 'AI delegation',
        displacementRisk: 'Displacement risk',
    } satisfies Record<AxisId, string>,
};
