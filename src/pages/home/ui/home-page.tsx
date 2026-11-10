import { Link } from 'react-router';
import type { Language } from '@/shared/config';
import type { Messages } from '../i18n';

export default function Home({
    lang,
    messages: copy,
}: {
    lang: Language;
    messages: Messages;
}) {
    return (
        <div>
            <h1>{copy['home.title']}</h1>
            <nav aria-label={copy['common.pages']}>
                <Link to={`/${lang}/test`}>{copy['nav.test']}</Link>
                {' · '}
                <Link to={`/${lang}/result`}>{copy['nav.results']}</Link>
                {' · '}
                <Link to={lang === 'en' ? '/ru/' : '/en/'}>
                    {lang === 'en' ? 'Русский' : 'English'}
                </Link>
            </nav>
        </div>
    );
}
