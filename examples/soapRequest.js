const request = require('superagent')
// const { toXml, toJs, toObj } = require('xml-vs-js/promises')
const { toXml, toJs, toObj } = require('../promises')

const CRLF = '\r\n'
const XML_VERSION = '<?xml version="1.0" encoding="UTF-8" ?>' + CRLF

const soapRequest = async (method, args) => {
  const { url, SOAPAction, body, keys } = method(args)
  const xml = await toXml(body)

  return request.post(url)
    .set({
      'User-Agent': 'xml-vs-js/2',
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: `"${SOAPAction}"`
    })
    .send(XML_VERSION + xml + CRLF)
    .then(({ text }) => toJs(text, { elems: false, attrs: false, ns: false }))
    .then(obj => toObj(get(obj, keys)))
}

const toKeys = keys => {
  const _keys = (typeof keys === 'string')
    ? keys.split('.')
    : keys
  return ['Envelope', 'Body'].concat(_keys)
}

/**
 * @param {string} url soap url
 * @param {object} xmlns xml namespaces as {key: value}
 * @returns {Function}
 */
const soapEnvelope = (url, xmlns) =>
  /**
   * @param {object} param0
   * @param {string} param0.action soap action
   * @param {object} [param0.header] soap header
   * @param {object} [param0.body] soap body
   * @param {string|string[]} [param0.keys="Envelope.Body"] keys for obtinaing the response object
   * @returns {object}
   */
  ({ action, header = {}, body = {}, keys }) =>
    ({
      url,
      SOAPAction: action,
      body: {
        Envelope: {
          _ns: 'soapenv',
          _attrs: {
            'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
            ...xmlns
          },
          Header: {
            _ns: 'soapenv',
            ...header
          },
          Body: {
            _ns: 'soapenv',
            ...body
          }
        }
      },
      keys: toKeys(keys)
    })

const get = (obj, keys = [], def) => {
  let tmp = obj
  const _keys = (typeof keys === 'string')
    ? keys.split('.')
    : keys
  for (const key of _keys) {
    if (tmp?.[key]) {
      tmp = tmp[key]
    } else {
      return def
    }
  }
  return tmp
}

module.exports = { soapRequest, soapEnvelope }
