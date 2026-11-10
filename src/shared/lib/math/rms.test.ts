import { expect, test } from 'vitest';
import { rms } from './rms';

test.each([
    [[-3, -4], Math.sqrt(12.5)],
    [[300, 400], Math.sqrt(125_000)],
    [[3, 4], Math.sqrt(12.5)],
    [[-3, 4], Math.sqrt(12.5)],
    [[0, 0, 0], 0],
    [[0, 0, 6], Math.sqrt(12)],
    [[7], 7],
    [[-7], 7],
    [[-5, 5, -5, 5], 5],
    [[0.3, 0.4], Math.sqrt(0.125)],
    [[1, 2, 3, 4, 5], Math.sqrt(11)],
])('rms(%j)', (values, expected) => {
    expect(rms(values)).toBeCloseTo(expected, 10);
});

test('does not mutate the input', () => {
    const values = [-3, 0, 4];
    const original = [...values];
    rms(values);
    expect(values).toEqual(original);
});
