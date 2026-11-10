// Calculate root mean square from the set of numbers.
export function rms(set: number[]) {
    return Math.sqrt(
        set.reduce((total, v) => {
            return total + v ** 2;
        }, 0) / set.length,
    );
}
