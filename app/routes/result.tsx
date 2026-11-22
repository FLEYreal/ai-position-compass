/* eslint-disable react-refresh/only-export-components -- React Router route exports. */
import { useSyncExternalStore } from 'react';
import {
    useLoaderData,
    useLocation,
    type LoaderFunctionArgs,
} from 'react-router';
import { ResultPage, loadMessages } from '@/pages/result';
import {
    NotFoundPage,
    loadMessages as loadNotFoundMessages,
} from '@/pages/not-found';
import { isLanguage } from '@/shared/config';
import { loadMessages as loadCommonMessages } from '@/shared/i18n';

async function loadRouteMessages({ params }: LoaderFunctionArgs) {
    const language = isLanguage(params.lang) ? params.lang : 'en';
    const common = await loadCommonMessages(language);
    if (!isLanguage(params.lang)) {
        return {
            kind: 'not-found' as const,
            language,
            messages: await loadNotFoundMessages(language),
            homeLabel: common['recovery.home'],
        };
    }
    return {
        kind: 'page' as const,
        language,
        messages: await loadMessages(language),
        common,
    };
}

export async function loader(args: LoaderFunctionArgs) {
    return loadRouteMessages(args);
}
export async function clientLoader(args: LoaderFunctionArgs) {
    return loadRouteMessages(args);
}

// Static HTML has no visitor query. Read it after the first hydration render.
const subscribe = () => () => {};

export default function Route() {
    const data = useLoaderData<typeof loader>();
    const { search } = useLocation();
    const hydrated = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
    return data.kind === 'page' ?
            <ResultPage
                lang={data.language}
                messages={data.messages}
                common={data.common}
                search={hydrated ? search : null}
            />
        :   <NotFoundPage
                lang={data.language}
                messages={data.messages}
                homeLabel={data.homeLabel}
            />;
}
