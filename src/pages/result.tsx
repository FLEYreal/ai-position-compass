import { Link, useParams } from 'react-router';
import NotFound from './not-found';

export default function ResultPage() {
    const { lang } = useParams();
    if (lang !== 'en' && lang !== 'ru') return <NotFound />;
    return (
        <main>
            <h1>Result — {lang.toUpperCase()}</h1>
            <p>Result link support coming later.</p>
            <Link to={`/${lang}/`}>Home</Link>
        </main>
    );
}
