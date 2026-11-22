/* eslint-disable react-refresh/only-export-components -- React Router route exports. */
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    useLocation,
    type LoaderFunctionArgs,
} from 'react-router';
import '../src/app/styles/index.css';
import { siteIconLinks } from '../src/app/config/site-icons';
import { publicSiteUrl } from '../src/app/config/site';
import { ThemeProvider } from '../src/app/providers/theme-provider';
import { themeBootstrapScript } from '../src/shared/lib/theme';
import { AppShell } from '../src/app/ui/app-shell';
import { loadMessages } from '../src/app/i18n';
import {
    isLanguage,
    languageFromPathname,
    projectName,
} from '../src/shared/config';

async function loadShellMessages({ params, url }: LoaderFunctionArgs) {
    const language =
        isLanguage(params.lang) ?
            params.lang
        :   languageFromPathname(url.pathname, import.meta.env.BASE_URL);
    return { language, messages: await loadMessages(language) };
}

export async function loader(args: LoaderFunctionArgs) {
    return loadShellMessages(args);
}
export async function clientLoader(args: LoaderFunctionArgs) {
    return loadShellMessages(args);
}

clientLoader.hydrate = true as const;
export { shouldReloadMessages as shouldRevalidate } from '../src/app/i18n';

// React Router consumes this route-module export.
export const links = () => siteIconLinks(import.meta.env.BASE_URL);

export default function Root() {
    const { language, messages } = useLoaderData<typeof loader>();
    const { pathname } = useLocation();
    const isHome = pathname.replace(/\/$/, '') === `/${language}`;
    const description = messages['footer.description'];
    return (
        <html lang={language} suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <script
                    dangerouslySetInnerHTML={{ __html: themeBootstrapScript }}
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta name="description" content={description} />
                {isHome && publicSiteUrl && (
                    <>
                        <link
                            rel="canonical"
                            href={`${publicSiteUrl}/${language}/`}
                        />
                        <link
                            rel="alternate"
                            hrefLang="en"
                            href={`${publicSiteUrl}/en/`}
                        />
                        <link
                            rel="alternate"
                            hrefLang="ru"
                            href={`${publicSiteUrl}/ru/`}
                        />
                        <meta property="og:type" content="website" />
                        <meta property="og:title" content={projectName} />
                        <meta property="og:description" content={description} />
                        <meta
                            property="og:url"
                            content={`${publicSiteUrl}/${language}/`}
                        />
                        <meta
                            property="og:image"
                            content={`${publicSiteUrl}/icons/app-512.png`}
                        />
                    </>
                )}
                <Meta />
                <Links />
            </head>
            <body>
                <ThemeProvider>
                    <AppShell language={language} messages={messages}>
                        <Outlet />
                    </AppShell>
                </ThemeProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
