import { axesCopy } from './axes.en';

export default {
    axes: axesCopy,
    'home.eyebrow': 'AI position test',
    'home.title': 'A new world. Where do you stand?',
    'home.abstract.heading': 'Abstract',
    'home.start': 'Find your position',
    'home.privacy': 'Answers stay with you',
    'session.resume.action': 'Continue questionnaire',
    'session.completed.view': 'View my results',
    'storage.reset': 'Clear saved progress',
    'home.questions.core': '{count} questions',
    'home.duration.estimate': '~{count} min',
    'study.modules.heading': 'Your stack, your call',
    'study.modules.intro':
        'What makes it into your stack? Which tasks would you hand off to AI? Add the developer module when you start to get a separate developer profile.',
    'study.module.core': 'Core questionnaire',
    'study.module.core.count': '{count} questions',
    'study.module.core.body':
        'For everyone. Explore AI’s capabilities, risks, and role in society.',
    'study.module.dev': 'Developer module',
    'study.module.dev.count': '+{count} questions',
    'study.module.dev.body':
        'An optional set about the AI tools you use, how much coding you delegate, and what you expect for developer jobs.',
    'study.camps.heading': 'Where your views overlap',
    'study.camps.intro':
        'Your results show where you stand on each axis with enough answers and may include up to three nearby camps per module. Similarity measures how closely your scores line up with a camp’s positions. These six profiles are examples.',
    'study.camps.core': 'Core camp examples',
    'study.camps.dev': 'Developer camp examples',
    camps: {
        accelerationists: {
            name: 'Accelerationists',
            description:
                'Build fast and win the race. Regulation slows progress; open models are fine; extinction fears are overblown.',
        },
        safetyCamp: {
            name: 'Safety camp',
            description:
                'Advanced AI could cause a catastrophe. Regulate frontier models and cooperate internationally.',
        },
        normalTechnologyCamp: {
            name: 'Normal-technology camp',
            description:
                'AI is powerful but normal, like electricity. Regulate specific uses, not the technology itself.',
        },
        ethicsCamp: {
            name: 'Ethics camp',
            description:
                'Focus on harms happening now: bias, surveillance, exploitation, environmental cost.',
        },
        vibeCoders: {
            name: 'Vibe-coders',
            description:
                'Let the agents write the code; developers will be partly displaced.',
        },
        craftspeople: {
            name: 'Craftspeople',
            description: 'Write it yourself, with open tools you control.',
        },
    },
};
