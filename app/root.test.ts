import { RouterContextProvider } from 'react-router';
import { expect, test } from 'vitest';
import { loader } from './root';

test('loads the Russian Home shell for a prerender data request', async () => {
    const args = {
        request: new Request('https://example.test/ru.data'),
        url: new URL('https://example.test/ru'),
        pattern: '/:lang',
        params: { lang: 'ru' },
        context: new RouterContextProvider(),
    };

    await expect(loader(args)).resolves.toMatchObject({ language: 'ru' });
});
