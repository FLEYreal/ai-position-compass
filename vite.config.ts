import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.PUBLIC_BASE_PATH || '/',
    plugins: [tailwindcss(), reactRouter()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
});
