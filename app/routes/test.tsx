import { useParams } from 'react-router';
import { TestPage } from '@/pages/test';
import { NotFoundPage } from '@/pages/not-found';
import { isLanguage } from '@/shared/config';

export default function TestRoute() {
    const { lang } = useParams();
    return isLanguage(lang) ? <TestPage lang={lang} /> : <NotFoundPage />;
}
