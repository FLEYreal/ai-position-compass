import type { AxisId } from '@/shared/config';

export default {
    axisDescriptions: {
        regulation: 'How much oversight should AI development and use have?',
        control:
            'Who should make decisions about AI: companies or public institutions?',
        geopolitics:
            'Should countries compete to develop AI or coordinate their efforts?',
        openness:
            'Should powerful models be released openly or under controlled access?',
        capability:
            'How transformative will AI become over the next 10–20 years?',
        existentialRisk:
            'How likely is a catastrophe on the scale of human extinction?',
        ecology: 'How serious will the environmental costs of AI be?',
        creativity: 'How much will AI harm creative work?',
        labor: 'How much will AI harm jobs, wages, and working conditions?',
        surveillance: 'How much will AI be used to watch and control people?',
        openSourcePreference:
            'Would you work with closed APIs or models you can inspect and run yourself?',
        aiDelegation: 'How much of your coding would you hand over to AI?',
        displacementRisk: 'How likely is AI to replace developers?',
    } satisfies Record<AxisId, string>,
    'artwork.caption': 'FIG. A / ARCHIVAL STUDY',
    'artwork.description':
        'Archival collage of technology, institutions, and public life.',
    'artwork.pause': 'Pause',
    'artwork.play': 'Resume',
    'artwork.punchcard': 'Punched card',
    'recovery.home': 'Back to Home',
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.source': 'Source',
    'common.sources': 'Sources',
    'home.abstract.body':
        'An exploratory questionnaire about artificial intelligence. Map what you expect to happen and what you think should happen — across a spectrum of beliefs and values.',
    'test.privacy': 'Your answers stay in this browser.',
    'test.restart': 'Restart questionnaire',
    'session.restart.heading': 'Start again?',
    'session.restart.description':
        'Any saved answers in this browser will be deleted. You’ll choose which questions to include in the new questionnaire.',
    'session.restart.confirm': 'Delete answers and restart',
    'storage.resetFailed':
        'Saved progress could not be cleared. Check your browser’s storage settings and try again.',
};
