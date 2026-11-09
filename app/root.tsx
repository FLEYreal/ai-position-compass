import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
} from 'react-router';
import '../src/app/styles/index.css';
import { siteIconLinks } from '../src/app/config/site-icons';
import { ThemeProvider } from '../src/app/providers/theme-provider';
import { themeBootstrapScript } from '../src/shared/lib/theme';
import { AppShell } from '../src/app/ui/app-shell';

// React Router consumes this route-module export.
// eslint-disable-next-line react-refresh/only-export-components
export const links = () => siteIconLinks(import.meta.env.BASE_URL);

export default function Root() {
    const { pathname } = useLocation();
    const language = /^\/ru(?:\/|$)/.test(pathname) ? 'ru' : 'en';
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
                    <AppShell>
                        <Outlet />
                    </AppShell>
                </ThemeProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
