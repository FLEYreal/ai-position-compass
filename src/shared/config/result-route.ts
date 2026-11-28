import type { Language } from './language';

export function resultPath(language: Language): string {
    // GitHub Pages redirects directory URLs to the trailing-slash form.
    return `/${language}/result/`;
}

export function resultRoute(language: Language, payload: string): string {
    return `${resultPath(language)}?${new URLSearchParams({ r: payload })}`;
}
