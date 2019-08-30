const { encodeXML, encodeHTML } = require('entities')
const voidElements = require('html-void-elements')

const escapeHTMLMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}
const escapeHTML = str => str
  .replace(/[&<>'"]/g, tag => escapeHTMLMap[tag])

const {
  TEXT,
  ELEMS,
  ATTRIBS,
  NAMESPACE,
  PROCESSING,
  CDATA,
  COMMENT
} = require('./common')

// default options
const OPTIONS = {
  xmlMode: true,
  encodeEntities: false
}

const buildAttribs = (attrs) => {
  if (!attrs || !Object.keys(attrs).length) {
    return ''
  }
  return ' ' + Object.keys(attrs)
    .map(attr => `${attr}="${attrs[attr]}"`)
    .join(' ')
}

const buildElems = (pointer) => {
  return Object.keys(pointer)
    .filter(n => n !== ATTRIBS && n !== NAMESPACE)
    .reduce((n, elem) => {
      if (Array.isArray(pointer[elem])) {
        pointer[elem].forEach(() => n.push(elem))
      } else {
        n.push(elem)
      }
      return n
    }, [])
}

const buildCounter = (elems) => {
  return elems.reduce((o, elem) => {
    o[elem] = 0
    return o
  }, {})
}

const toNs = ns => ns ? `${ns}:` : ''

const openTag = (elem, attrs, ns) => {
  const _elem = toNs(ns) + elem
  switch (elem) {
    case COMMENT:
      return '<!--'
    case CDATA:
      return '<![CDATA['
    case PROCESSING:
      return '<'
    default:
      return `<${_elem}${attrs}>`
  }
}

const closeTag = (elem, attrs, ns, selfClosing, opts) => {
  const _elem = toNs(ns) + elem
  switch (elem) {
    case COMMENT:
      return '-->'
    case CDATA:
      return ']]>'
    case PROCESSING:
      return '>\n'
    default:
      return !selfClosing
        ? `</${_elem}>`
        : !opts.xmlMode && ~voidElements.indexOf(_elem)
          ? `<${_elem}${attrs}>`
          : `<${_elem}${attrs}/>`
  }
}

/**
 * Convert js `obj` to <xml>
 * @param {Object} obj - the object to convert to xml
 * @param {Object} [opts] - options
 * @param {Boolean} [opts.xmlMode=true] - xmlMode is set by default; Set to `false` for html
 * @param {Boolean} [opts.encodeEntities=false] - encode entities
 */
function toXml (obj, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  const _opts = Object.assign({}, OPTIONS, opts)
  const out = []
  const pointers = []

  const encode = (type) => (
    [PROCESSING, COMMENT, CDATA].indexOf(type) !== -1
      ? val => val
      : !_opts.encodeEntities
        ? escapeHTML
        : _opts.xmlMode
          ? encodeXML
          : encodeHTML
  )

  const pushText = (val, type, lastElem) => {
    if (lastElem === TEXT && !/^\s/.test(val)) out.push(' ') // add whitespace if two text elems follow
    const text = encode(type)(String(val).replace(/&amp;/g, '&'))
    out.push(text)
  }

  function build (pointer, { type }) {
    let selfClosing = true
    if (pointers.indexOf(pointer) !== -1) {
      return selfClosing // circular ref detected
    }
    pointers.push(pointer)
    const _elems = pointer[ELEMS] || buildElems(pointer)
    const counter = buildCounter(_elems)

    let lastElem

    _elems.forEach(elem => {
      const ref = pointer[elem]
      if (!ref) return
      const val = Array.isArray(ref) ? ref[counter[elem]++] : ref

      if (elem === TEXT) {
        pushText(val, type, lastElem)
        selfClosing = false
      } else {
        const attrs = buildAttribs(ref._attrs)
        const ns = ref._ns
        out.push(openTag(elem, attrs, ns))
        selfClosing = false
        let _selfClosing = false
        if (typeof val === 'object') {
          _selfClosing = build(val, { type: elem })
          if (_selfClosing) out.pop()
        } else {
          pushText(val, type)
          selfClosing = false
        }
        out.push(closeTag(elem, attrs, ns, _selfClosing, _opts))
      }
      lastElem = elem
    })

    pointers.pop()
    return selfClosing
  }
  build(obj, {})

  cb(null, out.join(''))
}

module.exports = toXml
