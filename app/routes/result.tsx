import { useParams } from 'react-router';
import { ResultPage } from '@/pages/result';
import { NotFoundPage } from '@/pages/not-found';
import { isLanguage } from '@/shared/config';

export default function ResultRoute() {
    const { lang } = useParams();
    return isLanguage(lang) ? <ResultPage lang={lang} /> : <NotFoundPage />;
}
