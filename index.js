const combine = require('./src/dsl/fp/combine')
const option  = require('./src/dsl/fp/option')
const parser  = require('./src/dsl/fp/parser')
const {array, number, string, bool, flag, command} = require('./src/dsl/fp/types')

const numStr  = array(['number', 'string'])

const opts = [
  {key: 'foo', args: ['--foo'], types: ['number']}, //number('foo', ['--foo']),
  flag('v', ['-v']),
  command('init', ['init'], {opts: option(string('sub', ['--sub']))})
]
//console.log('opts.map(option)', JSON.stringify(opts.map(option), null, 2))

const options = [
  number('chunker', ['--chunker', '-c', '-a'], {only: [42]}),
  string('applier', ['--applier', '-a']),
  numStr('numStr', ['--num-str', '-n']),
  flag('verbose', ['--verbose', '-v', '-a']),
  bool('truFal', ['--tru-fal', '-t']),
  command('strlist', ['--strlist', '-s']),
  command('command', ['command'], {opts: combine(...opts.map(option))}),
  string('noMinus', ['noMinus'])
]
//console.log('options', JSON.stringify(options, null, 2))

const os = combine(...options.map(option))
//console.log('os', JSON.stringify(os, null, 2))

const mergeArgs         = require('./src/parser/mergeArgs')
const parseArgs         = require('./src/parser/parseArgs')
const sliceArgv         = require('./src/parser/sliceArgv')
const splitShortOptions = require('./src/parser/splitShortOptions')

const {argv} = process

function fooParser (opts) {
  return parser(
    splitShortOptions,
    parseArgs(opts),
    mergeArgs(fooParser)
  )(opts)
}

const parse = fooParser(os)
console.log('parse', JSON.stringify(
  parse(sliceArgv({argv})),
  null,
  2
))

const questionCmd = string('question', ['--question'])
const answerCmd   = number('answer', ['--answer', '-a'], {only: [42]})

const questionOpt = option(questionCmd)
const answerOpt   = option(answerCmd)
const combinedOpt = combine(questionOpt, answerOpt)

const deepThought = opts => parser(
  splitShortOptions,
  parseArgs(opts),
  mergeArgs()
)(opts)

const parse2 = deepThought(combinedOpt)

console.log('parse2', JSON.stringify(
  parse2(sliceArgv({argv: process.argv})),
  null,
  2
))