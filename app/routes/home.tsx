import { useParams } from 'react-router';
import { HomePage } from '@/pages/home';
import { NotFoundPage } from '@/pages/not-found';
import { isLanguage } from '@/shared/config';

export default function HomeRoute() {
    const { lang } = useParams();
    return isLanguage(lang) ? <HomePage lang={lang} /> : <NotFoundPage />;
}
