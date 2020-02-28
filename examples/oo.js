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

class Parser {
  static get empty () {
    return new Parser()
  }

  static get foo () {
    return new Parser({
      argv: [splitShortOptions],
      opts: [cast, restrictToOnly],
      args: [emptyRest]
    })
  }

  constructor ({argv = [], toOpts, opts = [], toArgs, args = []} = {}) {
    this.argvStage   = argv
    this.toOptsStage = toOpts
    this.optsStage   = opts
    this.toArgsStage = toArgs
    this.argsStage   = args
    this._opts       = []
    this._argv       = process.argv.slice(2)
  }

  get splitShortOptions () {
    this.argvStage.push(splitShortOptions)
    return this
  }

  toOpts (toOptsStage) {
    this.toOptsStage = toOptsStage
    return this
  }

  get cast () {
    this.optsStage.push(cast)
    return this
  }

  get restrictToOnly () {
    this.optsStage.push(restrictToOnly)
    return this
  }

  toArgs (toArgsStage) {
    this.toArgsStage = toArgsStage
    return this
  }

  get emptyRest () {
    this.argsStage.push(emptyRest)
    return this
  }

  array (types, key, args, options) {
    this._opts.push(array(types)(key, args, options))
    return this
  }

  number (key, args, options) {
    this._opts.push(number(key, args, options))
    return this
  }

  string (key, args, options) {
    this._opts.push(string(key, args, options))
    return this
  }

  bool (key, args, options) {
    this._opts.push(bool(key, args, options))
    return this
  }

  flag (key, args, options) {
    this._opts.push(flag(key, args, options))
    return this
  }

  command (key, args, options) {
    this._opts.push(command(key, args, options))
    return this
  }

  argv (argv) {
    this._argv = argv
    return this
  }

  get parser () {
    this._parser = parser({
      argv:   this.argvStage,
      toOpts: this.toOptsStage,
      opts:   this.optsStage,
      toArgs: this.toArgsStage,
      args:   this.argsStage
    })
    return this._parser
  }

  get parse () {
    if (typeof this.result === 'undefined') {
      this.result = this.parser(this._opts)({argv: this._argv})
    }
    return this.result
  }

  get args () {
    return this.parse.args
  }

  get errs () {
    return this.parse.errs
  }
}

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
console.log(fooParser(opts)({argv}))

console.log('baz')
console.log(baz)

console.log('bat')
console.log(bat)