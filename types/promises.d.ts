import { toObj } from "./src/index.js";
import { TEXT } from "./src/index.js";
import { ELEMS } from "./src/index.js";
import { ATTRIBS } from "./src/index.js";
import { PROCESSING } from "./src/index.js";
import { CDATA } from "./src/index.js";
import { COMMENT } from "./src/index.js";
export declare const toJs: (arg1: string, arg2: {
    xmlMode?: any;
    decodeEntities?: any;
    recognizeSelfClosing?: any;
    recognizeCDATA?: any;
    elems?: boolean | undefined;
    attrs?: boolean | undefined;
    ns?: boolean | undefined;
} | undefined) => Promise<any>;
export declare const toXml: (arg1: any, arg2: {
    xmlMode?: boolean | undefined;
    encodeEntities?: boolean | undefined;
} | undefined) => Promise<any>;
export { toObj, TEXT, ELEMS, ATTRIBS, PROCESSING, CDATA, COMMENT };
