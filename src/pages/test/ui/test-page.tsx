import { Link } from 'react-router';
import type { Language } from '@/shared/config';
import type { Messages } from '../i18n';

export default function TestPage({
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
            <h1>{messages['test.heading']}</h1>
            <p>{messages['test.placeholder']}</p>
            <Link to={`/${lang}/`}>{homeLabel}</Link>
        </div>
    );
}
