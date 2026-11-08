import { Link } from 'react-router';

export default function NotFound() {
    return (
        <main>
            <h1>404 — Page not found</h1>
            <Link to="/en/">Go to Home</Link>
        </main>
    );
}
