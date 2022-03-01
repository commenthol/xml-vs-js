const BOOLEAN = ['true', 'false']

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
function toObj (obj, opts) {
  const type = Object.prototype.toString.call(obj)
  switch (type) {
    case '[object Array]': {
      return obj.map(item => toObj(item, opts))
    }
    case '[object Object]': {
      if (opts?.attrs === false) {
        const { _attrs, ...other } = obj
        obj = other
      }
      if (opts?.elems === false) {
        const { _elems, ...other } = obj
        obj = other
      }
      const { length } = Object.keys(obj)
      if (length === 1 && obj._text) {
        const text = Array.isArray(obj._text)
          ? obj._text.join('')
          : obj._text
        return toObj(text)
      } else {
        return Object.entries(obj).reduce((o, [k, v]) => {
          o[k] = toObj(v, opts)
          return o
        }, {})
      }
    }
    default:
      if (BOOLEAN.includes(obj)) {
        return obj === 'true'
      }
      if (/^-?[0-9.]+$/.test(obj)) {
        return Number(obj)
      }
      return obj
  }
}

module.exports = toObj
