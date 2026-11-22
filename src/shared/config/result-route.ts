import type { Language } from './language';

export function resultRoute(language: Language, payload: string): string {
    return `/${language}/result?${new URLSearchParams({ r: payload })}`;
}
