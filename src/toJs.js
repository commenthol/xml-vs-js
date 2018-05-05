const {Parser} = require('htmlparser2')
const {
  TEXT,
  ELEMS,
  ATTRIBS,
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
 * @param {Function} cb - `callback(err, obj)`
 */
function toJs (xml, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  const _opts = Object.assign({}, OPTIONS, opts)
  const out = {}
  const pointers = []
  let pointer = out

  const _ELEMS = _opts.elems !== undefined ? opts.elems : ELEMS
  const _ATTRIBS = _opts.attrs !== undefined ? opts.attrs : ATTRIBS

  const elems = _ELEMS
    ? (pointer, name) => {
      if (!pointer[_ELEMS]) {
        pointer[_ELEMS] = []
      }
      pointer[_ELEMS].push(name)
    }
    : () => {}
  const lastElem = (pointer) => _ELEMS && pointer[_ELEMS] && pointer[_ELEMS][pointer[_ELEMS].length - 1]

  // htmlparser2 event callbacks
  const onopentag = (name, attribs = {}) => {
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
    if (_ATTRIBS && Object.keys(attribs).length) pointer[_ATTRIBS] = attribs
  }
  const ontext = (text) => {
    const last = lastElem(pointer)
    if (last === TEXT || !/^\s*$/.test(text)) {
      if (pointer[TEXT]) {
        if (last === TEXT) {
          // if (!Array.isArray(pointer[TEXT])) {
          pointer[TEXT] += text
          // } else {
          //   const l = pointer[TEXT].length - 1
          //   pointer[TEXT][l] += text
          // }
        } else {
          if (!Array.isArray(pointer[TEXT])) pointer[TEXT] = [pointer[TEXT]]
          elems(pointer, TEXT)
          pointer[TEXT].push(text)
        }
      } else {
        elems(pointer, TEXT)
        pointer[TEXT] = text
      }
    }
  }
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
