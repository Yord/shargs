const parser            = require('../src/parser')
const TO_ARGS           = require('../src/parser/toArgs')
const TO_OPTS           = require('../src/parser/toOpts')
const splitShortOptions = require('../src/parser/argv/splitShortOptions')
const cast              = require('../src/parser/opts/cast')
const restrictToOnly    = require('../src/parser/opts/restrictToOnly')
const emptyRest         = require('../src/parser/args/emptyRest')

const {array, number, string, bool, flag, command} = require('../src/options')

const fooParser = parser({
  argv: [splitShortOptions],
  opts: [cast, restrictToOnly],
  args: [emptyRest]
})

const Parser = require('../src/parser/Parser')

const askOpts = [
  {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.'},
  {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
]

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'}),
  command('ask', ['ask'], {desc: 'Ask a question with this command.', opts: askOpts})
]

const argv = process.argv.slice(2)

const bar = (
  Parser.empty
        .splitShortOptions
        .toOpts(TO_OPTS)
        .cast
        .restrictToOnly
        .emptyRest
)

const baz = (
  bar.toArgs(TO_ARGS(bar.parser))
     .number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]})
     .flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
     .command('ask', ['ask'], {desc: 'Ask a question with this command.', opts: askOpts})
     .argv(argv)
     .args
)

const bat = (
  Parser.foo
        .number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]})
        .flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
        .command('ask', ['ask'], {desc: 'Ask a question with this command.', opts: askOpts})
        .args
)

console.log('foo')
console.log(fooParser(opts)(argv))

console.log('baz')
console.log(baz)

console.log('bat')
console.log(bat)