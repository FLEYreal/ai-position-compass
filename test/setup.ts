import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom does not implement the browser media-query API.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn((media: string) => ({
        matches: false,
        media,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    })),
});

afterEach(cleanup);
