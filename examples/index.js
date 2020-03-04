const parser            = require('../src/parser')
const toArgs            = require('../src/parser/toArgs')
const toOpts            = require('../src/parser/toOpts')
const splitShortOptions = require('../src/parser/argv/splitShortOptions')
const cast              = require('../src/parser/opts/cast')
const restrictToOnly    = require('../src/parser/opts/restrictToOnly')
const emptyRest         = require('../src/parser/args/emptyRest')

const fooParser = parser({
  argv: [splitShortOptions],
  opts: [cast, restrictToOnly],
  args: [emptyRest]
})

const {array, number, string, bool, flag, command} = require('../src/options')
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

const res = fooParser(opts)(argv)
console.log('fooParser', JSON.stringify(res, null, 2))



const layout                   = require('../src/layout')
const usage                    = require('../src/usage')
const decorate                 = require('../src/decorate')

const {br}                     = require('../src/help/layout/br')
const {brs}                    = require('../src/help/layout/brs')
const {cols}                   = require('../src/help/layout/cols')
const {defs}                   = require('../src/help/layout/defs')
const {line, lineFrom}         = require('../src/help/layout/line')
const {lines}                  = require('../src/help/layout/lines')
const {table, tableFrom}       = require('../src/help/layout/table')
const {text, textFrom}         = require('../src/help/layout/text')
const {texts, textsFrom}       = require('../src/help/layout/texts')
const {note, noteFrom}         = require('../src/help/usage/note')
const {notes}                  = require('../src/help/usage/notes')
const {optsDefs}               = require('../src/help/usage/optsDefs')
const {optsList}               = require('../src/help/usage/optsList')
const {space}                  = require('../src/help/usage/space')
const {spaces}                 = require('../src/help/usage/spaces')
const {synopsis, synopsisFrom} = require('../src/help/usage/synopsis')

