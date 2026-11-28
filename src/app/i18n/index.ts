import type { Language } from '@/shared/config';

export type Messages = typeof import('./en').default;

export async function loadMessages(language: Language): Promise<Messages> {
    return (language === 'ru' ? await import('./ru') : await import('./en'))
        .default;
}

/** Root layouts otherwise retain their loader data across child navigation. */
export function shouldReloadMessages({
    currentUrl,
    nextUrl,
    defaultShouldRevalidate,
}: import('react-router').ShouldRevalidateFunctionArgs) {
    return currentUrl.pathname !== nextUrl.pathname || defaultShouldRevalidate;
}
