/* eslint-disable react-refresh/only-export-components -- React Router route exports. */
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { TestPage, loadMessages } from '@/pages/test';
import {
    NotFoundPage,
    loadMessages as loadNotFoundMessages,
} from '@/pages/not-found';
import { isLanguage, projectName } from '@/shared/config';
import { loadMessages as loadCommonMessages } from '@/shared/i18n';
import { loadStartMessages } from '@/widgets/start-dialog';

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
        startMessages: await loadStartMessages(language),
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
            <>
                <title>{`${data.messages['test.heading']} | ${projectName}`}</title>
                <TestPage
                    lang={data.language}
                    messages={data.messages}
                    common={data.common}
                    startMessages={data.startMessages}
                />
            </>
        :   <NotFoundPage
                lang={data.language}
                messages={data.messages}
                homeLabel={data.homeLabel}
            />;
}
