import { Download, Link2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useHref } from 'react-router';
import { resultRoute, type Language } from '@/shared/config';
import { Button, Input } from '@/shared/ui';
import type { Messages } from '../i18n';
import type { ResultPresentation } from '../model/result-presentation';

type ExportStatus = 'generating' | 'downloaded' | 'fontFailed' | 'exportFailed';

export function ResultSharing({
    language,
    payload,
    copy,
    result,
}: {
    language: Language;
    payload: string;
    copy: Messages;
    result: ResultPresentation;
}) {
    const sharePath = useHref(resultRoute(language, payload));
    const projectPath = useHref('/');
    const [copyStatus, setCopyStatus] = useState<'copied' | 'copyFailed'>();
    const [manualLink, setManualLink] = useState<string>();
    const [exportStatus, setExportStatus] = useState<ExportStatus>();
    const downloading = exportStatus === 'generating';

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
        setExportStatus('generating');
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
                setExportStatus('downloaded');
            } catch (error) {
                setExportStatus(
                    error instanceof ResultImageFontError ? 'fontFailed' : (
                        'exportFailed'
                    ),
                );
            }
        } catch {
            setExportStatus('exportFailed');
        }
    }

    return (
        <section
            className="space-y-5 border-y py-6 sm:py-8"
            aria-labelledby="result-sharing"
        >
            <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-0 space-y-2">
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
                <div className="flex min-w-0 max-w-full flex-wrap items-center gap-3">
                    {!result.allUndefined && (
                        <Button
                            disabled={downloading}
                            onClick={() => void downloadImage()}
                            className="max-w-full bg-[var(--result-camp-ink,var(--camp-cautious-builders-ink))] text-background whitespace-normal hover:bg-[var(--result-camp-ink,var(--camp-cautious-builders-ink))] hover:brightness-110"
                        >
                            <Download aria-hidden="true" />
                            {downloading ?
                                copy['share.generating']
                            :   copy['share.image']}
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => void copyLink()}
                        className="max-w-full whitespace-normal"
                    >
                        <Link2 aria-hidden="true" /> {copy['share.copy']}
                    </Button>
                    <Link
                        to={`/${language}/test`}
                        className="text-sm text-ring underline underline-offset-4"
                    >
                        {copy['result.retake']}
                    </Link>
                </div>
            </div>
            {result.allUndefined && (
                <p className="text-sm text-muted-foreground">
                    {copy['share.noScores']}
                </p>
            )}
            <div
                role="status"
                className="space-y-2 text-sm text-muted-foreground"
            >
                {copyStatus && <p>{copy[`share.${copyStatus}`]}</p>}
                {exportStatus && <p>{copy[`share.${exportStatus}`]}</p>}
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
