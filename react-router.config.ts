import type { Config } from '@react-router/dev/config';
import { cp, writeFile } from 'node:fs/promises';

const base = process.env.PUBLIC_BASE_PATH || '/';

export default {
    appDirectory: 'src',
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
        if (baseDirectory) {
            await cp(
                `${reactRouterConfig.buildDirectory}/client/${baseDirectory}`,
                `${reactRouterConfig.buildDirectory}/client`,
                { recursive: true },
            );
        }
        const home = `${base.replace(/\/$/, '')}/en/`;
        const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title></head><body><main><h1>404 — Page not found</h1><p>The requested page could not be found.</p><a href="${home}">Go to Home</a></main></body></html>`;
        await writeFile(
            `${reactRouterConfig.buildDirectory}/client/404.html`,
            html,
        );
    },
} satisfies Config;
