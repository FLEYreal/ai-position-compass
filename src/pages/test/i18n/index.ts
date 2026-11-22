import {
    loadQuestionnaireMessages,
    type QuestionnaireMessages,
} from '@/entities/scoring';
import type { Language } from '@/shared/config';

export type Messages = typeof import('./en').default & QuestionnaireMessages;

export async function loadMessages(language: Language): Promise<Messages> {
    const [interfaceCopy, questionnaire] = await Promise.all([
        language === 'ru' ? import('./ru') : import('./en'),
        loadQuestionnaireMessages(language),
    ]);
    return { ...interfaceCopy.default, ...questionnaire };
}
