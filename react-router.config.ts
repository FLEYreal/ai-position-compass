import type { Config } from '@react-router/dev/config';
import { cp, readFile, writeFile } from 'node:fs/promises';
import notFoundMessages from './src/pages/not-found/i18n/en';
import commonMessages from './src/shared/i18n/en';

const base = process.env.PUBLIC_BASE_PATH || '/';

export default {
    appDirectory: 'app',
    basename: base,
    ssr: false,
    prerender: [
        '/',
        '/test',
        '/result',
        '/en',
        '/en/test',
        '/en/result',
        '/ru',
        '/ru/test',
        '/ru/result',
    ],
    buildEnd: async ({ reactRouterConfig }) => {
        const baseDirectory = base.replace(/^\/+|\/+$/g, '');
        const output = `${reactRouterConfig.buildDirectory}/client`;
        const fallbackFile =
            baseDirectory ? 'index.html' : '__spa-fallback.html';
        // Read the SPA shell before copying the prerendered base directory.
        const fallback = await readFile(`${output}/${fallbackFile}`, 'utf8');
        if (baseDirectory) {
            await cp(`${output}/${baseDirectory}`, output, { recursive: true });
        }
        const home = `${base.replace(/\/$/, '')}/en/`;
        const recovery = `<noscript><main><h1>${notFoundMessages['notFound.code']}</h1><p>${notFoundMessages['notFound.body']}</p><a href="${home}">${commonMessages['recovery.home']}</a></main></noscript>`;

        // GitHub Pages serves 404.html at the requested URL, letting the
        // router choose the matching language and render the recovery page.
        await writeFile(
            `${output}/404.html`,
            fallback.replace('</body>', `${recovery}</body>`),
        );
    },
} satisfies Config;
