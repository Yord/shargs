const parser            = require('./src/dsl/fp/parser')
const toArgs            = require('./src/parser/toArgs')
const toOpts            = require('./src/parser/toOpts')
const splitShortOptions = require('./src/parser/argv/splitShortOptions')
const cast              = require('./src/parser/opts/cast')
const restrictToOnly    = require('./src/parser/opts/restrictToOnly')

function fooParser (opts) {
  return parser({
    argv:   [splitShortOptions],
    toOpts,
    opts:   [cast, restrictToOnly],
    toArgs: toArgs(fooParser),
    args:   []
  })(opts)
}

const {array, number, string, bool, flag, command} = require('./src/dsl/fp/types')
const numStr  = array(['number', 'string'])

const opts = [
  number( 'chunker', ['--chunker', '-c'], {only: [42]}),
  string( 'applier', ['--applier', '-a']),
  numStr( 'numStr',  ['--num-str', '-n']),
  flag(   'verbose', ['--verbose', '-v']),
  bool(   'truFal',  ['--tru-fal', '-t']),
  command('strlist', ['--strlist', '-s']),
  string( 'noMinus', ['noMinus']),
  command('command', ['command'], {
    opts: [
      {key: 'foo', args: ['--foo'], types: ['number']},
      flag(   'v', ['-v']),
      command('init', ['init'], {
        opts: [
          string('sub', ['--sub'])
        ]
      })
    ]
  })
]

const argv = process.argv.slice(2)

const res = fooParser(opts)({argv})
//console.log('fooParser', JSON.stringify(res, null, 2))



const style = {
  line: {
    width: 40
  },
  cols: [
    {width:  9, paddingRight: 2}, // {width: width/cols = 40}
    {width: 29}  // {width: width/cols = 40}
  ],
  foo: [
    {width:  9, paddingRight: 2}, // {width: width/cols = 40}
    {width: 28, paddingRight: 1}  // {width: width/cols = 40}
  ],
  bar: {
    width: 40
  }
}



const foo0 = (
  "usage: foo [-b|--bar] [-h] [--version]  \n" +
  "                                        \n" +
  "-b, --bar  Foo bar baz.                 \n" +
  "-h,        Print this help message and  \n" +
  "--help     exit.                        \n" +
  "--version  Print the version number and \n" +
  "           exit.                        \n" +
  "                                        \n" +
  "Copyright (c) 2020, Philipp Wille, all  \n" +
  "rights reserved.                        \n"
)

const foo1 = usage([
  () => "usage: foo [-b|--bar] [-h] [--version]  \n",
  () => "                                        \n",
  () => "-b, --bar  Foo bar baz.                 \n",
  () => "-h,        Print this help message and  \n",
  () => "--help     exit.                        \n",
  () => "--version  Print the version number and \n",
  () => "           exit.                        \n",
  () => "                                        \n",
  () => "Copyright (c) 2020, Philipp Wille, all  \n",
  () => "rights reserved.                        \n"
])(style)

