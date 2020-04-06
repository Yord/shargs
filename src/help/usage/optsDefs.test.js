const {optsDefs} = require('./optsDefs')

test('optsDefs README example works as expected', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.'}
  ]
  
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs(opts)(style)

  const txt = '-a, --answer=<number>                   \n' +
              '    The answer.                         \n' +
              '-h, --help                              \n' +
              '    Prints help.                        \n' +
              '--version                               \n' +
              '    Prints version.                     \n'
  
  expect(res).toStrictEqual(txt)
})

test('optsDefs works as expected', () => {
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
    line: {width: 60},
    desc: {padStart: 4, width: 56}
  }

  const res = optsDefs(opts)(style)

  const txt = 'answer [required]                                           \n' +
              '    The answer.                                             \n' +
              '-f, --foo=<foo|bar> [not required]                          \n' +
              '    Foo.                                                    \n' +
              '-b, --baz=<baz> [default: 42] [implies: -f, --foo]          \n' +
              '    Baz.                                                    \n' +
              '-h, help, --help [default: false]                           \n' +
              '    Prints help.                                            \n' +
              '--version [contradicts: --help, help, -h]                   \n' +
              '    Prints version.                                         \n' +
              '--pos=<number number>                                       \n' +
              '    The position.                                           \n' +
              '<question> [required]                                       \n' +
              '    The question.                                           \n' +
              '<politePhrase>...                                           \n' +
              '    Polite phrases.                                         \n'

  expect(res).toStrictEqual(txt)
})

test('optsDefs prints an empty string if opts are empty', () => {
  const opts = []

  const style = {
    line: {width: 42},
    desc: {padStart: 4, width: 38}
  }
  
  const res = optsDefs(opts)(style)

  const txt = ''

  expect(res).toStrictEqual(txt)
})