import { useSyncExternalStore } from 'react';
import {
    getServerThemeSnapshot,
    getThemeSnapshot,
    setTheme,
    subscribeTheme,
    toggleTheme,
} from './theme';

export function useTheme() {
    const snapshot = useSyncExternalStore(
        subscribeTheme,
        getThemeSnapshot,
        getServerThemeSnapshot,
    );
    return { ...snapshot, setTheme, toggleTheme };
}
