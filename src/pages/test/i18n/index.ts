import type { Language } from '@/shared/config';

export type Messages = typeof import('./en').default;

export async function loadMessages(language: Language): Promise<Messages> {
    return (language === 'ru' ? await import('./ru') : await import('./en'))
        .default;
}
