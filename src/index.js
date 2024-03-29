const toJs = require('./toJs')
const toXml = require('./toXml')
const toObj = require('./toObj')

const {
  TEXT,
  ELEMS,
  ATTRIBS,
  PROCESSING,
  CDATA,
  COMMENT
} = require('./common')

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
