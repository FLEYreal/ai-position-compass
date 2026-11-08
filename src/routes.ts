import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
    index('pages/redirect.tsx'),
    route('test', 'pages/redirect.tsx', { id: 'redirect-test' }),
    route('result', 'pages/redirect.tsx', { id: 'redirect-result' }),
    route(':lang', 'pages/home.tsx'),
    route(':lang/test', 'pages/test.tsx'),
    route(':lang/result', 'pages/result.tsx'),
    route('*', 'pages/not-found.tsx'),
] satisfies RouteConfig;
