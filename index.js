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



const exAStyle = {
  line: {
    width: 40
  },
  cols: [
    {width:  9, padEnd: 2}, // {width: width/cols = 40}
    {width: 29}  // {width: width/cols = 40}
  ],
  foo: [
    {width:  9, padEnd: 2}, // {width: width/cols = 40}
    {width: 28, padEnd: 1}  // {width: width/cols = 40}
  ],
  bar: {
    width: 40
  }
}

const exAOpts = [
  number('bar',     ['-b', '--bar'],  {desc: 'Foo bar baz.'}),
  flag(  'help',    ['-h', '--help'], {desc: 'Print this help message and exit.'}),
  flag(  'version', ['--version'],    {desc: 'Print the version number and exit.'})
]



const exA0 = (
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

const exA1 = layout([
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
])()

const exA2 = layout([
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
])(exAStyle)

const exA3 = layout([
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
])(exAStyle)

const exA4 = layout([
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
])(exAStyle)

const exA5 = layout([
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
])(exAStyle)

const exA6 = layout([
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
])(exAStyle)

const exA7 = layout([
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
])(exAStyle)

const exA8 = layout([
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
])(exAStyle)

const exA9 = layout([
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
])(exAStyle)

const exA10 = layout([
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
])(exAStyle)

const exA11 = layout([
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
])(exAStyle)

const exA12 = usage([
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
])(exAOpts)(exAStyle)

const exA13 = usage([
  usageText("foo"),
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
])(exAOpts)(exAStyle)

const exA14 = usage([
  usageText("foo"),
  () => br(),
  dlOpts(),
  () => br(),
  () => text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA15 = usage([
  usageText("foo"),
  () => br(),
  dlOpts(),
  () => br(),
  note("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA16 = usage([
  usageText("foo"),
  note(),
  dlOpts(),
  note(),
  note("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA17 = usage([
  usageText("foo"),
  space(),
  dlOpts(),
  space(),
  note("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)



console.log('exA0')
console.log(exA0)
console.log('exA13')
console.log(exA13)


console.log('exA0  === exA1',  exA0  === exA1)
console.log('exA1  === exA2',  exA1  === exA2)
console.log('exA2  === exA3',  exA2  === exA3)
console.log('exA3  === exA4',  exA3  === exA4)
console.log('exA4  === exA5',  exA4  === exA5)
console.log('exA5  === exA6',  exA5  === exA6)
console.log('exA6  === exA7',  exA6  === exA7)
console.log('exA7  === exA8',  exA7  === exA8)
console.log('exA8  === exA9',  exA8  === exA9)
console.log('exA9  === exA10', exA9  === exA10)
console.log('exA10 === exA11', exA10 === exA11)
console.log('exA11 === exA12', exA11 === exA12)
console.log('exA12 === exA13', exA12 === exA13)
console.log('exA13 === exA14', exA13 === exA14)
console.log('exA14 === exA15', exA14 === exA15)
console.log('exA15 === exA16', exA15 === exA16)
console.log('exA16 === exA17', exA16 === exA17)




const exBStyle = {
  line: {
    width: 80
  },
  cols: [
    {padStart: 3, width: 11},
    {width: 66}
  ]
}

const exBOpts = [
  flag(   'version', ['--version']),
  flag(   'githelp', ['--help']),
  command('clone',   ['clone'], {desc: 'Clone a repository into a new directory'}),
  command('init',    ['init'],  {desc: 'Create an empty Git repository or reinitialize an existing one'}),
  command('add',     ['add'],   {desc: 'Add file contents to the index'}),
  command('mv',      ['mv'],    {desc: 'Move or rename a file, a directory, or a symlink'}),
  command('help',    ['help'])
]

// [A] => String
function layout (toStrings = []) {
  return (style = {}) => toStrings.map(toString => toString(style)).join('')
}

function usage (toStrings = []) {
  return (opts = []) => layout(toStrings.map(toString => toString(opts)))
}



// The following functions automatically deal with line breaks

// A => String
function br (id = undefined) {
  return line('', id)
}

// A => String
function line (text = '', id = undefined) {
  return ({line = {}, [id]: idLine} = {}) => text.padEnd((idLine || line).width) + '\n'
}

// A => String
function lines (strings = [], id = undefined) {
  return (style = {}) => strings.map(string => line(string, id)(style)).join('')
}



// The following functions automatically deal with organizing text into columns

// A => String
function cols (columns = [], id = undefined) {
  // make sure cols are long enough for all elements or have default cols available
  return (style = {}) => {
    const {cols = [], [id]: idCols = undefined} = style

    const length = columns.reduce((max, column) => Math.max(max, column.length), 0)
  
    const strings = []

    for (let i = 0; i < length; i++) {
      let string = ''

      for (let j = 0; j < columns.length; j++) {
        const text = columns[j][i] || ''

        const width    = ((idCols || cols)[j] || {}).width
        const padStart = ((idCols || cols)[j] || {}).padStart || 0
        const padEnd   = ((idCols || cols)[j] || {}).padEnd   || 0

        string += ''.padStart(padStart) + text.padEnd(width) + ''.padEnd(padEnd)
      }

      strings.push(string)
    }

    return lines(strings, id)(style)
  }
}



// The following functions automatically deal with strings that are longer than the width

// B => String
function texts (strings = [], id = undefined) {
  return (style = {}) => strings.map(string => text(string, id)(style)).join('')
}

// B => A
function text (STRING = '', id = undefined) {
  return (style = {}) => {
    const {line = {}, [id]: idLine} = style

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

    return lines(strings, id)(style)
  }
}

// B => A
function dl (items = [], id = undefined) {
  return (style = {}) => {
    const {cols: COLS, [id]: idCols = undefined} = style

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

    return cols([titleCol, descCol], id)(style)
  }
}



// The following functions automatically deal with strings that contains opts

function note (string = '', id = undefined) {
  return () => text(string, id)
}

function space (id = undefined) {
  return note('', id)
}

function usageText (programName = '', id = undefined) {
  return (opts = []) => {
    const argsString  = ({args = []}) => '[' + args.join('|') + ']'
    const argsStrings = opts.map(argsString).join(' ')

    return text(programName + ' ' + argsStrings, id)
  }
}

function dlOpts (id = undefined) {
  return (opts = []) => {
    const items = (
      opts
      .filter(({types}) => typeof types !== 'undefined' && types !== null) // Filter all commands
      .map(opt => ({types} = opt, types.length === 0 ? {...opt, types: ['flag']} : opt))
      .map(({args, desc, types}) => [args.join(', '), desc + ' [' + types.join(', ') + ']'])
    )
  
    return dl(items, id)
  }
}



function splitWords (string) {
  return string.split(/(\s+)/g)
}