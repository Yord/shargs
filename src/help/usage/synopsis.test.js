const {synopsis} = require('./synopsis')

test('synopsis README example works as expected', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.', required: true},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.', defaultValue: [false]},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.', contradicts: ['help']}
  ]
  
  const style = {
    line: {width: 40}
  }
  
  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought (-a|--answer) [-h|--help]   \n'+
              '            [--version]                 \n'
  
  expect(res).toStrictEqual(txt)
})

test('synopsis generates expected string', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true},
    {key: 'help', types: [], args: ['-h', '--help']},
    {key: 'verbose', types: [], args: ['-v']},
    {key: 'verbose', types: [], args: ['-q'], reverse: true},
    {values: 'yay'},
    {key: 'fun', types: ['bool'], args: ['-f'], required: true},
    {key: 'fun', types: ['bool'], args: ['--no-fun'], reverse: true},
    {key: 'question', types: ['string'], required: true},
    {key: 'politePhrase', types: null, variadic: true}
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought (-a|--answer) [-h|--help]   \n' +
              '            [-v|-q] [--no-fun] (-f)     \n' +
              '            (<question>)                \n' +
              '            [<politePhrase>...]         \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis works without programName', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true},
    {key: 'help', types: [], args: ['-h', '--help']},
    {key: 'verbose', types: [], args: ['-v']},
    {key: 'verbose', types: [], args: ['-q'], reverse: true},
    {values: 'yay'},
    {key: 'fun', types: ['bool'], args: ['-f'], required: true},
    {key: 'fun', types: ['bool'], args: ['--no-fun'], reverse: true},
    {key: 'question', types: ['string'], required: true},
    {key: 'politePhrase', types: null, variadic: true}
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis()(opts)(style)

  const txt = '(-a|--answer) [-h|--help] [-v|-q]       \n' +
              '[--no-fun] (-f) (<question>)            \n' +
              '[<politePhrase>...]                     \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis prints only programName if opts are empty', () => {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought                             \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis prints only programName if opts contains only undefined values', () => {
  const opts = [undefined, undefined]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought                             \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis ignores undefined values', () => {
  const opts = [
    undefined,
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true},
    undefined,
    {key: 'help', types: [], args: ['-h', '--help']},
    undefined
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought (-a|--answer) [-h|--help]   \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis ignores values without a key or without args', () => {
  const opts = [
    {values: ['unrecognized']},
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true},
    {something: 'completely', different: true},
    {key: 'help', types: [], args: ['-h', '--help']},
    {key: undefined, args: undefined}
  ]

  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought (-a|--answer) [-h|--help]   \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis prints only programName if opts is undefined', () => {
  const style = {
    line: {width: 40}
  }

  const res = synopsis('deepThought')()(style)

  const txt = 'deepThought                             \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis uses default line style if line is undefined in style', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true},
    {key: 'help', types: [], args: ['-h', '--help']},
    {key: 'verbose', types: [], args: ['-v']},
    {key: 'verbose', types: [], args: ['-q'], reverse: true},
    {values: 'yay'},
    {key: 'fun', types: ['bool'], args: ['-f'], required: true},
    {key: 'fun', types: ['bool'], args: ['--no-fun'], reverse: true},
    {key: 'question', types: ['string'], required: true},
    {key: 'politePhrase', types: null, variadic: true}
  ]

  const style = {}

  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought (-a|--answer) [-h|--help] [-v|-q] [--no-fun] (-f) (<question>)      \n' +
              '            [<politePhrase>...]                                                 \n'

  expect(res).toStrictEqual(txt)
})

test('synopsis uses default line style if style is undefined', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], required: true},
    {key: 'help', types: [], args: ['-h', '--help']},
    {key: 'verbose', types: [], args: ['-v']},
    {key: 'verbose', types: [], args: ['-q'], reverse: true},
    {values: 'yay'},
    {key: 'fun', types: ['bool'], args: ['-f'], required: true},
    {key: 'fun', types: ['bool'], args: ['--no-fun'], reverse: true},
    {key: 'question', types: ['string'], required: true},
    {key: 'politePhrase', types: null, variadic: true}
  ]

  const res = synopsis('deepThought')(opts)()

  const txt = 'deepThought (-a|--answer) [-h|--help] [-v|-q] [--no-fun] (-f) (<question>)      \n' +
              '            [<politePhrase>...]                                                 \n'

  expect(res).toStrictEqual(txt)
})