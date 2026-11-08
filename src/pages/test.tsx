import { Link, useParams } from 'react-router';
import NotFound from './not-found';

export default function TestPage() {
    const { lang } = useParams();
    if (lang !== 'en' && lang !== 'ru') return <NotFound />;
    return (
        <main>
            <h1>Test — {lang.toUpperCase()}</h1>
            <p>Questionnaire coming later.</p>
            <Link to={`/${lang}/`}>Home</Link>
        </main>
    );
}
