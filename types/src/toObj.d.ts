export = toObj;
/**
 * Simplify JS object
 * - removes and joins `_text` properties
 * - converts Numbers and Boolean values
 * @param {object} obj
 * @param {object} [opts]
 * @param {object} [opts.attrs] if `false` ignore _attrs properties
 * @param {object} [opts.elems] if `false` ignore _elem properties
 * @returns {object}
 */
declare function toObj(obj: object, opts?: {
    attrs?: object;
    elems?: object;
} | undefined): object;
