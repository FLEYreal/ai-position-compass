import { ArrowLeft } from 'lucide-react';
import { Link, useHref, useLocation } from 'react-router';
import type { Language } from '@/shared/config';
import { Button, EditorialPrint, Mask, PaperClip } from '@/shared/ui';
import type { Messages } from '../i18n';

export default function NotFound({
    lang,
    messages,
    homeLabel,
}: {
    lang: Language;
    messages: Messages;
    homeLabel: string;
}) {
    const { pathname } = useLocation();
    const requestedPath = useHref({ pathname });

    return (
        <section className="mx-auto grid min-h-[62vh] max-w-[1140px] items-center gap-9 py-6 min-[800px]:grid-cols-2 min-[800px]:gap-[clamp(2rem,6vw,5.5rem)]">
            <title>{messages['notFound.code']}</title>
            <div
                aria-hidden="true"
                className="relative mx-auto flex w-full max-w-[350px] items-center justify-center gap-1 pt-5 text-[var(--orange-ink)] min-[800px]:max-w-none"
            >
                <span className="font-heading text-[clamp(6rem,27vw,10rem)] leading-none font-semibold min-[800px]:text-[clamp(8rem,17vw,15rem)]">
                    4
                </span>
                <EditorialPrint
                    viewBox="0 0 340 340"
                    className="w-[40%] max-w-[220px] -rotate-9"
                >
                    <Mask />
                </EditorialPrint>
                <span className="font-heading text-[clamp(6rem,27vw,10rem)] leading-none font-semibold min-[800px]:text-[clamp(8rem,17vw,15rem)]">
                    4
                </span>
                <EditorialPrint
                    viewBox="0 0 76 158"
                    className="absolute top-0 right-[13%] w-[12%] rotate-[42deg]"
                >
                    <PaperClip />
                </EditorialPrint>
            </div>
            <div className="min-w-0">
                <h1 className="max-w-[16ch] font-heading text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.12] font-semibold tracking-tight text-balance uppercase">
                    {messages['notFound.heading']}
                </h1>
                <p className="mt-4 max-w-[43ch] leading-relaxed text-muted-foreground">
                    {messages['notFound.body']}
                </p>
                <code
                    dir="ltr"
                    className="mt-4 block text-sm break-all text-muted-foreground"
                >
                    {requestedPath}
                </code>
                <Button asChild className="mt-6">
                    <Link to={`/${lang}/`}>
                        <ArrowLeft aria-hidden="true" />
                        {homeLabel}
                    </Link>
                </Button>
                <p className="mt-7 text-xs text-muted-foreground">
                    {messages['notFound.code']}
                </p>
            </div>
        </section>
    );
}
