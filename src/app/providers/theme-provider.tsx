import type { ReactNode } from 'react';
import { useTheme } from '@/shared/lib/theme';

/** Keeps the shared browser subscription alive across route changes. */
export function ThemeProvider({ children }: { children: ReactNode }) {
    useTheme();
    return children;
}
