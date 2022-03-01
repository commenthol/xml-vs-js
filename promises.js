const { promisify } = require('util')
const {
  toJs,
  toXml,
  toObj,
  TEXT,
  ELEMS,
  ATTRIBS,
  PROCESSING,
  CDATA,
  COMMENT
} = require('./src/index.js')

module.exports = {
  toJs: promisify(toJs),
  toXml: promisify(toXml),
  toObj,
  TEXT,
  ELEMS,
  ATTRIBS,
  PROCESSING,
  CDATA,
  COMMENT
}
