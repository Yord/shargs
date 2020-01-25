const parser  = require('./src/dsl/fp/parser')
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

const toArgs            = require('./src/parser/toArgs')
const toOpts            = require('./src/parser/toOpts')
const splitShortOptions = require('./src/parser/argv/splitShortOptions')
const cast              = require('./src/parser/options/cast')
const restrictValue     = require('./src/parser/options/restrictValue')

const argv = process.argv.slice(2)

function fooParser (opts) {
  return parser({
    argv:   [splitShortOptions],
    toOpts,
    opts:   [cast, restrictValue],
    toArgs: toArgs(fooParser),
    args:   []
  })(opts)
}

const parse = fooParser(opts)
console.log('parse', JSON.stringify(
  parse({argv}),
  null,
  2
))



const opts2 = [
  string('question', ['--question']),
  number('answer', ['--answer', '-a'], {only: [42]}),
  string('answerStr', ['--answer', '-a'])
]

const deepThought = parser({
  argv:   [splitShortOptions],
  toOpts,
  opts:   [cast, restrictValue],
  toArgs: toArgs()
})

const parse2 = deepThought(opts2)

console.log('parse2', JSON.stringify(
  parse2({argv}),
  null,
  2
))