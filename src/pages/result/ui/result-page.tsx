import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import type { Language } from '@/shared/config';
import type { Messages as CommonMessages } from '@/shared/i18n';
import { Button, Collage } from '@/shared/ui';
import type { Messages } from '../i18n';
import { presentResult, readResultQuery } from '../model/result-presentation';
import {
    AxisGroup,
    CampComparisons,
    CampSimilarity,
    CampVoices,
} from './result-profile';
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
    const developer = result.developer;
    const developerLead = developer?.camps[0];
    const developerPrimary = developerLead?.close ? developerLead : undefined;
    const developerComparisons =
        developer?.camps.slice(developerPrimary ? 1 : 0) ?? [];
    const coreHasVoices = result.coreCamps.some(
        ({ voices }) => voices.length > 0,
    );
    const developerHasVoices = developer?.camps.some(
        ({ voices }) => voices.length > 0,
    );
    const voicesNotice = (
        <p className="max-w-[80ch] text-xs leading-relaxed text-muted-foreground">
            {copy['footer.disclaimer']}
        </p>
    );

    return (
        <div
            style={primary ? campPalette(primary) : undefined}
            className="space-y-[clamp(2rem,4.5vw,3.5rem)]"
        >
            <title>{heading}</title>
            <section className="grid items-center gap-5 rounded-xl bg-[var(--result-camp-surface,var(--paper-raised))] px-[clamp(1.1875rem,4vw,2.1875rem)] py-[clamp(1.625rem,4vw,2.5rem)] min-[800px]:grid-cols-[1.05fr_1fr] min-[800px]:rounded-t-none">
                <div className="min-w-0 space-y-4">
                    <h1 className="font-heading text-[clamp(2.625rem,6vw,4.875rem)] leading-[1.06] font-semibold tracking-tight text-[var(--result-camp-ink,var(--ink))] text-balance wrap-break-word uppercase [&:lang(ru)]:text-[clamp(2rem,5vw,4.0625rem)] max-[560px]:[&:lang(ru)]:text-[clamp(2rem,9.8vw,3.125rem)]">
                        {primary?.name ?? heading}
                    </h1>
                    {primary && (
                        <>
                            <div
                                aria-hidden="true"
                                className="h-1 w-24 bg-(--result-camp-ink)"
                            />
                            <CampSimilarity
                                camp={primary}
                                copy={copy}
                                prominent
                            />
                            <p className="max-w-[50ch] leading-relaxed italic">
                                {primary.description}
                            </p>
                            <p className="max-w-[55ch] text-sm leading-[1.85] text-muted-foreground">
                                {primary.context}
                            </p>
                            <CampVoices camp={primary} copy={copy} />
                        </>
                    )}
                </div>
                <Collage
                    variant="result"
                    messages={{
                        description: common['artwork.description'],
                        pauseAction: common['artwork.pause'],
                        resumeAction: common['artwork.play'],
                        punchcard: common['artwork.punchcard'],
                    }}
                    className="min-w-0 max-[799px]:mx-auto max-[799px]:max-w-[390px]"
                />
            </section>

            {(leadingCamp || !result.allUndefined) && (
                <section className="space-y-4" aria-labelledby="core-profile">
                    <h2 id="core-profile" className="sr-only">
                        {copy['result.core.heading']}
                    </h2>
                    {leadingCamp && !primary && (
                        <MatchNotice copy={copy} kind="lowMatch" />
                    )}
                    {!leadingCamp && !result.allUndefined && (
                        <MatchNotice copy={copy} kind="noEligible" />
                    )}
                    <CampComparisons
                        camps={comparisons}
                        heading={
                            primary ?
                                copy['result.neighboring']
                            :   copy['result.matches.heading']
                        }
                        caption={
                            primary ?
                                copy['result.neighboring.caption']
                            :   undefined
                        }
                        start={primary ? 2 : 1}
                        copy={copy}
                    />
                    {coreHasVoices && voicesNotice}
                </section>
            )}

            <section
                className="space-y-6 sm:space-y-8"
                aria-labelledby="result-axes"
            >
                <h2 className="sr-only" id="result-axes">
                    {copy['result.axes.heading']}
                </h2>
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
            </section>

            {developer ?
                <section
                    className="space-y-6 rounded-xl bg-secondary px-[clamp(1rem,3vw,1.625rem)] py-6"
                    aria-labelledby="developer-profile"
                >
                    <h2
                        id="developer-profile"
                        className={`${sectionTitle} text-(--camp-vibe-coders-ink)`}
                    >
                        {copy['result.developer.heading']}
                    </h2>
                    {developerPrimary && (
                        <div
                            className="space-y-3"
                            style={campPalette(developerPrimary)}
                        >
                            <h3 className="font-heading text-[length:var(--font-size-title)] leading-tight text-(--result-camp-ink) uppercase">
                                {developerPrimary.name}
                            </h3>
                            <CampSimilarity
                                camp={developerPrimary}
                                copy={copy}
                                prominent
                            />
                            <p className="max-w-[58ch] leading-relaxed italic">
                                {developerPrimary.description}
                            </p>
                            <p className="max-w-[65ch] text-sm leading-[1.85] text-muted-foreground">
                                {developerPrimary.context}
                            </p>
                            <CampVoices camp={developerPrimary} copy={copy} />
                        </div>
                    )}
                    {developer.axes.every(({ score }) => score === null) ?
                        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                            {copy['result.developer.undefined']}
                        </p>
                    : !developerLead ?
                        <MatchNotice copy={copy} kind="noEligible" />
                    :   !developerPrimary && (
                            <MatchNotice copy={copy} kind="lowMatch" />
                        )
                    }
                    <CampComparisons
                        camps={developerComparisons}
                        heading={
                            developerPrimary ?
                                copy['result.neighboring']
                            :   copy['result.matches.heading']
                        }
                        start={developerPrimary ? 2 : 1}
                        copy={copy}
                    />
                    {!coreHasVoices && developerHasVoices && voicesNotice}
                    <AxisGroup
                        heading={copy['result.values.heading']}
                        axes={developer.axes.filter(
                            ({ construct }) => construct === 'value',
                        )}
                        copy={copy}
                        developer
                    />
                    <AxisGroup
                        heading={copy['result.beliefs.heading']}
                        axes={developer.axes.filter(
                            ({ construct }) => construct === 'belief',
                        )}
                        copy={copy}
                        developer
                    />
                </section>
            :   <p className="text-sm text-muted-foreground">
                    {copy['result.developer.skipped']}
                </p>
            }

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
            <ResultSharing
                key={`${lang}:${decoded.payload}`}
                language={lang}
                payload={decoded.payload}
                copy={copy}
                result={result}
            />
            <div className="flex justify-end">
                <Link
                    className="inline-flex items-center gap-1 text-sm text-ring underline underline-offset-4"
                    to={`/${lang}/`}
                >
                    {common['recovery.home']}{' '}
                    <ArrowRight aria-hidden="true" size={14} />
                </Link>
            </div>
        </div>
    );
}

function MatchNotice({
    copy,
    kind,
}: {
    copy: Messages;
    kind: 'noEligible' | 'lowMatch';
}) {
    return (
        <div className="space-y-1">
            <h3 className="font-heading text-2xl">
                {copy[`result.${kind}.heading`]}
            </h3>
            <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground">
                {copy[`result.${kind}.body`]}
            </p>
        </div>
    );
}
