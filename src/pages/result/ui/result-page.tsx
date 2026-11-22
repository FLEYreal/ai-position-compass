import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import type { Language } from '@/shared/config';
import type { Messages as CommonMessages } from '@/shared/i18n';
import { Button, Collage } from '@/shared/ui';
import type { Messages } from '../i18n';
import { presentResult, readResultQuery } from '../model/result-presentation';
import { AxisGroup, CampComparisons, CampVoices } from './result-profile';
import { campPalette } from './camp-palette';
import { ResultSharing } from './result-sharing';

const recoveryCopy = {
    missing: ['recovery.missing.heading', 'recovery.missing.body'],
    invalid: ['recovery.invalid.heading', 'recovery.invalid.body'],
    'unsupported-version': [
        'recovery.unsupported.heading',
        'recovery.unsupported.body',
    ],
} as const;

const sectionTitle =
    'font-heading text-[clamp(1.75rem,4vw,2.75rem)] leading-tight';

export default function ResultPage({
    lang,
    messages: copy,
    common,
    search,
}: {
    lang: Language;
    messages: Messages;
    common: CommonMessages;
    search: string | null;
}) {
    const heading = copy['result.heading'];
    if (search === null) {
        return (
            <section className="space-y-4 py-10">
                <title>{heading}</title>
                <h1 className={sectionTitle}>{heading}</h1>
                <p role="status">{common['common.loading']}</p>
            </section>
        );
    }

    const decoded = readResultQuery(search);
    if (!decoded.ok) {
        const [stateHeading, stateBody] = recoveryCopy[decoded.reason];
        return (
            <section className="mx-auto grid max-w-[40rem] justify-items-center gap-5 py-[clamp(3rem,8vw,7rem)] text-center">
                <title>{heading}</title>
                <h1 className={sectionTitle}>{heading}</h1>
                <div className="w-full space-y-3 rounded-xl border bg-card px-5 py-8 sm:px-8">
                    <h2 className="font-heading text-2xl">
                        {copy[stateHeading]}
                    </h2>
                    <p className="mx-auto max-w-[45ch] text-sm leading-relaxed text-muted-foreground">
                        {copy[stateBody]}
                    </p>
                    <div className="flex justify-center pt-2">
                        <Button asChild>
                            <Link to={`/${lang}/test`}>
                                {copy['recovery.takeTest']}{' '}
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                </div>
                <Link className="text-sm text-ring underline" to={`/${lang}/`}>
                    {common['recovery.home']}
                </Link>
            </section>
        );
    }

    const result = presentResult(decoded, copy);
    const leadingCamp = result.coreCamps[0];
    const primary = leadingCamp?.close ? leadingCamp : undefined;
    const comparisons = primary ? result.coreCamps.slice(1) : result.coreCamps;
    const sourceLabel = common['common.source'];
    const hasVoices = [
        ...result.coreCamps,
        ...(result.developer?.camps ?? []),
    ].some(({ voices }) => voices.length > 0);

    return (
        <div className="space-y-[clamp(2.75rem,6vw,5rem)]">
            <title>{heading}</title>
            <section
                style={primary ? campPalette(primary) : undefined}
                className="grid items-center gap-6 rounded-xl bg-[var(--result-camp-surface,var(--paper-raised))] px-[clamp(1.25rem,4vw,2.25rem)] py-[clamp(1.75rem,5vw,2.5rem)] min-[800px]:grid-cols-[1.05fr_1fr] min-[800px]:rounded-t-none"
            >
                <div className="min-w-0 space-y-4">
                    <h1 className="font-heading text-[clamp(2.4rem,6vw,4.875rem)] leading-[1.06] font-semibold tracking-tight text-[var(--result-camp-ink,var(--ink))] text-balance break-words uppercase [&:lang(ru)]:text-[clamp(2rem,5vw,4.0625rem)]">
                        {primary?.name ?? heading}
                    </h1>
                    {primary && (
                        <>
                            <p className="text-xl font-semibold text-(--result-camp-ink) tabular-nums">
                                <span className="sr-only">
                                    {copy['result.primary']}{' '}
                                </span>
                                {primary.similarity}
                            </p>
                            <p className="max-w-[50ch] leading-relaxed italic">
                                {primary.description}
                            </p>
                            <CampVoices
                                camp={primary}
                                copy={copy}
                                sourceLabel={sourceLabel}
                            />
                        </>
                    )}
                    <p className="max-w-[55ch] text-sm leading-relaxed">
                        {copy['result.introduction']}
                    </p>
                </div>
                <Collage
                    variant="result"
                    messages={{
                        description: common['artwork.description'],
                        pauseAction: common['artwork.pause'],
                        resumeAction: common['artwork.play'],
                        punchcard: common['artwork.punchcard'],
                    }}
                    className="min-w-0"
                />
            </section>

            <section className="space-y-5" aria-labelledby="core-profile">
                <h2 className={sectionTitle} id="core-profile">
                    {copy['result.core.heading']}
                </h2>
                {leadingCamp && !primary && (
                    <div className="space-y-1">
                        <h3 className="font-heading text-2xl">
                            {copy['result.lowMatch.heading']}
                        </h3>
                        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                            {copy['result.lowMatch.body']}
                        </p>
                    </div>
                )}
                {!leadingCamp && !result.allUndefined && (
                    <div className="space-y-1">
                        <h3 className="font-heading text-2xl">
                            {copy['result.noEligible.heading']}
                        </h3>
                        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                            {copy['result.noEligible.body']}
                        </p>
                    </div>
                )}
                <CampComparisons
                    camps={comparisons}
                    heading={
                        primary ?
                            copy['result.neighboring']
                        :   copy['result.matches.heading']
                    }
                    copy={copy}
                    sourceLabel={sourceLabel}
                />
                <div className="space-y-5 pt-3">
                    <h3 className="font-heading text-2xl">
                        {copy['result.axes.heading']}
                    </h3>
                    {result.someUndefined && (
                        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                            {result.allUndefined ?
                                copy['result.allUndefined']
                            :   copy['result.someUndefined']}
                        </p>
                    )}
                    <AxisGroup
                        heading={copy['result.values.heading']}
                        axes={result.values}
                        copy={copy}
                        annotate
                    />
                    <AxisGroup
                        heading={copy['result.beliefs.heading']}
                        axes={result.beliefs}
                        copy={copy}
                    />
                </div>
            </section>

            {result.developer ?
                <section
                    className="space-y-5"
                    aria-labelledby="developer-profile"
                >
                    <h2 id="developer-profile" className={sectionTitle}>
                        {copy['result.developer.heading']}
                    </h2>
                    {(
                        result.developer.axes.every(
                            ({ score }) => score === null,
                        )
                    ) ?
                        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                            {copy['result.developer.undefined']}
                        </p>
                    : result.developer.camps.length === 0 ?
                        <div className="space-y-1">
                            <h3 className="font-heading text-2xl">
                                {copy['result.noEligible.heading']}
                            </h3>
                            <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                                {copy['result.noEligible.body']}
                            </p>
                        </div>
                    :   !result.developer.camps[0].close && (
                            <div className="space-y-1">
                                <h3 className="font-heading text-2xl">
                                    {copy['result.lowMatch.heading']}
                                </h3>
                                <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                                    {copy['result.lowMatch.body']}
                                </p>
                            </div>
                        )
                    }
                    <CampComparisons
                        camps={result.developer.camps}
                        heading={copy['result.matches.heading']}
                        copy={copy}
                        sourceLabel={sourceLabel}
                    />
                    <AxisGroup
                        heading={copy['result.values.heading']}
                        axes={result.developer.axes.filter(
                            ({ construct }) => construct === 'value',
                        )}
                        copy={copy}
                    />
                    <AxisGroup
                        heading={copy['result.beliefs.heading']}
                        axes={result.developer.axes.filter(
                            ({ construct }) => construct === 'belief',
                        )}
                        copy={copy}
                    />
                </section>
            :   <p className="text-sm text-muted-foreground">
                    {copy['result.developer.skipped']}
                </p>
            }

            <div className="space-y-4">
                <details className="group border-y py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-xl [&::-webkit-details-marker]:hidden">
                        {copy['result.methodology']}
                        <ChevronDown
                            aria-hidden="true"
                            size={18}
                            className="shrink-0 group-open:rotate-180"
                        />
                    </summary>
                    <div className="mt-4 max-w-[65ch] space-y-2 text-sm leading-relaxed text-muted-foreground">
                        <p>{copy['result.matchExplanation']}</p>
                        <p>{copy['result.undefined.description']}</p>
                        <p>{copy['result.privacy']}</p>
                        <p>
                            {copy['result.version'].replace(
                                '{version}',
                                String(result.version),
                            )}
                        </p>
                    </div>
                </details>
                {hasVoices && (
                    <p className="max-w-[65ch] text-sm text-muted-foreground">
                        {copy['footer.disclaimer']}
                    </p>
                )}
            </div>
            <ResultSharing
                key={`${lang}:${decoded.payload}`}
                language={lang}
                payload={decoded.payload}
                copy={copy}
                result={result}
            />
            <Link
                className="inline-block text-sm text-ring underline"
                to={`/${lang}/test`}
            >
                {copy['result.retake']}
            </Link>
        </div>
    );
}
