import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { resultPath } from '@/shared/config';

export default function RedirectToEnglish() {
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname, search, hash } = location;
    const path =
        /^\/result\/?$/.test(pathname) ? resultPath('en') : `/en${pathname}`;
    const destination = `${path}${search}${hash}`;
    useEffect(() => {
        navigate(destination, { replace: true });
    }, [destination, navigate]);
    return pathname === '/' ?
            <noscript>
                <main className="mx-auto max-w-xl p-6">
                    <Link to="/en/" lang="en" className="text-ring underline">
                        Open the English site
                    </Link>
                </main>
            </noscript>
        :   null;
}
