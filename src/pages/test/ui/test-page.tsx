import { Link } from 'react-router';
import type { Language } from '@/shared/config';

export default function TestPage({ lang }: { lang: Language }) {
    return (
        <div>
            <h1>Test — {lang.toUpperCase()}</h1>
            <p>Questionnaire coming later.</p>
            <Link to={`/${lang}/`}>Home</Link>
        </div>
    );
}
