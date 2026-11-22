import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';

// Vite preview falls back to the SPA shell for extensionless directory URLs.
const previewPrerenderedRoutes: Plugin = {
    name: 'preview-prerendered-routes',
    configurePreviewServer(server) {
        const { base, root } = server.config;
        const output = path.resolve(
            root,
            server.config.environments.client.build.outDir,
        );
        server.middlewares.use((request, _response, next) => {
            const url = request.url ?? '';
            const pathname = url.split('?')[0];
            const relative = pathname.slice(base.length);
            if (
                pathname.startsWith(base) &&
                /^[a-z-]+(?:\/[a-z-]+)*$/.test(relative) &&
                existsSync(path.join(output, relative, 'index.html'))
            ) {
                request.url = pathname + '/' + url.slice(pathname.length);
            }
            next();
        });
    },
};

export default defineConfig({
    base: process.env.PUBLIC_BASE_PATH || '/',
    plugins: [previewPrerenderedRoutes, tailwindcss(), reactRouter()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
});
