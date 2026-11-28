import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../public/', import.meta.url);
const read = (name) => readFile(new URL(name, root));
const expected = new Map([
    ...[16, 32, 48, 96].map((size) => [`icons/favicon-${size}.png`, size]),
    ...[152, 167].map((size) => [`icons/apple-touch-icon-${size}.png`, size]),
    ['apple-touch-icon.png', 180],
    ...[192, 512].flatMap((size) => [
        [`icons/app-${size}.png`, size],
        [`icons/maskable-${size}.png`, size],
    ]),
]);
for (const [name, size] of expected) {
    const png = await read(name);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', name);
    assert.equal(png.readUInt32BE(16), size, `${name} width`);
    assert.equal(png.readUInt32BE(20), size, `${name} height`);
}
const ico = await read('favicon.ico');
const pinned = (await read('icons/safari-pinned-tab.svg')).toString();
assert.ok(pinned.includes('viewBox="0 0 16 16"'));
assert.ok(!pinned.includes('#ed5b38'));
assert.equal(ico.readUInt16LE(2), 1);
assert.equal(ico.readUInt16LE(4), 3);
for (const [index, size] of [16, 32, 48].entries()) {
    const offset = 6 + index * 16;
    assert.equal(ico[offset], size);
    assert.equal(ico[offset + 1], size);
    assert.ok(
        ico.readUInt32LE(offset + 12) + ico.readUInt32LE(offset + 8) <=
            ico.length,
    );
}
const manifest = JSON.parse(await read('site.webmanifest'));
assert.equal(manifest.start_url, './');
assert.equal(manifest.scope, './');
assert.equal(manifest.display, 'browser');
for (const icon of manifest.icons) {
    const size = expected.get(icon.src);
    assert.ok(size, icon.src);
    assert.equal(icon.sizes, `${size}x${size}`);
    assert.equal(icon.type, 'image/png');
    assert.equal(
        icon.purpose,
        icon.src.includes('maskable') ? 'maskable' : 'any',
    );
}
console.log(
    `Verified ${expected.size} PNGs, three ICO frames, and base-relative manifest entries.`,
);
