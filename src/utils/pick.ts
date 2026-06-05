/**
 * Pick a subset of fields from an object (e.g. from req.query).
 * Only keys present in the `keys` array are returned.
 *
 * @example
 *   pick(req.query, ['page', 'limit', 'sortBy'])
 */
const pick = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[],
): Partial<Pick<T, K>> => {
    const finalObj: Partial<Pick<T, K>> = {};
    for (const key of keys) {
        if (obj[key] !== undefined) {
            finalObj[key] = obj[key];
        }
    }
    return finalObj;
};

export default pick;
