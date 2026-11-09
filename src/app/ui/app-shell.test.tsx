import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, test } from 'vitest';
import { AppShell } from './app-shell';

describe('application shell', () => {
    test('owns one main landmark and links the skip control to it', () => {
        render(
            <MemoryRouter initialEntries={['/en/']}>
                <AppShell>
                    <h1>Page content</h1>
                </AppShell>
            </MemoryRouter>,
        );
        expect(screen.getAllByRole('main')).toHaveLength(1);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Skip to content' }),
        ).toHaveAttribute('href', '#main');
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    });

    test('preserves result data and fragment when changing language under a project basename', () => {
        render(
            <MemoryRouter
                basename="/ai-position-compass"
                initialEntries={[
                    '/ai-position-compass/ru/result?r=payload#axes',
                ]}
            >
                <AppShell>Result</AppShell>
            </MemoryRouter>,
        );
        const english = screen.getByRole('link', { name: 'EN' });
        expect(english).toHaveAttribute(
            'href',
            '/ai-position-compass/en/result?r=payload#axes',
        );
        fireEvent.click(english);
        expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
            'aria-current',
            'true',
        );
        expect(
            screen.getByRole('link', { name: 'AI Position Compass — home' }),
        ).toHaveAttribute('href', '/ai-position-compass/en/');
    });

    test('theme selection remains active when the language changes', () => {
        localStorage.clear();
        render(
            <MemoryRouter initialEntries={['/en/test']}>
                <AppShell>Question</AppShell>
            </MemoryRouter>,
        );
        fireEvent.click(
            screen.getByRole('button', { name: 'Switch to dark theme' }),
        );
        expect(document.documentElement.dataset.theme).toBe('dark');
        fireEvent.click(screen.getByRole('link', { name: 'RU' }));
        expect(
            screen.getByRole('button', { name: 'Включить светлую тему' }),
        ).toBeInTheDocument();
        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});
