const combine = require('./src/dsl/fp/combine')
const option  = require('./src/dsl/fp/option')
const parser  = require('./src/dsl/fp/parser')
const pipe    = require('./src/dsl/fp/pipe')
const {array, number, string, bool, flag, command} = require('./src/dsl/fp/types')

const numStr  = array(['number', 'string'])

const opts = [
  number('chunker', ['--chunker', '-c', '-a'], {only: [42]}),
  string('applier', ['--applier', '-a']),
  numStr('numStr', ['--num-str', '-n']),
  flag('verbose', ['--verbose', '-v', '-a']),
  bool('truFal', ['--tru-fal', '-t']),
  command('strlist', ['--strlist', '-s']),
  string('noMinus', ['noMinus']),
  command('command', ['command'], {
    opts: [
      {key: 'foo', args: ['--foo'], types: ['number']},
      flag('v', ['-v']),
      command('init', ['init'], {
        opts: [
          string('sub', ['--sub'])
        ]
      })
    ]
  })
]
//console.log('opts', JSON.stringify(opts, null, 2))

const options = combine(...opts.map(option))
//console.log('options', JSON.stringify(options, null, 2))

const mergeArgs         = require('./src/parser/mergeArgs')
const parseArgs         = require('./src/parser/parseArgs')
const sliceArgv         = require('./src/parser/sliceArgv')
const splitShortOptions = require('./src/parser/splitShortOptions')
const cast              = require('./src/parser/cast')
const validate          = require('./src/parser/validate')

const {argv} = process

const preprocess = pipe(cast, validate)

function fooParser (opts) {
  return parser(
    splitShortOptions,
    parseArgs(preprocess)(opts),
    mergeArgs(fooParser)
  )(opts)
}

const parse = fooParser(options)
console.log('parse', JSON.stringify(
  parse(sliceArgv({argv})),
  null,
  2
))

const questionCmd  = string('question', ['--question'])
const answerCmd    = number('answer', ['--answer', '-a'], {only: [42]})
const answerStrCmd = string('answerStr', ['--answer', '-a'])

const questionOpt  = option(questionCmd)
const answerOpt    = option(answerCmd)
const answerStrOpt = option(answerStrCmd)
const combinedOpt  = combine(questionOpt, answerOpt, answerStrOpt)

const deepThought  = opts => parser(
  splitShortOptions,
  parseArgs(preprocess)(opts),
  mergeArgs()
)(opts)

const parse2 = deepThought(combinedOpt)

console.log('parse2', JSON.stringify(
  parse2(sliceArgv({argv: process.argv})),
  null,
  2
))