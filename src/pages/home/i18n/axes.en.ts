import type { AxisId } from '@/shared/config';

export const axesCopy = {
    heading: 'What shapes your AI position?',
    introduction:
        'Each axis captures one part of your view on AI. Values show what you think should happen, and beliefs show what you expect to happen. Three axes come from the optional developer module.',
    module: {
        core: 'Core axis',
        dev: 'Developer axis',
    },
    construct: {
        value: 'Value',
        belief: 'Belief',
    },
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
