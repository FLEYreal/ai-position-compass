import type { CSSProperties } from 'react';
import type { ResultCamp } from '../model/result-presentation';

export function campPalette({
    token,
}: Pick<ResultCamp, 'token'>): CSSProperties {
    return {
        '--result-camp-surface': `var(--camp-${token}-surface)`,
        '--result-camp-ink': `var(--camp-${token}-ink)`,
    } as CSSProperties;
}
