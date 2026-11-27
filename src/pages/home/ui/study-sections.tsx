import type { CSSProperties } from 'react';
import {
    axisConstruct,
    coreAxes,
    devAxes,
    getQuestionCount,
    type AxisId,
    type CampId,
    type ModelId,
} from '@/shared/config';
import { AxisIcon, DeveloperCollage, Separator } from '@/shared/ui';
import { cn } from '@/shared/lib';
import type { Messages as CommonMessages } from '@/shared/i18n';
import type { Messages } from '../i18n';

const coreCount = getQuestionCount('core');
const devCount = getQuestionCount('dev');

const campGroups = [
    {
        model: 'core',
        entries: [
            ['accelerationists', 'accelerationists'],
            ['safetyCamp', 'safety-camp'],
            ['normalTechnologyCamp', 'normal-technology-camp'],
            ['ethicsCamp', 'ethics-camp'],
        ],
    },
    {
        model: 'dev',
        entries: [
            ['vibeCoders', 'vibe-coders'],
            ['craftspeople', 'craftspeople'],
        ],
    },
] as const satisfies ReadonlyArray<{
    model: ModelId;
    entries: ReadonlyArray<readonly [CampId, string]>;
}>;

const sectionHeading =
    'font-heading text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.12] font-medium tracking-tight text-balance';

function AxisDefinitions({
    axes,
    names,
    descriptions,
}: {
    axes: ReadonlyArray<{ id: AxisId }>;
    names: Messages['axes']['axes'];
    descriptions: CommonMessages['axisDescriptions'];
}) {
    return (
        <dl className="min-w-0 divide-y divide-border md:grid md:grid-rows-subgrid md:[grid-row:2/-1]">
            {axes.map(({ id }) => {
                const token = id.replace(
                    /[A-Z]/g,
                    (letter) => '-' + letter.toLowerCase(),
                );
                return (
                    <div
                        key={id}
                        className="grid content-start grid-cols-[24px_minmax(0,1fr)] gap-x-2.5 gap-y-1 py-3.5"
                    >
                        <dt className="col-span-2 grid grid-cols-subgrid items-center font-semibold">
                            <span style={{ color: `var(--axis-${token})` }}>
                                <AxisIcon axis={id} />
                            </span>
                            <span>{names[id]}</span>
                        </dt>
                        <dd className="col-start-2 text-sm leading-relaxed text-muted-foreground">
                            {descriptions[id]}
                        </dd>
                    </div>
                );
            })}
        </dl>
    );
}

