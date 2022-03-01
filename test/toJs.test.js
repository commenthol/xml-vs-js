const assert = require('assert')
const { toJs } = require('..')
const log = require('debug')('test:toJs')
const fixtures = require('./fixtures/forJs.js')
const serializeToModule = require('serialize-to-module')
const { itt } = require('./support/index.js')
const fs = require('fs')
const path = require('path')

const WRITE = process.env.WRITE || false

function writeFixtures () {
  if (WRITE) {
    const data = serializeToModule(fixtures, { unsafe: true })
    fs.writeFileSync(path.resolve(__dirname, 'fixtures/forJs.js'), data, 'utf8')
  }
}

function update (ref, data) {
  if (WRITE) ref.obj = data
}

describe('toJs', function () {
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
        assert.deepStrictEqual(data, obj)
        done()
      }
      if (opts) toJs(xml, opts, fn)
      else toJs(xml, fn)
    })
  })
})
