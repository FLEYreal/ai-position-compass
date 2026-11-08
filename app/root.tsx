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

// React Router consumes this route-module export.
// eslint-disable-next-line react-refresh/only-export-components
export const links = () => siteIconLinks(import.meta.env.BASE_URL);

export default function Root() {
    const { pathname } = useLocation();
    const language = /^\/ru(?:\/|$)/.test(pathname) ? 'ru' : 'en';
    return (
        <html lang={language}>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
