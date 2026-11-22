import { ArrowRight, Link2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useHref, useLocation } from 'react-router';
import { resultRoute, type Language } from '@/shared/config';
import { Button, Input } from '@/shared/ui';
import type { Messages } from '../i18n';
import type {
    DecodedResult,
    ResultPresentation,
} from '../model/result-presentation';
import { ResultDownloadMenu } from './result-download-menu';
import type { Messages as CommonMessages } from '@/shared/i18n';

type ExportStatus =
    | 'generating'
    | 'imageReady'
    | 'fontFailed'
    | 'exportFailed'
    | 'jsonReady'
    | 'jsonScoresReady'
    | 'jsonFailed';

export function ResultSharing({
    language,
    decoded,
    copy,
    common,
    result,
}: {
    language: Language;
    decoded: DecodedResult & { payload: string };
    copy: Messages;
    common: CommonMessages;
    result: ResultPresentation;
}) {
    const sharePath = useHref(resultRoute(language, decoded.payload));
    const { state } = useLocation();
    const projectPath = useHref('/');
    const [copyStatus, setCopyStatus] = useState<'copied' | 'copyFailed'>();
    const [manualLink, setManualLink] = useState<string>();
    const [exportStatus, setExportStatus] = useState<{ kind: ExportStatus }>();
    const downloading = exportStatus?.kind === 'generating';

    useEffect(() => {
        const kind = exportStatus?.kind;
        if (
            kind !== 'imageReady' &&
            kind !== 'jsonReady' &&
            kind !== 'jsonScoresReady'
        )
            return;

        const timer = window.setTimeout(() => setExportStatus(undefined), 5000);
        return () => window.clearTimeout(timer);
    }, [exportStatus]);

    async function copyLink() {
        const link = new URL(sharePath, window.location.origin).href;
        try {
            await navigator.clipboard.writeText(link);
            setManualLink(undefined);
            setCopyStatus('copied');
        } catch {
            setManualLink(link);
            setCopyStatus('copyFailed');
        }
    }

    async function downloadImage() {
        setExportStatus({ kind: 'generating' });
        try {
            const { saveResultImage, ResultImageFontError } =
                await import('../lib/result-image');
            try {
                await saveResultImage({
                    language,
                    copy,
                    result,
                    projectUrl:
                        import.meta.env.VITE_PUBLIC_PROJECT_URL ||
                        new URL(projectPath, window.location.origin).href,
                });
                setExportStatus({ kind: 'imageReady' });
            } catch (error) {
                setExportStatus({
                    kind:
                        error instanceof ResultImageFontError ? 'fontFailed' : (
                            'exportFailed'
                        ),
                });
            }
        } catch {
            setExportStatus({ kind: 'exportFailed' });
        }
    }

    async function downloadJson() {
        setExportStatus({ kind: 'generating' });
        try {
            const { saveResultJson } = await import('../lib/result-json');
            const availability = await saveResultJson({
                language,
                decoded,
                copy,
                result,
                locationState: state,
                projectUrl:
                    import.meta.env.VITE_PUBLIC_PROJECT_URL ||
                    new URL(projectPath, window.location.origin).href,
            });
            setExportStatus({
                kind:
                    availability === 'included' ? 'jsonReady' : (
                        'jsonScoresReady'
                    ),
            });
        } catch {
            setExportStatus({ kind: 'jsonFailed' });
        }
    }

    return (
        <section
            className="space-y-5 border-t pt-6 pb-4 sm:pt-8 sm:pb-6"
            aria-labelledby="result-sharing"
        >
            <div className="flex flex-wrap items-start justify-between gap-8">
                <div className="min-w-0 space-y-4">
                    <h2
                        id="result-sharing"
                        className="font-heading text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-[var(--result-camp-ink,var(--ink))] uppercase"
                    >
                        {copy['share.heading']}
                    </h2>
                    <p className="max-w-[55ch] text-sm leading-relaxed text-muted-foreground">
                        {copy['share.description']}
                    </p>
                </div>
                <div className="flex w-full flex-wrap items-center justify-between gap-4">
                    <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">
                        <ResultDownloadMenu
                            copy={copy}
                            busy={downloading}
                            allUndefined={result.allUndefined}
                            onImage={() => void downloadImage()}
                            onJson={() => void downloadJson()}
                        />
                        <Button
                            variant="outline"
                            onClick={() => void copyLink()}
                            className="max-w-full whitespace-normal"
                        >
                            <Link2 aria-hidden="true" /> {copy['share.copy']}
                        </Button>
                    </div>
                    <Link
                        className="inline-flex items-center gap-1 text-sm text-ring underline underline-offset-4"
                        to={`/${language}/`}
                    >
                        {common['recovery.home']}{' '}
                        <ArrowRight aria-hidden="true" size={14} />
                    </Link>
                </div>
            </div>
            <div
                role="status"
                className="space-y-2 text-sm text-muted-foreground"
            >
                {copyStatus && <p>{copy[`share.${copyStatus}`]}</p>}
                {exportStatus && <p>{copy[`share.${exportStatus.kind}`]}</p>}
            </div>
            {manualLink && (
                <Input
                    type="url"
                    dir="ltr"
                    aria-label={copy['share.linkLabel']}
                    value={manualLink}
                    readOnly
                    onFocus={(event) => event.currentTarget.select()}
                    className="w-full max-w-[36rem] bg-card"
                />
            )}
        </section>
    );
}
