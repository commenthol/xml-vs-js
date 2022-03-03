export = toXml;
/**
 * Convert js `obj` to <xml>
 * @param {Object} obj - the object to convert to xml
 * @param {Object} [opts] - options
 * @param {Boolean} [opts.xmlMode=true] - xmlMode is set by default; Set to `false` for html
 * @param {Boolean} [opts.encodeEntities=false] - encode entities
 * @param {Function} cb - `callback(err, obj)`
 */
declare function toXml(obj: any, opts?: {
    xmlMode?: boolean | undefined;
    encodeEntities?: boolean | undefined;
} | undefined, cb: Function): void;
