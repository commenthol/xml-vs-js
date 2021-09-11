const m = {
  attribute: {
    xml: '<root length="12345"/>',
    obj: {
      _elems: ['root'],
      root: {
        _attrs: {
          length: '12345'
        }
      }
    }
  },
  'attribute no space': {
    xml: '<root attr1="first" attr2="second"/>',
    obj: {
      _elems: ['root'],
      root: {
        _attrs: {
          attr1: 'first',
          attr2: 'second'
        }
      }
    }
  },
  'attribute unquoted': {
    xml: '<root attr1="first" attr2="second"/>',
    obj: {
      _elems: ['root'],
      root: {
        _attrs: {
          attr1: 'first',
          attr2: 'second'
        }
      }
    }
  },
  text: {
    xml: '<root>a b </root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['_text'],
        _text: 'a b '
      }
    }
  },
  'text with tag in between': {
    xml: '<root>a<tag class="b">c</tag>d</root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['_text', 'tag', '_text'],
        _text: ['a', 'd'],
        tag: {
          _attrs: {
            class: 'b'
          },
          _elems: ['_text'],
          _text: 'c'
        }
      }
    }
  },
  'text with tags': {
    xml: '<root><tag class="a"><tag>b</tag>c</tag></root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['tag'],
        tag: {
          _attrs: {
            class: 'a'
          },
          _elems: ['tag', '_text'],
          tag: {
            _elems: ['_text'],
            _text: 'b'
          },
          _text: 'c'
        }
      }
    }
  },
  'text with tags array - html': {
    opts: {
      xmlMode: false
    },
    xml: '<root><meta charset="UTF-8"><tag>a</tag><tag>b</tag><br><inter/><tag>c</tag></root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['meta', 'tag', 'tag', 'br', 'inter', 'tag'],
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
        br: {},
        inter: {}
      }
    }
  },
  'text with tags array - xml': {
    xml: '<root><meta charset="UTF-8"/><tag>a</tag><tag>b</tag><br/><inter/><tag>c</tag></root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['meta', 'tag', 'tag', 'br', 'inter', 'tag'],
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
        br: {},
        inter: {}
      }
    }
  },
  entities: {
    opts: {
      xmlMode: false,
      encodeEntities: true
    },
    xml: '<r>&rfloor; &spades; &copy; &rarr; &amp; &lt; &lt; &lt; &lt; &gt; &real; &weierp; &euro;</r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_text'],
        _text: '⌋ ♠ © → & < < < < > ℜ ℘ €'
      }
    }
  },
  'no entities encoding': {
    opts: {
      xmlMode: false,
      encodeEntities: false
    },
    xml: '<r>⌋ ♠ © → &amp; &lt; &lt; &lt; &lt; &gt; ℜ ℘ €</r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_text'],
        _text: '⌋ ♠ © → & < < < < > ℜ ℘ €'
      }
    }
  },
  'no double &amp; encoding': {
    opts: {
      encodeEntities: false
    },
    xml: '<r>&amp;</r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_text'],
        _text: '&amp;'
      }
    }
  },
  'no double &amp; encoding (encodeEntities)': {
    opts: {
      encodeEntities: true
    },
    xml: '<r>&amp;</r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_text'],
        _text: '&amp;'
      }
    }
  },
  'xml entities': {
    opts: {
      encodeEntities: true
    },
    xml: '<r>&quot; &#xa9; &amp; &lt; &lt; &lt; &lt; &gt; &apos;</r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_text'],
        _text: "\" © & < < < < > '"
      }
    }
  },
  comment: {
    xml: '<root><tag/><!-- comment \n over \n some \n lines --></root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['tag', '_COMMENT'],
        tag: {},
        _COMMENT: {
          _elems: ['_text'],
          _text: ' comment \n over \n some \n lines '
        }
      }
    }
  },
  comments: {
    xml: '<root><tag/><!-- a --><!-- b --></root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['tag', '_COMMENT', '_COMMENT'],
        tag: {},
        _COMMENT: [{
          _elems: ['_text'],
          _text: ' a '
        }, {
          _elems: ['_text'],
          _text: ' b '
        }]
      }
    }
  },
  processing: {
    xml: '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><title>Uploads from everyone</title></feed>',
    obj: {
      _elems: ['_PROCESSING', 'feed'],
      _PROCESSING: {
        _text: '?xml version="1.0" encoding="utf-8" standalone="yes"?'
      },
      feed: {
        _attrs: {
          xmlns: 'http://www.w3.org/2005/Atom',
          'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
        },
        _elems: ['title'],
        title: {
          _elems: ['_text'],
          _text: 'Uploads from everyone'
        }
      }
    }
  },
  cdata: {
    xml: '<r><![CDATA[ this is character data  <pre>a</pre> ]]></r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_CDATA'],
        _CDATA: {
          _elems: ['_text'],
          _text: ' this is character data  <pre>a</pre> '
        }
      }
    }
  },
  'cdata as comment': {
    opts: {
      xmlMode: false
    },
    xml: '<r><!--[CDATA[ this is character data  <pre>a</pre> ]]--></r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_COMMENT'],
        _COMMENT: {
          _elems: ['_text'],
          _text: '[CDATA[ this is character data  <pre>a</pre> ]]'
        }
      }
    }
  },
  'no _elems': {
    opts: {
      elems: null
    },
    xml: '<root><a>1</a><a>2</a><a>3</a><a>4</a></root>',
    obj: {
      root: {
        a: [{
          _text: '1'
        }, {
          _text: '2'
        }, {
          _text: '3'
        }, {
          _text: '4'
        }]
      }
    }
  },
  'no _elems and _attrs': {
    opts: {
      elems: null,
      attrs: null
    },
    xml: '<root>do not overwrite<a>1</a><a>2</a><a>3</a><a>4</a></root>',
    obj: {
      root: {
        _text: ['do', 'not', 'overwrite'],
        a: [{
          _text: '1'
        }, {
          _text: '2'
        }, {
          _text: '3'
        }, {
          _text: '4'
        }]
      }
    }
  },
  'xml with doctype': {
    xml: '<?xml version="1.0"?>\n<!DOCTYPE EMail PUBLIC "-//EMail Solutions//DTD EMail V 1.0//EN"\n  "http://www.example.org/dtds/email.dtd">\n<Greeting>Hello World</Greeting>',
    obj: {
      _elems: ['_PROCESSING', '_PROCESSING', 'Greeting'],
      _PROCESSING: [{
        _text: '?xml version="1.0"?'
      }, {
        _text: '!DOCTYPE EMail PUBLIC "-//EMail Solutions//DTD EMail V 1.0//EN"\n  "http://www.example.org/dtds/email.dtd"'
      }],
      Greeting: {
        _elems: ['_text'],
        _text: 'Hello World'
      }
    }
  },
  '#skip FAILS xml with doctype and element': {
    xml: '<?xml version="1.0"?>\n<!DOCTYPE Greeting [\n  <!ELEMENT Greeting (#PCDATA)>\n\n]>;\n<Greeting>Hello World</Greeting>',
    obj: {
      _elems: ['_PROCESSING', '_PROCESSING', '_text', 'Greeting'],
      _PROCESSING: [{
        _text: '?xml version="1.0"?'
      }, {
        _text: '!DOCTYPE Greeting [\n  <!ELEMENT Greeting (#PCDATA)'
      }],
      _text: '\n]>\n',
      Greeting: {
        _elems: ['_text'],
        _text: 'Hello World'
      }
    }
  },
  'should ignore not existing element in _elems': {
    xml: '<root><tag/></root>',
    obj: {
      _elems: ['root'],
      root: {
        _elems: ['tag', 'notthere'],
        tag: {}
      }
    }
  },
  'should treat string as _text': {
    xml: '<root>is a string</root>',
    obj: {
      root: 'is a string'
    }
  },
  'should treat array of strings as _text': {
    xml: '<root><text>one</text><text>2</text></root>',
    obj: {
      root: {
        text: ['one', 2]
      }
    }
  },
  'should ignore undefined tag': {
    xml: '<root/>',
    obj: {
      root: {
        tag: null
      }
    }
  },
  'should ignore empty array': {
    xml: '<root/>',
    obj: {
      root: {
        tag: []
      }
    }
  },
  'should ignore elements not given in _elems array': {
    xml: '<root><tag>a</tag></root>',
    obj: {
      root: {
        _elems: ['tag'],
        tag: [{
          _text: 'a'
        }, {
          _text: 'b'
        }]
      }
    }
  },
  example: {
    xml: '<root><!-- example wo order of elements --><section class="blue"><span>one</span><span>four</span>three<strong>two</strong></section></root>',
    obj: {
      root: {
        _COMMENT: ' example wo order of elements ',
        section: {
          _attrs: {
            class: 'blue'
          },
          span: ['one', 'four'],
          _text: 'three',
          strong: 'two'
        }
      }
    }
  },
  'example with order': {
    xml: '<?xml version="1.0" encoding="utf-8"?>\n<root><section><span>one</span><strong>two</strong>three<span>four</span></section></root>',
    obj: {
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
  },
  namespaces: {
    opts: {},
    xml: '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n<atom:feed xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><atom:title>Uploads from everyone</atom:title><dc:author>Me Myself</dc:author></atom:feed>',
    obj: {
      _PROCESSING: {
        _text: '?xml version="1.0" encoding="utf-8" standalone="yes"?'
      },
      feed: {
        _ns: 'atom',
        _attrs: {
          'xmlns:atom': 'http://www.w3.org/2005/Atom',
          'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
        },
        title: {
          _ns: 'atom',
          _text: 'Uploads from everyone'
        },
        author: {
          _ns: 'dc',
          _text: 'Me Myself'
        }
      }
    }
  }
}
module.exports = m
