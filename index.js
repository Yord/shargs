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

const toResults         = require('./src/parser/toResults')
const toOptions         = require('./src/parser/toOptions')
const splitShortOptions = require('./src/parser/argv/splitShortOptions')
const cast              = require('./src/parser/options/cast')
const restrictValue     = require('./src/parser/options/restrictValue')

const argv = process.argv.slice(2)

/*
function fooParser (opts) {
  const {errs = [], args} = combine(...opts.map(option))

  if (errs.length > 0) {
    process.write(errs.join('\n') + '\n')
    process.exit(1)
  }

  return pipe(
    splitShortOptions(args),
    parseArgs(args)(option => pipe(
      cast(option),
      validate(option)
    )),
    mergeArgs(args)(fooParser)
  )
}
*/

function fooParser (opts) {
  return parser({
    argv: [
      splitShortOptions
    ],
    toOptions,
    options: [
      cast,
      restrictValue
    ],
    toResults: toResults(fooParser),
    results: []
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
  argv:      [splitShortOptions],
  toOptions,
  options:   [cast, restrictValue],
  toResults: toResults()
})

const parse2 = deepThought(opts2)

console.log('parse2', JSON.stringify(
  parse2({argv}),
  null,
  2
))