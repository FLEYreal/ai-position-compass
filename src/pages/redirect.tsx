import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

export default function RedirectToEnglish() {
    const location = useLocation();
    const navigate = useNavigate();
    const destination = `/en${location.pathname === '/' ? '/' : location.pathname}${location.search}${location.hash}`;
    useEffect(() => {
        navigate(destination, { replace: true });
    }, [destination, navigate]);
    return (
        <main>
            <p>
                Continue to <Link to={destination}>English</Link>.
            </p>
        </main>
    );
}
