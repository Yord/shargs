const {optsList} = require('./optsList')

test('optsList README example works as expected', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.'}
  ]
  
  const style = {
    cols: [
      {width: 30},
      {width: 25}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '-a, --answer=<number>         The answer.              \n' +
              '-h, --help                    Prints help.             \n' +
              '--version                     Prints version.          \n'
  
  expect(res).toStrictEqual(txt)
})

test('optsList works as expected', () => {
  const opts = [
    {key: 'answer', types: null, args: ['answer'], desc: 'The answer.', required: true},
    {key: 'foo', types: ['string'], args: ['-f', '--foo'], desc: 'Foo.', only: ['foo', 'bar'], required: false},
    {key: 'baz', types: ['bool'], args: ['-b', '--baz'], desc: 'Baz.', descArg: 'baz', defaultValues: [42], implies: ['foo']},
    {key: 'help', types: [], args: ['--help', 'help', '-h'], desc: 'Prints help.', defaultValues: [false]},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.', contradicts: ['help']},
    {key: 'position', types: ['number', 'number'], args: ['--pos'], desc: 'The position.'},
    {key: 'question', types: ['string'], required: true, desc: 'The question.'},
    {key: 'politePhrase', types: null, variadic: true, desc: 'Polite phrases.'},
    {now: 'something', completely: 'different'}
  ]

  const style = {
    cols: [
      {width: 25},
      {width: 50}
    ]
  }

  const res = optsList(opts)(style)

  const txt = 'answer                   The answer. [required]                            \n' +
              '-f, --foo=<foo|bar>      Foo. [not required]                               \n' +
              '-b, --baz=<baz>          Baz. [default: 42] [implies: -f, --foo]           \n' +
              '-h, help, --help         Prints help. [default: false]                     \n' +
              '--version                Prints version. [contradicts: --help, help, -h]   \n' +
              '--pos=<number number>    The position.                                     \n' +
              '<question>               The question. [required]                          \n' +
              '<politePhrase>...        Polite phrases.                                   \n'

  expect(res).toStrictEqual(txt)
})

test('optsList prints an empty string if opts are empty', () => {
  const opts = []

  const style = {
    cols: [
      {width: 25},
      {width: 50}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})