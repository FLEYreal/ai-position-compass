/** Public URLs must include the deployment base, including on nested routes. */
export function siteIconLinks(base: string) {
    return [
        { rel: 'icon', href: `${base}favicon.ico`, sizes: '16x16 32x32 48x48' },
        {
            rel: 'icon',
            href: `${base}icons/favicon-32.png`,
            type: 'image/png',
            sizes: '32x32',
        },
        {
            rel: 'icon',
            href: `${base}favicon.svg`,
            type: 'image/svg+xml',
            sizes: 'any',
        },
        {
            rel: 'apple-touch-icon',
            href: `${base}icons/apple-touch-icon-152.png`,
            sizes: '152x152',
        },
        {
            rel: 'apple-touch-icon',
            href: `${base}icons/apple-touch-icon-167.png`,
            sizes: '167x167',
        },
        {
            rel: 'apple-touch-icon',
            href: `${base}apple-touch-icon.png`,
            sizes: '180x180',
        },
        { rel: 'manifest', href: `${base}site.webmanifest` },
        {
            rel: 'mask-icon',
            href: `${base}icons/safari-pinned-tab.svg`,
            color: '#994a27',
        },
    ];
}
