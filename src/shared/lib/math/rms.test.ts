import { describe, expect, test } from 'vitest';
import { rms } from '@/shared/lib/math';

describe('rms', () => {
    // Independent worked expectations; no production function computes them.
    test.each([
        { values: [0, 0, 0], expected: 0 },
        { values: [7], expected: 7 },
        { values: [-7], expected: 7 },
        { values: [3, 3, 3], expected: 3 },
        { values: [-5, 5, -5, 5], expected: 5 },
        { values: [0, 0, 6, 0], expected: 3 },
        { values: [0, 10, -20, 20], expected: 15 },
        { values: [3, 4], expected: 3.5355339059327378 },
        { values: [-3, 4], expected: 3.5355339059327378 },
        { values: [0.3, 0.4], expected: 0.3535533905932738 },
        { values: [300, 400], expected: 353.5533905932738 },
    ])('rms($values) = $expected', ({ values, expected }) => {
        expect(rms(values)).toBeCloseTo(expected, 10);
    });

    test('reordering preserves the result without mutating inputs', () => {
        const values = [0, 10, -20, 20];
        const original = [...values];
        expect(rms(values)).toBe(15);
        expect(rms(values.toReversed())).toBe(15);
        expect(values).toEqual(original);
    });
});
