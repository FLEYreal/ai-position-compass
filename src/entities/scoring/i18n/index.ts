import type { Language } from '@/shared/config';

export type QuestionnaireMessages = typeof import('./en').default;

export async function loadQuestionnaireMessages(
    language: Language,
): Promise<QuestionnaireMessages> {
    return (language === 'ru' ? await import('./ru') : await import('./en'))
        .default;
}
