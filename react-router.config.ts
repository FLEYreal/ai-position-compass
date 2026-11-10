import type { Config } from '@react-router/dev/config';
import { cp, writeFile } from 'node:fs/promises';
import { siteIconLinks } from './src/app/config/site-icons';
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
        if (baseDirectory) {
            await cp(
                `${reactRouterConfig.buildDirectory}/client/${baseDirectory}`,
                `${reactRouterConfig.buildDirectory}/client`,
                { recursive: true },
            );
        }
        const home = `${base.replace(/\/$/, '')}/en/`;
        const icons = siteIconLinks(`${base.replace(/\/$/, '')}/`)
            .map(
                (link) =>
                    `<link ${Object.entries(link)
                        .map(([key, value]) => `${key}="${value}"`)
                        .join(' ')}>`,
            )
            .join('');
        const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${icons}<title>${notFoundMessages['notFound.code']}</title></head><body><main><h1>${notFoundMessages['notFound.code']}</h1><a href="${home}">${commonMessages['recovery.home']}</a></main></body></html>`;
        await writeFile(
            `${reactRouterConfig.buildDirectory}/client/404.html`,
            html,
        );
    },
} satisfies Config;
