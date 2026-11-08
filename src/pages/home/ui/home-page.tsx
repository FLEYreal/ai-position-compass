import { Link } from 'react-router';
import type { Language } from '@/shared/config';

export default function Home({ lang }: { lang: Language }) {
    return (
        <main>
            <h1>AI Position Compass — {lang.toUpperCase()}</h1>
            <nav aria-label="Pages">
                <Link to={`/${lang}/test`}>Test</Link>
                {' · '}
                <Link to={`/${lang}/result`}>Result</Link>
                {' · '}
                <Link to={lang === 'en' ? '/ru/' : '/en/'}>
                    {lang === 'en' ? 'Русский' : 'English'}
                </Link>
            </nav>
        </main>
    );
}
