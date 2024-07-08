/**
 * Returns a random element from the given array.
 * @template T
 * @param {T[]} array - The array to get a random element from.
 * @returns {T} A random element from the array.
 */
export function getRandomElement<T>(array: T[]): T | undefined {
    return array[Math.floor(Math.random() * array.length)];
}