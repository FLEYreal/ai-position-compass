import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, test } from 'vitest';
import Home from './home';
import ResultRoute from './result';
import TestRoute from './test';
import RedirectToEnglish from './redirect';

const routes = [
    { path: '/:lang', element: <Home /> },
    { path: '/:lang/test', element: <TestRoute /> },
    { path: '/:lang/result', element: <ResultRoute /> },
    { path: '/test', element: <RedirectToEnglish /> },
    { path: '/result', element: <RedirectToEnglish /> },
];

describe('language routes', () => {
    test.each([
        ['/en', 'AI Position Compass — EN'],
        ['/ru', 'AI Position Compass — RU'],
        ['/en/test', 'Test — EN'],
        ['/ru/test', 'Test — RU'],
        ['/en/result', 'Result — EN'],
        ['/ru/result', 'Result — RU'],
        ['/fr', '404 — Page not found'],
    ])('%s renders the expected page', (path, title) => {
        render(
            <RouterProvider
                router={createMemoryRouter(routes, { initialEntries: [path] })}
            />,
        );
        expect(
            screen.getByRole('heading', { name: title }),
        ).toBeInTheDocument();
    });
    test('bare result redirects to English and preserves the query', async () => {
        const router = createMemoryRouter(routes, {
            initialEntries: ['/result?r=example'],
        });
        render(<RouterProvider router={router} />);
        await screen.findByRole('heading', { name: 'Result — EN' });
        expect(router.state.location.search).toBe('?r=example');
    });
});