const foo2 = usage([
  line("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  line("-b, --bar  Foo bar baz."),
  line("-h,        Print this help message and"),
  line("--help     exit."),
  line("--version  Print the version number and"),
  line("           exit."),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo3 = usage([
  line("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  cols([
    [
      "-b, --bar",
      "-h,",
      "--help",
      "--version",
      ""
    ],
    [
      "Foo bar baz.",
      "Print this help message and",
      "exit.",
      "Print the version number and",
      "exit.",
    ]
  ]),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo4 = usage([
  line("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ]),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo5 = usage([
  line("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ], 'foo'),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo6 = usage([
  lines([
    "usage: foo [-b|--bar] [-h] [--version]"
  ]),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ]),
  line(),
  lines([
    "Copyright (c) 2020, Philipp Wille, all",
    "rights reserved."
  ])
])(style)

const foo7 = usage([
  text("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ]),
  line(),
  texts([
    "Copyright (c) 2020, Philipp Wille, all",
    "rights reserved."
  ])
])(style)

const foo8 = usage([
  text("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ]),
  line(),
  texts([
    "Copyright (c) 2020, Philipp Wille, all rights reserved."
  ])
])(style)

const foo9 = usage([
  text("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ]),
  line(),
  text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(style)

const foo10 = usage([
  text("usage: foo [-b|--bar] [-h] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ]),
  line(),
  text("Copyright (c) 2020, Philipp Wille, all rights reserved.", 'bar')
])(style)

const foo11 = usage([
  text("usage: foo [-b|--bar] [-h] [--version]"),
  br(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz."
    ],
    [
      "-h, --help",
      "Print this help message and exit.",
    ],
    [
      "--version",
      "Print the version number and exit."
    ]
  ]),
  br(),
  text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(style)



console.log('foo5', foo5)
console.log('foo7', foo7)


console.log('foo0  === foo1',  foo0  === foo1)
console.log('foo1  === foo2',  foo1  === foo2)
console.log('foo2  === foo3',  foo2  === foo3)
console.log('foo3  === foo4',  foo3  === foo4)
console.log('foo4  === foo5',  foo4  === foo5)
console.log('foo5  === foo6',  foo5  === foo6)
console.log('foo6  === foo7',  foo6  === foo7)
console.log('foo7  === foo8',  foo7  === foo8)
console.log('foo8  === foo9',  foo8  === foo9)
console.log('foo9  === foo10', foo9  === foo10)
console.log('foo10 === foo11', foo10 === foo11)





// [A] => String
function usage (toStrings = []) {
  return (options = {}) => toStrings.map(toString => toString(options)).join('')
}



// A => String
function br (id = undefined) {
  return (options = {}) => line('', id)(options)
}

// A => String
function line (text = '', id = undefined) {
  return ({line = {}, [id]: idLine} = {}) => text.padEnd((idLine || line).width) + '\n'
}

// A => String
function lines (strings = [], id = undefined) {
  return (options = {}) => strings.map(string => line(string, id)(options)).join('')
}

// A => String
function cols (columns = [], id = undefined) {
  // make sure options are long enough for all elements or have default options available
  return ({cols = [], [id]: idCols = undefined} = {}) => {
    const length = columns.reduce((max, column) => Math.max(max, column.length), 0)
  
    const lines = []

    for (let i = 0; i < length; i++) {
      let line = ''

      for (let j = 0; j < columns.length; j++) {
        const text = columns[j][i] || ''

        const width        = ((idCols || cols)[j] || {}).width
        const paddingRight = ((idCols || cols)[j] || {}).paddingRight || 0

        line += text.padEnd(width) + ''.padEnd(paddingRight)
      }

      lines.push(line + '\n')
    }

    return lines.join('')
  }
}



// B => String
function texts (strings = [], id = undefined) {
  return (options = {}) => strings.map(string => text(string, id)(options)).join('')
}

// B => A
function text (STRING = '', id = undefined) {
  return (options = {}) => {
    const {line = {}, [id]: idLine} = options

    const words = splitWords(STRING)

    const strings = []
    let string    = ''

    for (let i = 0; i < words.length; i++) {
      const word = words[i]

      const lineFull = (string + word).length > (idLine || line).width
      
      if (lineFull) {
        strings.push(string)
        string = word
      } else {
        string += word
      }
    }

    strings.push(string)

    return lines(strings, id)(options)
  }
}

// B => A
function dl (items = [], id = undefined) {
  return (options = {}) => {
    const {cols: COLS, [id]: idCols = undefined} = options

    const titleColWidth = ((idCols || COLS)[0] || {}).width // MAY BE UNDEFINED!
    const descColWidth  = ((idCols || COLS)[1] || {}).width // MAY BE UNDEFINED!

    const titleCol = []
    const descCol  = []

    for (let i = 0; i < items.length; i++) {
      const [title, desc] = items[i]

      const titleWords = splitWords(title)
      const descWords  = splitWords(desc)

      let iTitle = 0
      let iDesc  = 0

      let titleRow = ''
      let descRow  = ''

      while (iTitle < titleWords.length || iDesc < descWords.length) {
        const titleWord = titleWords[iTitle] || ''
        const descWord  = descWords[iDesc]   || ''

        const titleFull = iTitle >= titleWords.length || (titleRow + titleWord).length > titleColWidth
        const descFull  = iDesc  >= descWords.length  || (descRow  + descWord).length  > descColWidth

        if (titleFull && descFull) {
          titleCol.push(titleRow)
          titleRow = titleWord !== ' ' ? titleWord : ''
          iTitle++

          descCol.push(descRow)
          descRow  = descWord  !== ' ' ? descWord  : ''
          iDesc++
        }
        
        if (!titleFull) {
          titleRow += titleWord
          iTitle++
        }
        
        if (!descFull) {
          descRow += descWord
          iDesc++
        }
      }

      titleCol.push(titleRow)
      descCol.push(descRow)
    }

    return cols([titleCol, descCol], id)(options)
  }
}



function splitWords (string) {
  return string.split(/(\s+)/g)
}