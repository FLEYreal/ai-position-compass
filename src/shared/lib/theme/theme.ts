export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';
export const themeStorageKey = 'ai-position-compass:theme';

// Self-contained so the same initializer can run in the document head before paint.
function initializeTheme(storageKey: string) {
    let preference: ThemePreference = 'system';
    try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === 'light' || saved === 'dark') preference = saved;
    } catch {
        // Appearance still works when browser storage is unavailable.
    }
    const resolvedTheme: ResolvedTheme =
        preference === 'system' ?
            window.matchMedia('(prefers-color-scheme: dark)').matches ?
                'dark'
            :   'light'
        :   preference;
    document.documentElement.dataset.theme = resolvedTheme;
    return { preference, resolvedTheme };
}

export const themeBootstrapScript = `(${initializeTheme.toString()})(${JSON.stringify(themeStorageKey)})`;

type ThemeSnapshot = {
    preference: ThemePreference;
    resolvedTheme: ResolvedTheme;
};
const serverSnapshot: ThemeSnapshot = {
    preference: 'system',
    resolvedTheme: 'light',
};
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();

function publish(preference: ThemePreference, resolvedTheme: ResolvedTheme) {
    document.documentElement.dataset.theme = resolvedTheme;
    if (
        snapshot.preference === preference &&
        snapshot.resolvedTheme === resolvedTheme
    )
        return;
    snapshot = { preference, resolvedTheme };
    listeners.forEach((listener) => listener());
}

export function setTheme(preference: ThemePreference) {
    if (typeof window === 'undefined') return;
    const resolved =
        preference === 'system' ?
            window.matchMedia('(prefers-color-scheme: dark)').matches ?
                'dark'
            :   'light'
        :   preference;
    publish(preference, resolved);
    try {
        window.localStorage.setItem(themeStorageKey, preference);
    } catch {
        // Keep the user's choice in memory when persistence fails.
    }
}

export function toggleTheme() {
    setTheme(snapshot.resolvedTheme === 'dark' ? 'light' : 'dark');
}

export function subscribeTheme(listener: () => void) {
    if (listeners.size === 0) {
        const initial = initializeTheme(themeStorageKey);
        snapshot = initial;
    }
    listeners.add(listener);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => {
        if (snapshot.preference === 'system')
            publish('system', media.matches ? 'dark' : 'light');
    };
    const onStorage = (event: StorageEvent) => {
        if (event.key !== themeStorageKey && event.key !== null) return;
        try {
            if (event.storageArea && event.storageArea !== window.localStorage)
                return;
        } catch {
            return;
        }
        const next = initializeTheme(themeStorageKey);
        publish(next.preference, next.resolvedTheme);
    };
    // Only one browser subscription is needed, even with multiple hook consumers.
    if (listeners.size === 1) {
        media.addEventListener('change', onSystemChange);
        window.addEventListener('storage', onStorage);
        disconnect = () => {
            media.removeEventListener('change', onSystemChange);
            window.removeEventListener('storage', onStorage);
        };
    }
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0) disconnect?.();
    };
}
let disconnect: (() => void) | undefined;

export const getThemeSnapshot = () => snapshot;
export const getServerThemeSnapshot = () => serverSnapshot;
