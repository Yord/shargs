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

const opts2 = [
  number('bar',     ['-b', '--bar']),
  flag(  'help',    ['-h', '--help']),
  flag(  'version', ['--version'])
]



const foo0 = (
  "foo [-b|--bar] [-h|--help] [--version]  \n" +
  "                                        \n" +
  "-b, --bar  Foo bar baz. [number]        \n" +
  "-h,        Print this help message and  \n" +
  "--help     exit. [flag]                 \n" +
  "--version  Print the version number and \n" +
  "           exit. [flag]                 \n" +
  "                                        \n" +
  "Copyright (c) 2020, Philipp Wille, all  \n" +
  "rights reserved.                        \n"
)

const foo1 = layout([
  () => "foo [-b|--bar] [-h|--help] [--version]  \n",
  () => "                                        \n",
  () => "-b, --bar  Foo bar baz. [number]        \n",
  () => "-h,        Print this help message and  \n",
  () => "--help     exit. [flag]                 \n",
  () => "--version  Print the version number and \n",
  () => "           exit. [flag]                 \n",
  () => "                                        \n",
  () => "Copyright (c) 2020, Philipp Wille, all  \n",
  () => "rights reserved.                        \n"
])(style)

const foo2 = layout([
  line("foo [-b|--bar] [-h|--help] [--version]"),
  line(),
  line("-b, --bar  Foo bar baz. [number]"),
  line("-h,        Print this help message and"),
  line("--help     exit. [flag]"),
  line("--version  Print the version number and"),
  line("           exit. [flag]"),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo3 = layout([
  line("foo [-b|--bar] [-h|--help] [--version]"),
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
      "Foo bar baz. [number]",
      "Print this help message and",
      "exit. [flag]",
      "Print the version number and",
      "exit. [flag]",
    ]
  ]),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo4 = layout([
  line("foo [-b|--bar] [-h|--help] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo5 = layout([
  line("foo [-b|--bar] [-h|--help] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ], 'foo'),
  line(),
  line("Copyright (c) 2020, Philipp Wille, all"),
  line("rights reserved.")
])(style)

const foo6 = layout([
  lines([
    "foo [-b|--bar] [-h|--help] [--version]"
  ]),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  line(),
  lines([
    "Copyright (c) 2020, Philipp Wille, all",
    "rights reserved."
  ])
])(style)

const foo7 = layout([
  text("foo [-b|--bar] [-h|--help] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  line(),
  texts([
    "Copyright (c) 2020, Philipp Wille, all",
    "rights reserved."
  ])
])(style)

const foo8 = layout([
  text("foo [-b|--bar] [-h|--help] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  line(),
  texts([
    "Copyright (c) 2020, Philipp Wille, all rights reserved."
  ])
])(style)

const foo9 = layout([
  text("foo [-b|--bar] [-h|--help] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  line(),
  text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(style)

const foo10 = layout([
  text("foo [-b|--bar] [-h|--help] [--version]"),
  line(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  line(),
  text("Copyright (c) 2020, Philipp Wille, all rights reserved.", 'bar')
])(style)

const foo11 = layout([
  text("foo [-b|--bar] [-h|--help] [--version]"),
  br(),
  dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  br(),
  text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(style)

const foo12 = usage([
  () => text("foo [-b|--bar] [-h|--help] [--version]"),
  () => br(),
  () => dl([
    [
      "-b, --bar",
      "Foo bar baz. [number]"
    ],
    [
      "-h, --help",
      "Print this help message and exit. [flag]",
    ],
    [
      "--version",
      "Print the version number and exit. [flag]"
    ]
  ]),
  () => br(),
  () => text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(opts2)(style)



console.log('foo5')
console.log(foo5)
console.log('foo12')
console.log(foo12)


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
console.log('foo11 === foo12', foo11 === foo12)





// [A] => String
function layout (toStrings = []) {
  return (options = {}) => toStrings.map(toString => toString(options)).join('')
}

function usage (toStrings = []) {
  return (opts = []) => (style = {}) => layout(toStrings.map(toString => toString(opts)))(style)
}



// The following functions automatically deal with line breaks

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



// The following functions automatically deal with organizing text into columns

// A => String
function cols (columns = [], id = undefined) {
  // make sure options are long enough for all elements or have default options available
  return (options = {}) => {
    const {cols = [], [id]: idCols = undefined} = options

    const length = columns.reduce((max, column) => Math.max(max, column.length), 0)
  
    const strings = []

    for (let i = 0; i < length; i++) {
      let string = ''

      for (let j = 0; j < columns.length; j++) {
        const text = columns[j][i] || ''

        const width        = ((idCols || cols)[j] || {}).width
        const paddingRight = ((idCols || cols)[j] || {}).paddingRight || 0

        string += text.padEnd(width) + ''.padEnd(paddingRight)
      }

      strings.push(string)
    }

    return lines(strings, id)(options)
  }
}



// The following functions automatically deal with strings that are longer than the width

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