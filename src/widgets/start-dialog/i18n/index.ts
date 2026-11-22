import type { Language } from '@/shared/config';

export type StartMessages = typeof import('./en').default;

export async function loadStartMessages(
    language: Language,
): Promise<StartMessages> {
    return (language === 'ru' ? await import('./ru') : await import('./en'))
        .default;
}
