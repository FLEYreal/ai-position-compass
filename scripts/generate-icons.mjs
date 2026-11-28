import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Regeneration requires ImageMagick (convert); normal development/CI does not.
const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'public');
await mkdir(path.join(publicDir, 'icons'), { recursive: true });
const source = await readFile(path.join(publicDir, 'favicon.svg'), 'utf8');
const artwork = source.replace(/<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const opaque = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="#eeeae0" d="M0 0H64V64H0Z"/>${artwork}</svg>`;
// Entire original mark fits inside the centered 80%-diameter safe-zone circle.
const maskable = opaque.replace(
    artwork,
    `<g transform="translate(6.4 6.4) scale(.8)">${artwork}</g>`,
);
const monochrome = artwork
    .replace(/<path[^>]*fill="#ed5b38"[^>]*\/>/g, '')
    .replaceAll('fill="#eeeae0"', 'fill="none"')
    .replaceAll('#1b1a17', '#000');
await writeFile(
    path.join(publicDir, 'icons/safari-pinned-tab.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g transform="scale(.25)">${monochrome}</g></svg>\n`,
);
function convert(args, input) {
    const result = spawnSync('convert', args, { input, cwd: publicDir });
    if (result.error || result.status !== 0) {
        throw new Error(result.error?.message || result.stderr.toString());
    }
}
function png(svg, size, name) {
    convert(
        [
            '-background',
            'none',
            '-density',
            '768',
            'svg:-',
            '-resize',
            `${size}x${size}`,
            '-strip',
            `PNG32:${name}`,
        ],
        svg,
    );
}
for (const size of [16, 32, 48, 96])
    png(source, size, `icons/favicon-${size}.png`);
for (const size of [152, 167])
    png(opaque, size, `icons/apple-touch-icon-${size}.png`);
png(opaque, 180, 'apple-touch-icon.png');
for (const size of [192, 512]) {
    png(opaque, size, `icons/app-${size}.png`);
    png(maskable, size, `icons/maskable-${size}.png`);
}
convert([
    ...[16, 32, 48].map((size) => `icons/favicon-${size}.png`),
    'favicon.ico',
]);
console.log(
    'Generated browser, Apple touch, app and maskable icons from public/favicon.svg.',
);
