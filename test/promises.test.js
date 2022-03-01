const assert = require('assert')
const { toJs, toXml } = require('../promises.js')
const { itt } = require('./support/index.js')
const log = require('debug')('test:toJs')
const fixtures = require('./fixtures/forJs.js')
const fixturesXml = require('./fixtures/forXml.js')

describe('promises', function () {
  describe('toJs', function () {
    Object.keys(fixtures).forEach(test => {
      itt(test, async function () {
        const { xml, obj, opts } = fixtures[test]
        const data = opts
          ? await toJs(xml, opts)
          : await toJs(xml)
        log('%j', data)
        assert.deepStrictEqual(data, obj)
      })
    })
  })

  describe('toXml', function () {
    Object.keys(fixturesXml).forEach(test => {
      itt(test, async function () {
        const { xml, obj, opts } = fixturesXml[test]
        const data = opts
          ? await toXml(obj, opts)
          : await toXml(obj)
        log('%j', data)
        assert.deepStrictEqual(data, xml)
      })
    })
  })
})
