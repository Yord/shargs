const combine = require('./src/dsl/fp/combine')
const option  = require('./src/dsl/fp/option')
const {array, number, string, bool, flag, command} = require('./src/dsl/fp/types')

const numStr  = array(['number', 'string'])

const opts = combine([
  option('foo', number(['--foo'])),
  option('v', flag(['-v'])),
  option('init', command(['init'], {opts: option('sub', string(['--sub']))}))
])

const {errs, args} = combine([
  option('chunker', number( ['--chunker', '-c'], {only: [42]})),
  option('applier', string( ['--applier', '-a']              )),
  option('numStr',  numStr( ['--num-str', '-n']              )),
  option('verbose', flag(   ['--verbose', '-v']              )),
  option('truFal',  bool(   ['--tru-fal', '-t']              )),
  option('strlist', command(['--strlist', '-s']              )),
  option('command', command(['command',       ], {opts}      )),
  option('noMinus', string( ['noMinus'        ]              )),
  {errs: [], args: {'--a-flag': {arg: 'aflag', types: []}, '-f': {arg: 'aflag', types: []}}},
])
//console.log('args', args)

const pipe              = require('./src/dsl/fp/pipe')
const mergeArgs         = require('./src/parser/mergeArgs')
const parseArgs         = require('./src/parser/parseArgs')
const sliceArgv         = require('./src/parser/sliceArgv')
const splitShortOptions = require('./src/parser/splitShortOptions')

const argv = process.argv

function parser (args) {
  return pipe(
    splitShortOptions,
    parseArgs(args),
    mergeArgs(parser)
  )
}

const parse = parser(args)
console.log('parse', JSON.stringify(
  pipe(sliceArgv, parse)({errs, argv}),
  null,
  2
))