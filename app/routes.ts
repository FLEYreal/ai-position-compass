import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
    index('routes/redirect.tsx'),
    route('test', 'routes/redirect.tsx', { id: 'redirect-test' }),
    route('result', 'routes/redirect.tsx', { id: 'redirect-result' }),
    route(':lang', 'routes/home.tsx'),
    route(':lang/test', 'routes/test.tsx'),
    route(':lang/result', 'routes/result.tsx'),
    route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
