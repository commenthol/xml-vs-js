const assert = require('assert')
const {toJs} = require('..')
const log = require('debug')('test:toJs')
const fixtures = require('./fixtures/forJs.js')
const {serializeToModule} = require('serialize-to-js')
const fs = require('fs')

const WRITE = process.env.WRITE || false

function writeFixtures () {
  if (WRITE) {
    const data = serializeToModule(fixtures, {unsafe: true})
    fs.writeFileSync(`${__dirname}/fixtures/forJs.js`, data, 'utf8')
  }
}

function update (ref, data) {
  if (WRITE) ref.obj = data
}

const itt = (name, fn) => /^#skip/.test(name)
  ? it.skip(name, fn)
  : /^#only/.test(name)
    ? it.only(name, fn)
    : it(name, fn)

describe('toJs', function () {
  after(() => {
    writeFixtures()
  })
  Object.keys(fixtures).forEach(test => {
    itt(test, function (done) {
      const {xml, obj, opts} = fixtures[test]
      const fn = (err, data) => {
        log('%j', data)
        update(fixtures[test], data)
        assert.ok(!err)
        assert.deepEqual(data, obj)
        done()
      }
      if (opts) toJs(xml, opts, fn)
      else toJs(xml, fn)
    })
  })
})
