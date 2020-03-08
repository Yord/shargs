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

;(function () {
  const style = {
    line: {width: 40}
  }

  const res = layout([
    line('First line'),
    br,
    line('Last line')
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {line: {width: 40}}
  
  const res = layout([
    line('First line'),
    brs(2),
    line('Last line')
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {cols: [{width: 15}, {width: 25}]}
  
  const res = cols([
    [
      '-h, --help',
      '-v, --version'
    ],
    [
      'Prints the help.',
      'Prints the version.'
    ]
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {line: {width: 40}, desc: {padStart: 3, width: 37}}
  
  const res = defs([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {
    line: {width: 40}
  }

  const res = line('A line')(style)

  console.log(res)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const res = lines([
    'First line',
    'Last line'
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {
    cols: [
      {width: 15},
      {width: 25}
    ]
  }
  
  const res = table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const res = text('Deep Thought was created to come up with the Answer.')(style)

  console.log(res)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const res = texts([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {
    line: {width: 40}
  }

  const res = layout([
    line('First line'),
    line('Last line')
  ])(style)

  console.log(res)
}())

;(function () {
  const style = {
    line: {width: 40},
    desc: {padStart: 3, width: 37}
  }

  const itemsList = [
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ]

  const f = ([title, desc]) => [
    text(title),
    textFrom('desc')(desc)
  ]

  const res = layoutMap(f)(itemsList)(style)

  console.log(res)
}())