export type Language = 'en' | 'ru';

export function isLanguage(value: string | undefined): value is Language {
    return value === 'en' || value === 'ru';
}
