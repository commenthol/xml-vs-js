module.exports = {
  attribute: {
    xml: "<root length='12345'></root>",
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
    xml: '<root attr1="first"attr2="second"/>',
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
    xml: '<root attr1=first attr2=second />',
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
    xml: '<root><meta charset="UTF-8"><tag>a</tag><tag>b</tag><br/><inter/><tag>c</tag></root>',
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
    xml: '<root><meta charset="UTF-8"/><tag>a</tag><tag>b</tag><inter/><tag>c</tag></root>',
    obj: {
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
    }
  },
  'html entities': {
    opts: {
      xmlMode: false,
      decodeEntities: true
    },
    xml: '<r>&rfloor; &spades; &copy; &rarr; &amp; &lt; < < < &gt; &real; &weierp; &euro;</r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_text'],
        _text: '⌋ ♠ © → & < < < < > ℜ ℘ €'
      }
    }
  },
  'xml entities': {
    opts: {
      decodeEntities: true
    },
    xml: '<r>&quot; &#169; &amp; &lt; < < < &gt; &apos;</r>',
    obj: {
      _elems: ['r'],
      r: {
        _elems: ['_text'],
        _text: '" © & < < < < > \''
      }
    }
  },
  comment: {
    xml: '<root><tag></tag><!-- comment \n over \n some \n lines --></root>',
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
    xml: '<root><tag></tag><!-- a --><!-- b --></root>',
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
    xml: '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n<feed xmlns="http://www.w3.org/2005/Atom"\n      xmlns:dc="http://purl.org/dc/elements/1.1/">\n  <title>Uploads from everyone</title>\n</feed>',
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
      xmlMode: false,
      recognizeCDATA: false
    },
    xml: '<r><![CDATA[ this is character data  <pre>a</pre> ]]></r>',
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
    xml: '<root>do<a b=1>1</a><a c=2>2</a>not<a d=3>3</a><a e=4>4</a>overwrite</root>',
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
    xml: '<?xml version="1.0"?>\n<!DOCTYPE EMail PUBLIC "-//EMail Solutions//DTD EMail V 1.0//EN"\n  "http://www.example.org/dtds/email.dtd">\n<Greeting>Hello World</Greeting>\n',
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
  'xml with doctype and element': {
    xml: '<?xml version="1.0"?>\n<!DOCTYPE Greeting [\n  <!ELEMENT Greeting (#PCDATA)>\n]>\n<Greeting>Hello World</Greeting>\n',
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
  'example feed': {
    xml: `<?xml version="1.0" encoding=utf-8 ?>
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
    </feed>`,
    obj: {
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
  },
  namespace: {
    opts: {
      elems: false
    },
    xml: `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
    <atom:feed xmlns:atom="http://www.w3.org/2005/Atom">
      <atom:title>Uploads from everyone</atom:title>
    </atom:feed>`,
    obj: {
      _PROCESSING: {
        _text: '?xml version="1.0" encoding="utf-8" standalone="yes"?'
      },
      feed: {
        _ns: 'atom',
        _attrs: {
          'xmlns:atom': 'http://www.w3.org/2005/Atom'
        },
        title: {
          _ns: 'atom',
          _text: 'Uploads from everyone'
        }
      }
    }
  },
  namespaces: {
    opts: {
      elems: false
    },
    xml: `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
    <atom:feed xmlns:atom="http://www.w3.org/2005/Atom"
      xmlns:dc="http://purl.org/dc/elements/1.1/">
      <atom:title>Uploads from everyone</atom:title>
      <dc:author>Me Myself</dc:author>
    </atom:feed>`,
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
  },
  'disable namespaces in output': {
    opts: {
      elems: false,
      ns: false
    },
    xml: `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
    <atom:feed xmlns:atom="http://www.w3.org/2005/Atom"
      xmlns:dc="http://purl.org/dc/elements/1.1/">
      <atom:title>Uploads from everyone</atom:title>
      <dc:author>Me Myself</dc:author>
    </atom:feed>`,
    obj: {
      _PROCESSING: {
        _text: '?xml version="1.0" encoding="utf-8" standalone="yes"?'
      },
      feed: {
        _attrs: {
          'xmlns:atom': 'http://www.w3.org/2005/Atom',
          'xmlns:dc': 'http://purl.org/dc/elements/1.1/'
        },
        title: {
          _text: 'Uploads from everyone'
        },
        author: {
          _text: 'Me Myself'
        }
      }
    }
  }
}
