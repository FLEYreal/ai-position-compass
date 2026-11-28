import { act, renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useTheme, themeBootstrapScript } from './index';
import { themeStorageKey } from './theme';

describe('theme preference', () => {
    let media: EventTarget & { matches: boolean; media: string };
    beforeEach(() => {
        localStorage.clear();
        media = Object.assign(new EventTarget(), {
            matches: true,
            media: '(prefers-color-scheme: dark)',
        });
        vi.spyOn(window, 'matchMedia').mockImplementation(
            () => media as MediaQueryList,
        );
        delete document.documentElement.dataset.theme;
    });
    afterEach(() => vi.restoreAllMocks());

    test('follows the device until explicitly selected, and can return to system mode', () => {
        const { result } = renderHook(useTheme);
        expect(result.current.preference).toBe('system');
        expect(result.current.resolvedTheme).toBe('dark');
        act(() => result.current.toggleTheme());
        expect(result.current.preference).toBe('light');
        expect(localStorage.getItem(themeStorageKey)).toBe('light');
        act(() => {
            media.matches = false;
            media.dispatchEvent(new Event('change'));
        });
        expect(result.current.resolvedTheme).toBe('light');
        act(() => result.current.setTheme('system'));
        act(() => {
            media.matches = true;
            media.dispatchEvent(new Event('change'));
        });
        expect(result.current.resolvedTheme).toBe('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
    });

    test('restores the preference and synchronizes mounted consumers across tabs', () => {
        localStorage.setItem(themeStorageKey, 'light');
        const first = renderHook(useTheme);
        const second = renderHook(useTheme);
        expect(first.result.current.resolvedTheme).toBe('light');
        act(() => {
            localStorage.setItem(themeStorageKey, 'dark');
            window.dispatchEvent(
                new StorageEvent('storage', {
                    key: themeStorageKey,
                    newValue: 'dark',
                    storageArea: localStorage,
                }),
            );
        });
        expect(first.result.current.resolvedTheme).toBe('dark');
        expect(second.result.current.resolvedTheme).toBe('dark');
        first.unmount();
        act(() => {
            localStorage.clear();
            window.dispatchEvent(new StorageEvent('storage', { key: null }));
        });
        expect(second.result.current.preference).toBe('system');
    });

    test('ignores invalid saved values and works when storage is blocked', () => {
        localStorage.setItem(themeStorageKey, 'invalid');
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('blocked');
        });
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('blocked');
        });
        const { result } = renderHook(useTheme);
        expect(result.current.preference).toBe('system');
        act(() => result.current.setTheme('light'));
        expect(result.current.resolvedTheme).toBe('light');
        expect(document.documentElement.dataset.theme).toBe('light');
    });

    test('head initializer applies saved theme without React', () => {
        localStorage.setItem(themeStorageKey, 'light');
        // Execute the exact emitted source, not a substitute implementation.
        new Function(themeBootstrapScript)();
        expect(document.documentElement.dataset.theme).toBe('light');
    });

    test('prerender snapshot is stable independently of browser preference', () => {
        function Probe() {
            const theme = useTheme();
            return (
                <span>
                    {theme.preference}:{theme.resolvedTheme}
                </span>
            );
        }
        expect(renderToString(<Probe />)).toContain(
            'system<!-- -->:<!-- -->light',
        );
    });
});