export function StudySections({
    copy,
    axisDescriptions,
}: {
    copy: Messages;
    axisDescriptions: CommonMessages['axisDescriptions'];
}) {
    const axesCopy = copy.axes;
    const axisGroups = [
        {
            heading: axesCopy.values,
            axes: coreAxes.filter(({ id }) => axisConstruct[id] === 'value'),
        },
        {
            heading: axesCopy.beliefs,
            axes: coreAxes.filter(({ id }) => axisConstruct[id] === 'belief'),
        },
        {
            heading: axesCopy.developer,
            axes: devAxes,
            description: axesCopy.developerDescription,
        },
    ];

    const axisRows = Math.max(...axisGroups.map(({ axes }) => axes.length));

    return (
        <div className="mt-[clamp(5rem,10vw,9rem)] flex flex-col gap-[clamp(5rem,10vw,9rem)]">
            <section
                aria-labelledby="study-modules"
                className="grid gap-y-6 md:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] md:items-center md:gap-x-8 lg:gap-x-12"
            >
                <Separator className="col-span-full" />
                <div className="min-w-0 md:col-start-2 md:row-start-2 md:self-end">
                    <h2 id="study-modules" className={sectionHeading}>
                        {copy['study.modules.heading']}
                    </h2>
                    <p className="mt-3 max-w-[58ch] leading-relaxed text-muted-foreground">
                        {copy['study.modules.intro']}
                    </p>
                </div>
                <DeveloperCollage className="mx-auto max-w-[380px] translate-y-3 md:col-start-1 md:row-span-2 md:row-start-2 xl:max-w-[480px]" />
                <div className="min-w-0 self-start bg-[var(--paper-raised)] px-4 py-5 sm:px-6 md:col-start-2 md:row-start-3">
                    <div aria-hidden="true" className="mb-5 flex h-2.5 gap-1.5">
                        <span
                            className="bg-foreground"
                            style={{ flexGrow: coreCount }}
                        />
                        <span
                            className="bg-[var(--orange)]"
                            style={{ flexGrow: devCount }}
                        />
                    </div>
                    <dl className="grid gap-4 sm:gap-5">
                        <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1">
                            <dt className="font-heading text-2xl">
                                {copy['study.module.core']}
                            </dt>
                            <dd className="text-sm tabular-nums text-muted-foreground">
                                {copy['study.module.core.count'].replace(
                                    '{count}',
                                    String(coreCount),
                                )}
                            </dd>
                            <dd className="col-span-2 max-w-[55ch] text-sm leading-relaxed">
                                {copy['study.module.core.body']}
                            </dd>
                        </div>
                        <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 border-t border-border pt-4">
                            <dt className="font-heading text-2xl text-[var(--orange-ink)]">
                                {copy['study.module.dev']}
                            </dt>
                            <dd className="text-sm tabular-nums text-muted-foreground">
                                {copy['study.module.dev.count'].replace(
                                    '{count}',
                                    String(devCount),
                                )}
                            </dd>
                            <dd className="col-span-2 max-w-[55ch] text-sm leading-relaxed">
                                {copy['study.module.dev.body']}
                            </dd>
                        </div>
                    </dl>
                </div>
            </section>

            <section aria-labelledby="study-camps">
                <Separator className="mb-6" />
                <h2 id="study-camps" className={sectionHeading}>
                    {copy['study.camps.heading']}
                </h2>
                <p className="mt-3 max-w-[68ch] leading-relaxed text-muted-foreground">
                    {copy['study.camps.intro']}
                </p>
                <div className="mt-7 grid gap-x-3 gap-y-7 lg:grid-cols-3 lg:grid-rows-[auto_auto_auto] lg:gap-y-3">
                    {campGroups.map(({ model, entries }) => (
                        <div
                            key={model}
                            className={cn(
                                'grid min-w-0 gap-y-3 lg:row-span-3 lg:grid-rows-subgrid',
                                model === 'core' && 'lg:col-span-2',
                            )}
                        >
                            <h3 className="font-heading text-2xl">
                                {
                                    copy[
                                        model === 'core' ? 'study.camps.core'
                                        :   'study.camps.dev'
                                    ]
                                }
                            </h3>
                            <ul
                                className={cn(
                                    'grid gap-3 sm:grid-cols-2 lg:row-span-2 lg:grid-rows-subgrid',
                                    model === 'dev' && 'lg:grid-cols-1',
                                )}
                            >
                                {entries.map(([id, token]) => {
                                    const { name, description } =
                                        copy.camps[id];
                                    return (
                                        <li
                                            key={id}
                                            className="rounded-xl px-5 py-4"
                                            style={{
                                                backgroundColor: `var(--camp-${token}-surface)`,
                                            }}
                                        >
                                            <h4
                                                className="font-heading text-2xl leading-tight"
                                                style={{
                                                    color: `var(--camp-${token}-ink)`,
                                                }}
                                            >
                                                {name}
                                            </h4>
                                            <p className="mt-2 max-w-[46ch] text-sm leading-relaxed">
                                                {description}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section aria-labelledby="study-axes">
                <Separator className="mb-6" />
                <h2 id="study-axes" className={sectionHeading}>
                    {axesCopy.heading}
                </h2>
                <p className="mt-3 max-w-[66ch] leading-relaxed text-muted-foreground">
                    {axesCopy.introduction}
                </p>
                <div
                    className="mt-7 grid gap-x-8 gap-y-5 md:grid-cols-3 md:grid-rows-[auto_repeat(var(--axis-rows),auto)] md:gap-y-0"
                    style={{ '--axis-rows': axisRows } as CSSProperties}
                >
                    {axisGroups.map(({ heading, axes, description }) => (
                        <div
                            key={heading}
                            className="min-w-0 md:row-span-full md:grid md:grid-rows-subgrid"
                        >
                            <div>
                                <Separator />
                                <h3 className="pt-3 font-heading text-2xl">
                                    {heading}
                                </h3>
                                {description && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {description}
                                    </p>
                                )}
                            </div>
                            <AxisDefinitions
                                axes={axes}
                                names={axesCopy.axes}
                                descriptions={axisDescriptions}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
