import { useSyncExternalStore } from 'react';

const storageKey = 'ai-position-compass:collage-paused';
const listeners = new Set<() => void>();
let inMemoryPause: boolean | undefined;

function readPausePreference() {
    if (inMemoryPause !== undefined) return inMemoryPause;
    try {
        inMemoryPause = window.localStorage.getItem(storageKey) === 'true';
    } catch {
        inMemoryPause = false;
    }
    return inMemoryPause;
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function toggleCollagePause() {
    inMemoryPause = !readPausePreference();
    try {
        window.localStorage.setItem(storageKey, String(inMemoryPause));
    } catch {
        // The preference still applies on this page.
    }
    listeners.forEach((listener) => listener());
}

export function useCollagePaused() {
    return useSyncExternalStore(subscribe, readPausePreference, () => false);
}
