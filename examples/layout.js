const layout           = require('../src/help/layout/combinators/layout')
const layoutMap        = require('../src/help/layout/combinators/layoutMap')

const {br}             = require('../src/help/layout/br')
const {brs}            = require('../src/help/layout/brs')
const {cols}           = require('../src/help/layout/cols')
const {defs}           = require('../src/help/layout/defs')
const {line}           = require('../src/help/layout/line')
const {lines}          = require('../src/help/layout/lines')
const {table}          = require('../src/help/layout/table')
const {text, textFrom} = require('../src/help/layout/text')
const {texts}          = require('../src/help/layout/texts')

const example = (desc, a) => console.log(
  layout([
    text(desc),
    a
  ])({
    line: {width: 40},
    desc: {padStart: 4, width: 36},
    cols: [
      {width: 15},
      {width: 25}
    ]
  })
)

example(
  'Sample use of br.',
  layout([
    line('First line'),
    br,
    line('Last line')
  ])
)

example(
  'Sample use of brs.',
  layout([
    line('First line'),
    brs(2),
    line('Last line')
  ])
)

example(
  'Sample use of cols.',
  cols([
    [
      '-h, --help',
      '-v, --version'
    ],
    [
      'Prints the help.',
      'Prints the version.'
    ]
  ])
)

example(
  'Sample use of defs.',
  defs([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])
)

example(
  'Sample use of line.',
  line('A line')
)

example(
  'Sample use of lines.',
  lines([
    'First line',
    'Last line'
  ])
)

example(
  'Sample use of table.',
  table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])
)

example(
  'Sample use of text.',
  text('Deep Thought was created to come up with the Answer.')
)

example(
  'Sample use of texts.',
  texts([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])
)

example(
  'Sample use of layout.',
  layout([
    line('First line'),
    line('Last line')
  ])
)

example(
  'Sample use of layoutMap 1/2.',
  layoutMap(
    ([title, desc]) => layout([
      text(title),
      textFrom('desc')(desc)
    ])
  )(
    [
      [
        '-h, --help',
        'Prints the help.'
      ],
      [
        '-v, --version',
        'Prints the version.'
      ]
    ]
  )
)

example(
  'Sample use of layoutMap 2/2.',
  layoutMap(line)([
    '-h, --help',
    'Prints the help.'
  ])
)