export type Language = 'en' | 'ru';

export function isLanguage(value: string | undefined): value is Language {
    return value === 'en' || value === 'ru';
}

/** Request URLs include the deployment base; router locations omit it. */
export function languageFromPathname(pathname: string, base = '/'): Language {
    const prefix = base.replace(/\/$/, '');
    const relative =
        prefix && (pathname === prefix || pathname.startsWith(`${prefix}/`)) ?
            pathname.slice(prefix.length)
        :   pathname;
    return /^\/ru(?:\/|$)/.test(relative) ? 'ru' : 'en';
}