const justArgs                 = require('../src/help/usage/decorators/justArgs')
const noCommands               = require('../src/help/usage/decorators/noCommands')
const onlyCommands             = require('../src/help/usage/decorators/onlyCommands')
const onlyFirstArg             = require('../src/help/usage/decorators/onlyFirstArg')



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
  table([
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
  tableFrom('foo')([
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

const exA6 = layout([
  lines([
    "foo [-b|--bar] [-h|--help] [--version]"
  ]),
  line(),
  table([
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
  table([
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
  table([
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
  table([
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
  table([
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
  textFrom('bar')("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAStyle)

const exA11 = layout([
  text("foo [-b|--bar] [-h|--help] [--version]"),
  br,
  table([
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
  br,
  text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAStyle)

const exA12 = usage([
  () => text("foo [-b|--bar] [-h|--help] [--version]"),
  () => br,
  () => table([
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
  () => br,
  () => text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA13 = usage([
  synopsis("foo"),
  () => br,
  () => table([
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
  () => br,
  () => text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA14 = usage([
  synopsis("foo"),
  () => br,
  optsList,
  () => br,
  () => text("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA15 = usage([
  synopsis("foo"),
  () => br,
  optsList,
  () => br,
  note("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA16 = usage([
  synopsis("foo"),
  note(),
  optsList,
  note(),
  note("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

const exA17 = usage([
  synopsis("foo"),
  space,
  optsList,
  space,
  note("Copyright (c) 2020, Philipp Wille, all rights reserved.")
])(exAOpts)(exAStyle)

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

const exB0 = (
  "git [--version] [--help] <command> [args]                                       \n" +
  "                                                                                \n" +
  "These are common Git commands used in various situations:                       \n" +
  "                                                                                \n" +
  "start a working area (see also: git help tutorial)                              \n" +
  "   clone      Clone a repository into a new directory                           \n" +
  "   init       Create an empty Git repository or reinitialize an existing one    \n" +
  "                                                                                \n" +
  "work on the current change (see also: git help everyday)                        \n" +
  "   add        Add file contents to the index                                    \n" +
  "   mv         Move or rename a file, a directory, or a symlink                  \n" +
  "                                                                                \n" +
  "'git help -a' and 'git help -g' list available subcommands and some concept     \n" +
  "guides. See 'git help <command>' or 'git help <concept>' to read about a        \n" +
  "specific subcommand or concept.                                                 \n"
)

const exB1 = layout([
  line("git [--version] [--help] <command> [args]"),
  br,
  line("These are common Git commands used in various situations:"),
  br,
  line("start a working area (see also: git help tutorial)"),
  line("   clone      Clone a repository into a new directory"),
  line("   init       Create an empty Git repository or reinitialize an existing one"),
  br,
  line("work on the current change (see also: git help everyday)"),
  line("   add        Add file contents to the index"),
  line("   mv         Move or rename a file, a directory, or a symlink"),
  br,
  line("'git help -a' and 'git help -g' list available subcommands and some concept"),
  line("guides. See 'git help <command>' or 'git help <concept>' to read about a"),
  line("specific subcommand or concept.")
])(exBStyle)

const exB2 = usage([
  noCommands(synopsis("git", "<command> [args]")),
  space,
  note("These are common Git commands used in various situations:"),
  space,
  note("start a working area (see also: git help tutorial)"),
  justArgs(['clone', 'init'])(optsList),
  space,
  note("work on the current change (see also: git help everyday)"),
  justArgs(['add', 'mv'])(optsList),
  space,
  note("'git help -a' and 'git help -g' list available subcommands and some concept guides. See 'git help <command>' or 'git help <concept>' to read about a specific subcommand or concept.")
])(exBOpts)(exBStyle)

console.log('exB0  === exB1',  exB0  === exB1)
console.log('exB1  === exB2',  exB1  === exB2)



const exCStyle = {
  line: {
    padStart: 6,
    width: 74
  },
  cols: [
    {padStart: 3, width: 11},
    {width: 66}
  ],
  defs: {
    title: {padStart:  6, width: 74},
    desc:  {padStart: 10, width: 70}
  },
  h1: {
    padStart: 0,
    width: 80
  },
  tab: {
    padStart: 10,
    width: 70
  },
  tabTable: [
    {padStart: 10, width: 7},
    {width: 63}
  ]
}

const exCOpts = [
  flag('force',   ['-f', '--force'  ], {desc: 'Force renaming or moving of a file even if the target exists'}),
  flag('k',       ['-k'             ], {desc: 'Skip move or rename actions which would lead to an error condition. An error happens when a source is neither existing nor controlled by Git, or when it would overwrite an existing file unless -f is given.'}),
  flag('dryRun',  ['-n', '--dry-run'], {desc: 'Do nothing; only show what would happen'}),
  flag('verbose', ['-v', '--verbose'], {desc: 'Report the names of files as they are moved.'})
]

const exC0 = (
  'NAME                                                                            \n' +
  '      git-mv - Move or rename a file, a directory, or a symlink                 \n' +
  '                                                                                \n' +
  'SYNOPSIS                                                                        \n' +
  '      git mv <options>... <args>...                                             \n' +
  '                                                                                \n' +
  '                                                                                \n' +
  'DESCRIPTION                                                                     \n' +
  '      Move or rename a file, directory or symlink.                              \n' +
  '                                                                                \n' +
  '          git mv [-f] [-k] [-n] [-v] <source> <destination>                     \n' +
  '          git mv [-f] [-k] [-n] [-v] <source> ... <destination directory>       \n' +
  '                                                                                \n' +
  '      The index is updated after successful completion, but the change must     \n' +
  '      still be committed.                                                       \n' +
  '                                                                                \n' +
  'OPTIONS                                                                         \n' +
  '      -f, --force [flag]                                                        \n' +
  '          Force renaming or moving of a file even if the target exists          \n' +
  '                                                                                \n' +
  '      -k [flag]                                                                 \n' +
  '          Skip move or rename actions which would lead to an error condition. An\n' +
  '          error happens when a source is neither existing nor controlled by Git,\n' +
  '          or when it would overwrite an existing file unless -f is given.       \n' +
  '                                                                                \n' +
  '      -n, --dry-run [flag]                                                      \n' +
  '          Do nothing; only show what would happen                               \n' +
  '                                                                                \n' +
  '      -v, --verbose [flag]                                                      \n' +
  '          Report the names of files as they are moved.                          \n' +
  '                                                                                \n' +
  'SUBMODULES                                                                      \n' +
  '      Moving a submodule using a gitfile (which means they were cloned with a   \n' +
  '      Git version 1.7.8 or newer) will update the gitfile and core.worktree     \n' +
  '      setting to make the submodule work in the new location. It also will      \n' +
  '      attempt to update the submodule.<name>.path setting in the gitmodules(5)  \n' +
  '      file and stage that file (unless -n is used).                             \n' +
  '                                                                                \n' +
  'GIT                                                                             \n' +
  '      Part of the git(1) suite                                                  \n'
)

const exC1 = layout([
  lineFrom('h1')('NAME'),
  line('git-mv - Move or rename a file, a directory, or a symlink'),
  br,
  lineFrom('h1')('SYNOPSIS'),
  line('git mv <options>... <args>...'),
  br,
  br,
  lineFrom('h1')('DESCRIPTION'),
  line('Move or rename a file, directory or symlink.'),
  br,
  lineFrom('tab')('git mv [-f] [-k] [-n] [-v] <source> <destination>'),
  lineFrom('tab')('git mv [-f] [-k] [-n] [-v] <source> ... <destination directory>'),
  br,
  line('The index is updated after successful completion, but the change must'),
  line('still be committed.'),
  br,
  lineFrom('h1')('OPTIONS'),
  line('-f, --force [flag]'),
  lineFrom('tab')('Force renaming or moving of a file even if the target exists'),
  br,
  line('-k [flag]'),
  lineFrom('tab')('Skip move or rename actions which would lead to an error condition. An'),
  lineFrom('tab')('error happens when a source is neither existing nor controlled by Git,'),
  lineFrom('tab')('or when it would overwrite an existing file unless -f is given.'),
  br,
  line('-n, --dry-run [flag]'),
  lineFrom('tab')('Do nothing; only show what would happen'),
  br,
  line('-v, --verbose [flag]'),
  lineFrom('tab')('Report the names of files as they are moved.'),
  br,
  lineFrom('h1')('SUBMODULES'),
  line('Moving a submodule using a gitfile (which means they were cloned with a'),
  line('Git version 1.7.8 or newer) will update the gitfile and core.worktree'),
  line('setting to make the submodule work in the new location. It also will'),
  line('attempt to update the submodule.<name>.path setting in the gitmodules(5)'),
  line('file and stage that file (unless -n is used).'),
  br,
  lineFrom('h1')('GIT'),
  line('Part of the git(1) suite')
])(exCStyle)

const exC2 = layout([
  textFrom('h1')('NAME'),
  text('git-mv - Move or rename a file, a directory, or a symlink'),
  br,
  textFrom('h1')('SYNOPSIS'),
  text('git mv <options>... <args>...'),
  brs(2),
  textFrom('h1')('DESCRIPTION'),
  text('Move or rename a file, directory or symlink.'),
  br,
  textsFrom('tab')(
    [
      'git mv [-f] [-k] [-n] [-v] <source> <destination>',
      'git mv [-f] [-k] [-n] [-v] <source> ... <destination directory>'
    ]
  ),
  br,
  text('The index is updated after successful completion, but the change must still be committed.'),
  br,
  textFrom('h1')('OPTIONS'),
  defs([
    {
      title: '-f, --force [flag]',
      desc:  'Force renaming or moving of a file even if the target exists'
    },
    {
      title: '-k [flag]',
      desc:  'Skip move or rename actions which would lead to an error condition. An error happens when a source is neither existing nor controlled by Git, or when it would overwrite an existing file unless -f is given.'
    },
    {
      title: '-n, --dry-run [flag]',
      desc:  'Do nothing; only show what would happen'
    },
    {
      title: '-v, --verbose [flag]',
      desc:  'Report the names of files as they are moved.'
    }
  ]),
  textFrom('h1')('SUBMODULES'),
  text('Moving a submodule using a gitfile (which means they were cloned with a Git version 1.7.8 or newer) will update the gitfile and core.worktree setting to make the submodule work in the new location. It also will attempt to update the submodule.<name>.path setting in the gitmodules(5) file and stage that file (unless -n is used).'),
  br,
  textFrom('h1')('GIT'),
  text('Part of the git(1) suite')
])(exCStyle)

const exC3 = usage([
  noteFrom('h1')('NAME'),
  note('git-mv - Move or rename a file, a directory, or a symlink'),
  space,
  noteFrom('h1')('SYNOPSIS'),
  note('git mv <options>... <args>...'),
  spaces(2),
  noteFrom('h1')('DESCRIPTION'),
  note('Move or rename a file, directory or symlink.'),
  space,
  onlyFirstArg(synopsisFrom('tabTable')('git mv', '<source> <destination>')),
  onlyFirstArg(synopsisFrom('tabTable')('git mv', '<source> ... <destination directory>')),
  space,
  note('The index is updated after successful completion, but the change must still be committed.'),
  space,
  noteFrom('h1')('OPTIONS'),
  optsDefs,
  noteFrom('h1')('SUBMODULES'),
  note('Moving a submodule using a gitfile (which means they were cloned with a Git version 1.7.8 or newer) will update the gitfile and core.worktree setting to make the submodule work in the new location. It also will attempt to update the submodule.<name>.path setting in the gitmodules(5) file and stage that file (unless -n is used).'),
  space,
  noteFrom('h1')('GIT'),
  note('Part of the git(1) suite')
])(exCOpts)(exCStyle)

console.log('exC0  === exC1',  exC0  === exC1)
console.log('exC1  === exC2',  exC1  === exC2)
console.log('exC2  === exC3',  exC2  === exC3)



const exDStyle = {
  cols: [
    {width: 20},
    {width: 20},
    {width: 20},
    {width: 20}
  ]
}

const exD0 = (
  'foo                 bar                 baz                 bat                 \n' +
  'foo                 bar                 baz                 bat                 \n'
)

const exD1 = layout([
  cols([
    [
      'foo',
      'foo'
    ],
    [
      'bar',
      'bar'
    ],
    [
      'baz',
      'baz'
    ],
    [
      'bat',
      'bat'
    ]
  ])
])(exDStyle)

const exD2 = layout([
  table([
    [
      'foo',
      'bar',
      'baz',
      'bat'
    ],
    [
      'foo',
      'bar',
      'baz',
      'bat'
    ]
  ])
])(exDStyle)

console.log('exD0  === exD1',  exD0  === exD1)
console.log('exD1  === exD2',  exD1  === exD2)





;(function () {
  const opts = [
    string('question', ['-q', '--question'], {desc: 'A question.'}),
    number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
    flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
  ]

  const log = text => obj => {
    const {argv, opts, args} = obj
    //console.log(text, argv || opts || args)
    return obj
  }

  const deepThought = parser({
    argv: [log('A'), splitShortOptions, log('B')],
    toOpts,
    opts: [log('C'), cast, restrictToOnly, log('D')],
    toArgs: toArgs(),
    args: [log('E'), emptyRest, log('F')]
  })

  // node index.js --unknown -ha 42
  const argv = process.argv.slice(2)//['--unknown', '-ha', '42']

  const {errs, args} = deepThought(opts)(argv)

  const docs = usage([
    synopsis('deepThought'),
    space,
    optsList,
    space,
    note('Deep Thought was created to come up with the Answer to The Ultimate Question of Life, the Universe, and Everything.')
  ])

  const style = {
    line: {width: 80},
    cols: [{width: 20}, {width: 60}]
  }
  
  const help = docs(opts)(style)

  if (args.help) {
    //console.log(help)
  } else {
    //console.log('The answer is: ' + args.answer)
  }
}())



;(function () {
  const askOpts = [
    {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
  ]

  const opts = [
    command('ask', ['ask'], {desc: 'Just ask.', opts: askOpts}),
    number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
    flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
  ]

  const deepThought = parser({
    argv: [splitShortOptions],
    opts: [cast, restrictToOnly],
    args: [emptyRest]
  })

  const askDocs = layout([
    text('deepThought ask [-q|--question] [-h|--help]'),
    br,
    table([
      ['-q, --question', 'A question. [string]'],
      ['-h, --help', 'Print this help message and exit. [flag]']
    ]),
    br,
    text(
      'Deep Thought was created to come up with the Answer to ' +
      'The Ultimate Question of Life, the Universe, and Everything.'
    )
  ])

  const style = {
    line: {width: 80},
    cols: [{width: 20}, {width: 60}],
    defs: {
      title: {width: 20},
      desc: {width: 60}
    }
  }

  const docs = usage([
    decorate(noCommands, onlyFirstArg)(synopsis('deepThought')),
    space,
    onlyCommands(optsDefs),
    space,
    noCommands(optsList),
    space,
    note(
      'Deep Thought was created to come up with the Answer to ' +
      'The Ultimate Question of Life, the Universe, and Everything.'
    )
  ])

  // ./deepThought ask -q 'What is the answer to everything?'
  const argv = ['-h', '-a', '42', 'ask', '-q', 'What is the answer to everything?']

  const {errs, args} = deepThought(opts)(argv)

  const help = docs(opts)(style)
  const askHelp = askDocs(style)

  if (args.help) {
    console.log(help)
  } else if (args.ask && args.ask.help) {
    console.log(askHelp)
  } else {
    console.log('The answer is: ' + args.answer)
  }
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  
  const text = layout([
    line('First line'),
    line('Last line')
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    line: {width: 40}
  }

  const text = layout([
    line('First line'),
    br,
    line('Last line')
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {line: {width: 40}}
  
  const text = layout([
    line('First line'),
    brs(2),
    line('Last line')
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {cols: [{width: 15}, {width: 25}]}
  
  const text = cols([
    [
      '-h, --help',
      '-v, --version'
    ],
    [
      'Prints the help.',
      'Prints the version.'
    ]
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {defs: {title: {width: 40}, desc: {padStart: 3, width: 37}}}
  
  const text = defs([
    {
      title: '-h, --help',
      desc: 'Prints the help.'
    },
    {
      title: '-v, --version',
      desc: 'Prints the version.'
    }
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const text = lines([
    'First line',
    'Last line'
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    cols: [
      {width: 15},
      {width: 25}
    ]
  }
  
  const text = table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const foo = text('Deep Thought was created to come up with the Answer.')(style)

  console.log(foo)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const foo = texts([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])(style)

  console.log(foo)
}())

;(function () {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const style = {
    defs: {
      title: {width: 40},
      desc: {padStart: 4, width: 36}
    }
  }
  
  const foo = optsDefs(opts)(style)

  console.log(foo)
}())

;(function () {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const style = {
    title: {width: 40},
    desc: {padStart: 4, width: 36}
  }

  const optsMap = f => opts => layout(opts.map(f))
  
  const foo = optsMap(({args, desc, types}) => layout([
    textFrom('title')(args.join(', ') + (types ? ' [' + types.join(', ') + ']' : '')),
    textFrom('desc')(desc),
    br
  ]))(opts)(style)

  console.log(foo)
}())