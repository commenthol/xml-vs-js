/**
 * Convert xml/ html to js
 * @see https://github.com/fb55/htmlparser2/wiki/Parser-options
 * @param {String} xml
 * @param {Object} [opts] - htmlparser2 options
 * @param {Object} [opts.xmlMode=true] - xmlMode is set by default; Set to `false` for html
 * @param {Object} [opts.decodeEntities=false] - decode entities
 * @param {Object} [opts.recognizeSelfClosing=true] - recognize self closing tags in html
 * @param {Object} [opts.recognizeCDATA=true] - recognize CDATA tags in html
 * @param {Boolean} [opts.elems] - set to `false` if output shall not contain `_elems` fields; order of xml elements is not guarateed any longer.
 * @param {Boolean} [opts.attrs] - set to `false` if output shall not contain any attributes `_attrs` fields;
 * @param {Boolean} [opts.ns] - set to `false` if output shall not contain any namespace `_ns` fields;
 * @return {Promise<object>}
 */
export const toJs: (arg1: string, arg2: {
    xmlMode?: any;
    decodeEntities?: any;
    recognizeSelfClosing?: any;
    recognizeCDATA?: any;
    elems?: boolean | undefined;
    attrs?: boolean | undefined;
    ns?: boolean | undefined;
} | undefined) => Promise<any>;
/**
 * Convert js `obj` to <xml>
 * @param {Object} obj - the object to convert to xml
 * @param {Object} [opts] - options
 * @param {Boolean} [opts.xmlMode=true] - xmlMode is set by default; Set to `false` for html
 * @param {Boolean} [opts.encodeEntities=false] - encode entities
 * @return {Promise<string>}
 */
export const toXml: (arg1: any, arg2: {
    xmlMode?: boolean | undefined;
    encodeEntities?: boolean | undefined;
} | undefined) => Promise<any>;
import { toObj } from "./src/index.js";
import { TEXT } from "./src/index.js";
import { ELEMS } from "./src/index.js";
import { ATTRIBS } from "./src/index.js";
import { PROCESSING } from "./src/index.js";
import { CDATA } from "./src/index.js";
import { COMMENT } from "./src/index.js";
export { toObj, TEXT, ELEMS, ATTRIBS, PROCESSING, CDATA, COMMENT };
