import { fireEvent, render, screen } from '@testing-library/react';
import {
    createMemoryRouter,
    Outlet,
    RouterProvider,
    useLoaderData,
    type LoaderFunctionArgs,
} from 'react-router';
import type { ReactNode } from 'react';
import { languageFromPathname } from '@/shared/config';
import { loadMessages, shouldReloadMessages } from '../i18n';
import { describe, expect, test } from 'vitest';
import { AppShell } from './app-shell';

async function shellLoader({ request }: LoaderFunctionArgs) {
    const language = languageFromPathname(
        new URL(request.url).pathname,
        '/ai-position-compass',
    );
    return { language, messages: await loadMessages(language) };
}
function TestShell() {
    const data = useLoaderData<typeof shellLoader>();
    return (
        <AppShell {...data}>
            <Outlet />
        </AppShell>
    );
}
function renderShell(path: string, content: ReactNode, basename = '/') {
    return render(
        <RouterProvider
            router={createMemoryRouter(
                [
                    {
                        element: <TestShell />,
                        loader: shellLoader,
                        shouldRevalidate: shouldReloadMessages,
                        children: [{ path: '*', element: content }],
                    },
                ],
                { initialEntries: [path], basename },
            )}
        />,
    );
}

describe('application shell', () => {
    test('owns one main landmark and links the skip control to it', async () => {
        renderShell('/en/', <h1>Page content</h1>);
        await screen.findByRole('banner');
        expect(screen.getAllByRole('main')).toHaveLength(1);
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Skip to main content' }),
        ).toHaveAttribute('href', '#main');
        expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    });

    test('preserves result data and fragment when changing language under a project basename', async () => {
        renderShell(
            '/ai-position-compass/ru/result?r=payload#axes',
            'Result',
            '/ai-position-compass',
        );
        await screen.findByRole('banner');
        const english = screen.getByRole('link', { name: 'EN' });
        expect(english).toHaveAttribute(
            'href',
            '/ai-position-compass/en/result/?r=payload#axes',
        );
        fireEvent.click(english);
        await screen.findByRole('group', { name: 'Language' });
        expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
            'aria-current',
            'true',
        );
        expect(
            screen.getByRole('link', { name: 'AI Position Compass' }),
        ).toHaveAttribute('href', '/ai-position-compass/en/');
    });

    test('theme selection remains active when the language changes', async () => {
        localStorage.clear();
        renderShell('/en/test', 'Question');
        await screen.findByRole('banner');
        fireEvent.click(
            screen.getByRole('button', { name: 'Switch to dark theme' }),
        );
        expect(document.documentElement.dataset.theme).toBe('dark');
        fireEvent.click(screen.getByRole('link', { name: 'RU' }));
        expect(
            await screen.findByRole('button', {
                name: 'Переключить на светлую тему',
            }),
        ).toBeInTheDocument();
        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});
