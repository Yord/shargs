const combine = require('./src/dsl/fp/combine')
const option  = require('./src/dsl/fp/option')
const {array, number, string, bool, flag, command} = require('./src/dsl/fp/types')

const numStr  = array(['number', 'string'])

const opts = [
  number('foo', ['--foo']),
  flag('v', ['-v']),
  command('init', ['init'], {opts: option(string('sub', ['--sub']))})
]
//console.log('opts', opts)

const options = [
  number('chunker', ['--chunker', '-c'], {only: [42]}),
  string('applier', ['--applier', '-a']),
  numStr('numStr', ['--num-str', '-n']),
  flag('verbose', ['--verbose', '-v']),
  bool('truFal', ['--tru-fal', '-t']),
  command('strlist', ['--strlist', '-s']),
  command('command', ['command'], {opts: combine(opts.map(option))}),
  string('noMinus', ['noMinus'])
]
console.log('options', JSON.stringify(options, null, 2))

const os = combine(options.map(option))
//console.log('args', args)

const pipe              = require('./src/dsl/fp/pipe')
const mergeArgs         = require('./src/parser/mergeArgs')
const parseArgs         = require('./src/parser/parseArgs')
const sliceArgv         = require('./src/parser/sliceArgv')
const splitShortOptions = require('./src/parser/splitShortOptions')

const argv = process.argv

function parser ({errs = [], args = {}} = {}) {
  return ({errs: errs2 = [], argv = []} = {}) => pipe(
    splitShortOptions,
    parseArgs(args),
    mergeArgs(parser)
  )({errs: errs.concat(errs2), argv})
}

const parse = parser(os)
console.log('parse', JSON.stringify(
  pipe(sliceArgv, parse)({errs: [], argv}),
  null,
  2
))