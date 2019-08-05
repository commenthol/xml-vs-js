const assert = require('assert')
const { toXml } = require('..')
const log = require('debug')('test:toXml')
const fixtures = require('./fixtures/forXml.js')
const serializeToModule = require('serialize-to-module')
const fs = require('fs')

const WRITE = process.env.WRITE || false

function writeFixtures () {
  if (WRITE) {
    const data = serializeToModule(fixtures, { unsafe: true })
    fs.writeFileSync(`${__dirname}/fixtures/forXml.js`, data, 'utf8')
  }
}

function update (ref, data) {
  if (WRITE) ref.xml = data
}

const itt = (name, fn) => /^#skip/.test(name)
  ? it.skip(name, fn)
  : /^#only/.test(name)
    ? it.only(name, fn)
    : it(name, fn)

describe('toXml', function () {
  after(() => {
    writeFixtures()
  })
  Object.keys(fixtures).forEach(test => {
    itt(test, function (done) {
      const { xml, obj, opts } = fixtures[test]
      const fn = (err, data) => {
        log('%j', data)
        update(fixtures[test], data)
        assert.ok(!err)
        assert.deepStrictEqual(data, xml)
        done()
      }
      if (opts) toXml(obj, opts, fn)
      else toXml(obj, fn)
    })
  })

  it('should ignore circular refs', function (done) {
    const obj = {
      root: {
        tag: {
          h1: [{
            _text: 'Hi'
          }, {
            _text: 'Ho'
          }]
        }
      }
    }
    obj.root.tag.circular = obj.root.tag
    const xml = '<root><tag><h1>Hi</h1><h1>Ho</h1><circular/></tag></root>'
    toXml(obj, (err, data) => {
      log('%j', data)
      assert.ok(!err)
      assert.deepStrictEqual(data, xml)
      done()
    })
  })
})
