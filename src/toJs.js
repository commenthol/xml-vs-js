const { Parser } = require('htmlparser2')
const {
  TEXT,
  ELEMS,
  ATTRIBS,
  NAMESPACE,
  PROCESSING,
  CDATA,
  COMMENT
} = require('./common')

// htmlparser2 default options
const OPTIONS = {
  xmlMode: true,
  recognizeSelfClosing: true,
  recognizeCDATA: true
}

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
 * @param {Function} cb - `callback(err, obj)`
 */
// @ts-ignore
function toJs (xml, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  const _opts = Object.assign({}, OPTIONS, opts)
  const out = {}
  const pointers = []
  let pointer = out

  const _ELEMS = _opts.elems !== undefined ? _opts.elems : ELEMS
  const _ATTRIBS = _opts.attrs !== undefined ? _opts.attrs : ATTRIBS
  const _NAMESPACE = _opts.ns !== undefined ? _opts.ns : NAMESPACE

  const elems = _ELEMS
    ? (pointer, name) => {
        // @ts-ignore
        if (!pointer[_ELEMS]) {
          // @ts-ignore
          pointer[_ELEMS] = []
        }
        // @ts-ignore
        pointer[_ELEMS].push(name)
      }
    : () => {}

  // @ts-ignore
  const lastElem = (pointer) => _ELEMS && pointer[_ELEMS] && pointer[_ELEMS][pointer[_ELEMS].length - 1]

  const stripNamespace = (name = '') => {
    const pos = name.indexOf(':')
    return (pos === -1)
      ? [name]
      : [name.substring(pos + 1), name.substring(0, pos)]
  }

  const namespace = _NAMESPACE
    ? (pointer, ns) => {
        // @ts-ignore
        if (ns) pointer[_NAMESPACE] = ns
      }
    : () => {}

  // htmlparser2 event callbacks
  const onopentag = (name, attribs = {}) => {
    const [_name, ns] = stripNamespace(name)
    name = _name

    pointers.push(pointer)
    elems(pointer, name)
    if (pointer[name]) {
      if (!Array.isArray(pointer[name])) {
        const tmp = pointer[name]
        pointer[name] = [tmp]
      }
      const newPointer = {}
      pointer[name].push(newPointer)
      pointer = newPointer
    } else {
      pointer[name] = {}
      pointer = pointer[name]
    }
    namespace(pointer, ns)
    if (_ATTRIBS && Object.keys(attribs).length) pointer[_ATTRIBS] = attribs
  }
  const ontext = (text) => {
    const last = lastElem(pointer)
    if (last === TEXT || !/^\s*$/.test(text)) {
      if (pointer[TEXT]) {
        if (last === TEXT) {
          if (Array.isArray(pointer[TEXT])) {
            elems(pointer, TEXT)
            pointer[TEXT].push(text)
          } else {
            pointer[TEXT] += text
          }
        } else {
          if (!Array.isArray(pointer[TEXT])) {
            pointer[TEXT] = [pointer[TEXT]]
          }
          elems(pointer, TEXT)
          pointer[TEXT].push(text)
        }
      } else {
        elems(pointer, TEXT)
        pointer[TEXT] = text
      }
    }
  }
  // @ts-ignore
  const onclosetag = (name) => {
    pointer = pointers.pop()
  }
  const oncomment = (data) => {
    onopentag(COMMENT)
    ontext(data)
  }
  const oncommentend = () => {
    onclosetag(COMMENT)
  }
  // @ts-ignore
  const onprocessinginstruction = (name, data) => {
    onopentag(PROCESSING)
    pointer[TEXT] = data // TODO should split up attribs and elem
    onclosetag(PROCESSING)
  }
  const oncdatastart = () => {
    onopentag(CDATA)
  }
  const oncdataend = () => {
    onclosetag(CDATA)
  }
  const onend = () => {
    cb(null, out)
  }
  const onerror = (err) => {
    // istanbul ignore next
    cb(err, out)
  }

  const parser = new Parser({
    onopentag,
    ontext,
    onclosetag,
    oncomment,
    oncommentend,
    onprocessinginstruction,
    oncdatastart,
    oncdataend,
    onend,
    onerror
  }, _opts)

  parser.write(xml)
  parser.end()
}

module.exports = toJs
