import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLocation,
} from 'react-router';
import './index.css';

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
