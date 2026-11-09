import { Link } from 'react-router';
import type { Language } from '@/shared/config';

export default function ResultPage({ lang }: { lang: Language }) {
    return (
        <div>
            <h1>Result — {lang.toUpperCase()}</h1>
            <p>Result link support coming later.</p>
            <Link to={`/${lang}/`}>Home</Link>
        </div>
    );
}
