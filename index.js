const combine = require('./src/dsl/fp/combine')
const option  = require('./src/dsl/fp/option')
const parser  = require('./src/dsl/fp/parser')
const pipe    = require('./src/dsl/fp/pipe')
const {array, number, string, bool, flag, command} = require('./src/dsl/fp/types')

const numStr  = array(['number', 'string'])

const opts = [
  number('chunker', ['--chunker', '-c'], {only: [42]}),
  string('applier', ['--applier', '-a']),
  numStr('numStr', ['--num-str', '-n']),
  flag('verbose', ['--verbose', '-v']),
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
const splitShortOptions = require('./src/parser/splitShortOptions')
const cast              = require('./src/parser/cast')
const validate          = require('./src/parser/validate')

const argv = process.argv.slice(2)

const preprocess = option => pipe(cast(option), validate(option))

function fooParser (options) {
  return parser(
    splitShortOptions,
    parseArgs(preprocess)(options),
    mergeArgs(fooParser)
  )(options)
}

const parse = fooParser(options)
console.log('parse', JSON.stringify(
  parse({argv}),
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

const deepThought  = options => parser(
  splitShortOptions,
  parseArgs(preprocess)(options),
  mergeArgs()
)(options)

const parse2 = deepThought(combinedOpt)

console.log('parse2', JSON.stringify(
  parse2({argv}),
  null,
  2
))