const layout  = require('../src/layout')

const {br}    = require('../src/help/layout/br')
const {brs}   = require('../src/help/layout/brs')
const {cols}  = require('../src/help/layout/cols')
const {defs}  = require('../src/help/layout/defs')
const {line}  = require('../src/help/layout/line')
const {lines} = require('../src/help/layout/lines')
const {table} = require('../src/help/layout/table')
const {text}  = require('../src/help/layout/text')
const {texts} = require('../src/help/layout/texts')

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const text = layout([
    line('First line'),
    line('Last line')
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    line: {width: 40}
  }

  const text = layout([
    line('First line'),
    br,
    line('Last line')
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {line: {width: 40}}
  
  const text = layout([
    line('First line'),
    brs(2),
    line('Last line')
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {cols: [{width: 15}, {width: 25}]}
  
  const text = cols([
    [
      '-h, --help',
      '-v, --version'
    ],
    [
      'Prints the help.',
      'Prints the version.'
    ]
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {defs: {title: {width: 40}, desc: {padStart: 3, width: 37}}}
  
  const text = defs([
    {
      title: '-h, --help',
      desc: 'Prints the help.'
    },
    {
      title: '-v, --version',
      desc: 'Prints the version.'
    }
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const text = lines([
    'First line',
    'Last line'
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    cols: [
      {width: 15},
      {width: 25}
    ]
  }
  
  const text = table([
    [
      '-h, --help',
      'Prints the help.'
    ],
    [
      '-v, --version',
      'Prints the version.'
    ]
  ])(style)

  console.log(text)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const foo = text('Deep Thought was created to come up with the Answer.')(style)

  console.log(foo)
}())

;(function () {
  const style = {
    line: {width: 40}
  }
  
  const foo = texts([
    'Deep Thought was created to come up with the Answer.',
    'To The Ultimate Question of Life, the Universe, and Everything.'
  ])(style)

  console.log(foo)
}())