# xml-vs-js

> Convert XML/ HTML to Javascript and vice versa

[![NPM version](https://badge.fury.io/js/xml-vs-js.svg)](https://www.npmjs.com/package/xml-vs-js/)
[![Build Status](https://github.com/commenthol/xml-vs-js/workflows/CI/badge.svg?branch=master&event=push)](https://github.com/commenthol/xml-vs-js/actions/workflows/ci.yml?query=branch%3Amaster)

Features:
- Uses [htmlparser2][] to convert from xml to js.
- Processes html as well as xml - default is `xmlMode=true`.
- Respects order of elements with `_elems` array.
- Intented for manipulating/ parsing feeds or xml files where a full DOM is not required.
- Usage of plain JSON object for easy storage.
- Handles different xml namespaces.

Why another xml to js converter?

[xml-js][] uses sax for xml conversion which requires valid xml as input.
For manipulation of xml files where input and output is xml, the compact format
does not respect the correct order of elements.
Non-compact mode on the other hand is cumbersome for access of nodes.
I wanted to have same JSON format for in- and output.

For syntax of the Js Object please refer to the test fixtures in `./test/fixtures`

## Table of Contents

<!-- !toc (minlevel=2 omit="Table of Contents") -->

* [Conversion from XML to Js](#conversion-from-xml-to-js)
  * [Example toJs](#example-tojs)
  * [Promises API](#promises-api)
* [Conversion from Js to XML](#conversion-from-js-to-xml)
  * [Example toXml](#example-toxml)
  * [Promises API](#promises-api-1)
  * [Example toXml with order of elems](#example-toxml-with-order-of-elems)
* [Simplify object](#simplify-object)
* [License](#license)
* [References](#references)

<!-- toc! -->

## Conversion from XML to Js

```js
toJs(xml, opts, (err, obj) => {})
```

- see <https://github.com/fb55/htmlparser2/wiki/Parser-options>
- `{String} xml`
- `{Object} [opts]` - htmlparser2 options
- `{Object} [opts.xmlMode=true]` - xmlMode is set by default; Set to `false` for html
- `{Object} [opts.decodeEntities=false]` - decode entities
- `{Object} [opts.recognizeSelfClosing=true]` - recognize self closing tags in html
- `{Object} [opts.recognizeCDATA=true]` - recognize CDATA tags in html
- `{Boolean} [opts.elems]` - set to `false` if output shall not contain `_elems` fields; order of xml elements is not guarateed any longer.
- `{Boolean} [opts.attrs]` - set to `false` if output shall not contain any attributes `_attrs` fields;
- `{Boolean} [opts.ns]` - set to `false` if output shall not contain any namespace `_ns` fields;
- `{Function} cb` - `callback(err, obj)`

### Example toJs

```js
const {toJs} = require('xml-vs-js')

const xml = `
<?xml version="1.0" encoding=utf-8 ?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example Feed</title>
  <entry>
    <title>Entry</title>
    <link href="http://example.org/2003/12/13/atom03" />
    <link rel="alternate" type="text/html" href="http://example.org/2003/12/13/atom03.html"/>
  </entry>
  <entry>
    <title>Update</title>
  </entry>
</feed>
`

toJs(xml, (err, obj) => {
  console.log(obj)
  /*
  {
    _elems: ['_PROCESSING', 'feed'],
    _PROCESSING: {
      _text: '?xml version="1.0" encoding=utf-8 ?'
    },
    feed: {
      _attrs: {
        xmlns: 'http://www.w3.org/2005/Atom'
      },
      _elems: ['title', 'entry', 'entry'],
      title: {
        _elems: ['_text'],
        _text: 'Example Feed'
      },
      entry: [{
        _elems: ['title', 'link', 'link'],
        title: {
          _elems: ['_text'],
          _text: 'Entry'
        },
        link: [{
          _attrs: {
            href: 'http://example.org/2003/12/13/atom03'
          }
        }, {
          _attrs: {
            rel: 'alternate',
            type: 'text/html',
            href: 'http://example.org/2003/12/13/atom03.html'
          }
        }]
      }, {
        _elems: ['title'],
        title: {
          _elems: ['_text'],
          _text: 'Update'
        }
      }]
    }
  }
*/    
})
```

### Promises API

```js
const {toJs} = require('xml-vs-js/promises')

const obj = await toJs(xml, opts)
```

## Conversion from Js to XML

```js
toXml(obj, opts, (err, xml) => {})
```

- `{Object} obj` - the object to convert to xml
- `{Object} [opts]` - options
- `{Boolean} [opts.xmlMode=true]` - xmlMode is set by default; Set to `false` for html
- `{Boolean} [opts.encodeEntities=false]` - encode entities

### Example toXml

> **Note:** `_elems` are optional. In case the field is missing the order of elements returned with `Object.keys()` is used.

```js
const {toXml} = require('xml-vs-js')

const obj = {
  root: {
    _COMMENT: ' example wo order of elements ',
    section: {
      _attrs: { class: 'blue' },
      span: ['one', 'four'],
      _text: 'three',
      strong: 'two'
    }
  }
}
toXml(obj, (err, xml) => {
  console.log(xml)
  // <root>
  //  <!-- example wo order of elements -->
  //  <section class="blue">
  //  <span>one</span><span>four</span>three<strong>two</strong>
  //  </section>
  // </root>
})
```

### Promises API

```js
const {toXml} = require('xml-vs-js/promises')

const xml = await toXml(obj, opts)
```

### Example toXml with order of elems

```js
const {toXml} = require('xml-vs-js')

const obj = {
  _PROCESSING: {
    _text: '?xml version="1.0" encoding="utf-8"?'
  },
  root: {
    section: {
      _elems: ['span', 'strong', '_text', 'span'],
      span: ['one', 'four'],
      _text: 'three',
      strong: 'two'
    }
  }
}
toXml(obj, (err, xml) => {
  console.log(xml)
  // <?xml version="1.0" encoding="utf-8"?>
  // <root>
  //  <section>
  //  <span>one</span><strong>two</strong>three<span>four</span>
  //  </section>
  // </root>
})
```

## Simplify object

```js
toObj(obj, opts)
```

- `{Object} obj` - the object to simplify
- `{Object} [opts]` - options
- `{Boolean} [opts.elems]` - if `false` remove all _elems props
- `{Boolean} [opts.attrs]` - if `false` remove all _attrs props
- `{Boolean} [opts.ns]` - if `false` remove all _ns props


To further simplify the object structure from `toJS` use the `toObj` method:

```js
const {toJs, toObj} = require('../promises.js')

const xml = `
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Example Feed</title>
  <entry>
    <title>Entry</title>
    <link href="http://example.org/2003/12/13/atom03" />
    <link rel="alternate" type="text/html" href="http://example.org/2003/12/13/atom03.html"/>
  </entry>
  <entry>
    <title>Update</title>
  </entry>
</feed>
`

const obj = await toJs(xml)
const simple = toObj(obj, {elems: false, attrs: true})
console.log(simple)
/*
{
  feed: {
    _attrs: { xmlns: 'http://www.w3.org/2005/Atom' },
    title: 'Example Feed',
    entry: [
      {
        title: 'Entry',
        link: [
          { _attrs: { href: 'http://example.org/2003/12/13/atom03' } },
          {
            _attrs: {
              rel: 'alternate',
              type: 'text/html',
              href: 'http://example.org/2003/12/13/atom03.html'
            }
          }
        ]
      },
      { title: 'Update' }
    ]
  }
}
*/
```

## License

Unlicense <https://unlicense.org>

## References

- [htmlparser2][]
- [xml-js][]

[htmlparser2]: https://www.npmjs.com/package/htmlparser2
[xml-js]: https://www.npmjs.com/package/xml-js
