import { Link } from 'react-router';
import type { Language } from '@/shared/config';
import type { Messages } from '../i18n';

export default function ResultPage({
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
            <h1>{messages['result.heading']}</h1>
            <p>{messages['result.placeholder']}</p>
            <Link to={`/${lang}/`}>{homeLabel}</Link>
        </div>
    );
}
