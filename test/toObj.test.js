const assert = require('assert')
const { toObj } = require('..')

describe('toObj', function () {
  it('shall simplify _text', function () {
    assert.strictEqual(
      toObj({ _text: ['test ', '&', ' debug'] }),
      'test & debug'
    )
  })
  it('shall convert boolean _text', function () {
    assert.strictEqual(
      toObj({ _text: 'true' }),
      true
    )
  })
  it('shall convert numbered _text ', function () {
    assert.strictEqual(
      toObj({ _text: '3.1415' }),
      3.1415
    )
  })
  it('shall convert numbered _text negative number', function () {
    assert.strictEqual(
      toObj({ _text: '-12.34' }),
      -12.34
    )
  })
  it('elems=false', function () {
    assert.deepStrictEqual(
      toObj({
        _elems: ['root'],
        root: {
          _elems: ['meta', 'tag', 'tag', 'inter', 'tag'],
          meta: {
            _attrs: {
              charset: 'UTF-8'
            }
          },
          tag: [{
            _elems: ['_text'],
            _text: 'a'
          }, {
            _elems: ['_text'],
            _text: 'b'
          }, {
            _elems: ['_text'],
            _text: 'c'
          }],
          inter: {}
        }
      }, { elems: false }),
      {
        root: {
          inter: {},
          meta: {
            _attrs: {
              charset: 'UTF-8'
            }
          },
          tag: ['a', 'b', 'c']
        }
      }
    )
  })
  it('elems=false attrs=false', function () {
    assert.deepStrictEqual(
      toObj({
        _elems: ['root'],
        root: {
          _elems: ['meta', 'tag', 'tag', 'inter', 'tag'],
          meta: {
            _attrs: {
              charset: 'UTF-8'
            }
          },
          tag: [{
            _elems: ['_text'],
            _text: 'a'
          }, {
            _elems: ['_text'],
            _text: 'b'
          }, {
            _elems: ['_text'],
            _text: 'c'
          }],
          inter: {}
        }
      }, { elems: false, attrs: false }),
      {
        root: {
          inter: {},
          meta: {},
          tag: ['a', 'b', 'c']
        }
      }
    )
  })
})
