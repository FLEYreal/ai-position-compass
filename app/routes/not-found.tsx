/* eslint-disable react-refresh/only-export-components -- React Router route exports. */
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { NotFoundPage, loadMessages } from '@/pages/not-found';
import { languageFromPathname } from '@/shared/config';
import { loadMessages as loadCommonMessages } from '@/shared/i18n';

export async function clientLoader({ request }: LoaderFunctionArgs) {
    const language = languageFromPathname(
        new URL(request.url).pathname,
        import.meta.env.BASE_URL,
    );
    const [messages, common] = await Promise.all([
        loadMessages(language),
        loadCommonMessages(language),
    ]);
    return { language, messages, homeLabel: common['recovery.home'] };
}
clientLoader.hydrate = true as const;
export function HydrateFallback() {
    return null;
}
export default function Route() {
    const data = useLoaderData<typeof clientLoader>();
    return (
        <NotFoundPage
            lang={data.language}
            messages={data.messages}
            homeLabel={data.homeLabel}
        />
    );
}
