/* eslint-disable react-refresh/only-export-components -- React Router route exports. */
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { HomePage, loadMessages } from '@/pages/home';
import {
    NotFoundPage,
    loadMessages as loadNotFoundMessages,
} from '@/pages/not-found';
import { isLanguage } from '@/shared/config';
import { loadMessages as loadCommonMessages } from '@/shared/i18n';
import { loadStartMessages } from '@/widgets/start-dialog';

async function loadRouteMessages({ params }: LoaderFunctionArgs) {
    const language = isLanguage(params.lang) ? params.lang : 'en';
    if (!isLanguage(params.lang)) {
        return {
            kind: 'not-found' as const,
            language,
            messages: await loadNotFoundMessages(language),
            homeLabel: (await loadCommonMessages(language))['recovery.home'],
        };
    }
    const [messages, startMessages, common] = await Promise.all([
        loadMessages(language),
        loadStartMessages(language),
        loadCommonMessages(language),
    ]);
    return {
        kind: 'page' as const,
        language,
        messages,
        startMessages,
        common,
    };
}

export async function loader(args: LoaderFunctionArgs) {
    return loadRouteMessages(args);
}
export async function clientLoader(args: LoaderFunctionArgs) {
    return loadRouteMessages(args);
}

export default function Route() {
    const data = useLoaderData<typeof loader>();
    return data.kind === 'page' ?
            <HomePage
                lang={data.language}
                messages={data.messages}
                startMessages={data.startMessages}
                common={data.common}
            />
        :   <NotFoundPage
                lang={data.language}
                messages={data.messages}
                homeLabel={data.homeLabel}
            />;
}
