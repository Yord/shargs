const {number, string, flag} = require('../src/options')
const parser            = require('../src/parser/combinators/parser')
const splitShortOptions = require('../src/parser/argv/splitShortOptions')
const requireOptions    = require('../src/parser/opts/requireOptions')
const cast              = require('../src/parser/opts/cast')
const flagsAsBools      = require('../src/parser/args/flagsAsBools')
const usage             = require('../src/help/usage/combinators/usage')
const {note}            = require('../src/help/usage/note')
const {optsList}        = require('../src/help/usage/optsList')
const {space}           = require('../src/help/usage/space')
const {synopsis}        = require('../src/help/usage/synopsis')

const opts = [
  string('question', ['-q', '--question'], {desc: 'A question.', required: true}),
  number('answer', ['-a', '--answer'], {desc: 'The answer.', defaultValues: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]

const deepThought = parser({
  argv: [splitShortOptions],
  opts: [requireOptions, cast],
  args: [flagsAsBools]
})

const docs = usage([
  synopsis('deepThought'),
  space,
  optsList,
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])

const style = {
  line: {width: 80},
  cols: [{width: 25}, {width: 55}]
}

const argv = ['-hq', 'What is the answer?', '-a', '5']

const {args} = deepThought(opts)(argv)

const help = docs(opts)(style)

if (args.help) {
  console.log(help)
} else {
  console.log('The answer is: ' + args.answer)
}

console.log(args)