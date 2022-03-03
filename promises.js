const { promisify } = require('util')
const {
  toJs: toJsCb,
  toXml: toXmlCb,
  toObj,
  TEXT,
  ELEMS,
  ATTRIBS,
  PROCESSING,
  CDATA,
  COMMENT
} = require('./src/index.js')

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
const toJs = promisify(toJsCb)

/**
 * Convert js `obj` to <xml>
 * @param {Object} obj - the object to convert to xml
 * @param {Object} [opts] - options
 * @param {Boolean} [opts.xmlMode=true] - xmlMode is set by default; Set to `false` for html
 * @param {Boolean} [opts.encodeEntities=false] - encode entities
 * @return {Promise<string>}
 */
const toXml = promisify(toXmlCb)

module.exports = {
  toJs,
  toXml,
  toObj,
  TEXT,
  ELEMS,
  ATTRIBS,
  PROCESSING,
  CDATA,
  COMMENT
}
