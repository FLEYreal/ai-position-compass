import { Link } from 'react-router';
import type { Language } from '@/shared/config';
import type { Messages } from '../i18n';

export default function NotFound({
    lang,
    messages,
    homeLabel,
}: {
    lang: Language;
    messages: Messages;
    homeLabel: string;
}) {
    return (
        <div>
            <h1>{messages['notFound.code']}</h1>
            <Link to={`/${lang}/`}>{homeLabel}</Link>
        </div>
    );
}
