/* eslint-disable react-refresh/only-export-components -- React Router route exports. */
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    type LoaderFunctionArgs,
} from 'react-router';
import '../src/app/styles/index.css';
import { siteIconLinks } from '../src/app/config/site-icons';
import { ThemeProvider } from '../src/app/providers/theme-provider';
import { themeBootstrapScript } from '../src/shared/lib/theme';
import { AppShell } from '../src/app/ui/app-shell';
import { loadMessages } from '../src/app/i18n';
import { languageFromPathname } from '../src/shared/config';

async function loadShellMessages({ request }: LoaderFunctionArgs) {
    const language = languageFromPathname(
        new URL(request.url).pathname,
        import.meta.env.BASE_URL,
    );
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
