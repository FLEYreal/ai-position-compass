import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, test } from 'vitest';
import { TooltipProvider } from '@/shared/ui';
import Home, { loader as homeLoader } from './home';
import ResultRoute, { loader as resultLoader } from './result';
import TestRoute, { loader as testLoader } from './test';
import NotFoundRoute, { clientLoader as notFoundLoader } from './not-found';
import RedirectToEnglish from './redirect';

const routes = [
    { path: '/:lang', element: <Home />, loader: homeLoader },
    { path: '/:lang/test', element: <TestRoute />, loader: testLoader },
    { path: '/:lang/result', element: <ResultRoute />, loader: resultLoader },
    { path: '*', element: <NotFoundRoute />, loader: notFoundLoader },
    { path: '/test', element: <RedirectToEnglish /> },
    { path: '/result', element: <RedirectToEnglish /> },
];

describe('language routes', () => {
    test.each([
        ['/en', 'A new world. Where do you stand?'],
        ['/ru', 'Новый мир. Где в нём ваше место?'],
        ['/en/test', 'Your position, one question at a time.'],
        ['/ru/test', 'Ваша позиция, вопрос за вопросом.'],
        ['/en/result', 'Your AI position'],
        ['/ru/result', 'Ваша позиция по ИИ'],
        ['/ru/unknown', 'Неизведанная территория.'],
        ['/fr', 'Unmapped territory.'],
    ])('%s renders the expected page', async (path, title) => {
        render(
            <RouterProvider
                router={createMemoryRouter(routes, { initialEntries: [path] })}
            />,
        );
        expect(
            await screen.findByRole('heading', { name: title }),
        ).toBeInTheDocument();
    });
    test('bare result redirects to English and preserves the query', async () => {
        const router = createMemoryRouter(routes, {
            initialEntries: ['/result?r=example'],
        });
        render(<RouterProvider router={router} />);
        await screen.findByRole('heading', { name: 'Your AI position' });
        expect(router.state.location.pathname).toBe('/en/result/');
        expect(router.state.location.search).toBe('?r=example');
    });

    test('renders shared scores independently of damaged saved progress', async () => {
        localStorage.setItem('questionnaire', 'damaged');
        try {
            render(
                <RouterProvider
                    router={createMemoryRouter(routes, {
                        initialEntries: ['/en/result?r=AQEAAQsYITJDU2Nk_yo-'],
                    })}
                />,
                { wrapper: TooltipProvider },
            );
            expect(
                await screen.findByRole('meter', { name: 'Regulation' }),
            ).toHaveAttribute('value', '0');
            expect(
                screen.getByRole('meter', { name: 'Existential risk' }),
            ).toHaveAttribute('value', '50');
            expect(
                screen.getByRole('group', {
                    name: 'Open-source preference: Undefined',
                }),
            ).toHaveTextContent('Undefined');
            expect(localStorage.getItem('questionnaire')).toBe('damaged');
        } finally {
            localStorage.removeItem('questionnaire');
        }
    });

    test.each([
        ['', 'No result in this link'],
        ['?r=', 'This result link could not be read.'],
        [
            '?r=AQEAAQsYITJDU2Nk_yo-&r=AQEAAQsYITJDU2Nk_yo-',
            'This result link could not be read.',
        ],
        ['?r=AgEAAQsYITJDU2Nk_yo-', 'This result version is not supported.'],
    ])('shows recovery for /en/result%s', async (search, explanation) => {
        render(
            <RouterProvider
                router={createMemoryRouter(routes, {
                    initialEntries: [`/en/result${search}`],
                })}
            />,
        );
        expect(
            await screen.findByRole('heading', { name: explanation }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('link', { name: 'Take the questionnaire' }),
        ).toHaveAttribute('href', '/en/test');
    });
});
