import { Link, useParams } from 'react-router';
import NotFound from './not-found';

export default function Home() {
    const { lang } = useParams();
    if (lang !== 'en' && lang !== 'ru') return <NotFound />;
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
