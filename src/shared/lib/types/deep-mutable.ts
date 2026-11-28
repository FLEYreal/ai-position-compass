// Recursively removes readonly modifiers from objects, arrays, and tuples.
export type DeepMutable<T> =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends (...args: any[]) => any ? T
    : T extends object ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T;
