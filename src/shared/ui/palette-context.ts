import { createContext } from 'react';

// React context survives Radix portals; CSS inheritance alone does not.
export const PaletteContext = createContext('');

export const paletteAliases =
    '[--primary:var(--ui-ink)] [--primary-foreground:var(--paper)] [--primary-hover-color:var(--ui-ink)] [--ring:var(--ui-ink)] [--accent:var(--ui-surface)] [--accent-foreground:var(--ui-ink)] [--secondary:var(--ui-surface)] [--secondary-foreground:var(--ui-ink)]';
