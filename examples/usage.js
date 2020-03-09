const {flag, number}   = require('../src/options')

const layout           = require('../src/help/layout/combinators/layout')

const {text, textFrom} = require('../src/help/layout/text')

const usage            = require('../src/help/usage/combinators/usage')
const usageMap         = require('../src/help/usage/combinators/usageMap')

const {note}           = require('../src/help/usage/note')
const {notes}          = require('../src/help/usage/notes')
const {optsDefs}       = require('../src/help/usage/optsDefs')
const {optsList}       = require('../src/help/usage/optsList')
const {space}          = require('../src/help/usage/space')
const {spaces}         = require('../src/help/usage/spaces')
const {synopsis}       = require('../src/help/usage/synopsis')

;(function () {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = note(
    'Deep Thought was created to come up with the Answer.'
  )(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = []

  const style = {
    line: {width: 40}
  }

  const res = notes([
    'Deep Thought answered',
    'The Ultimate Question.'
  ])(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const style = {
    line: {width: 40},
    desc: {padStart: 4, width: 36}
  }
  
  const res = optsDefs(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const style = {
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = optsList(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = []

  const style = {
    line: {width: 40}
  }
  
  const res = usage([
    note('Deep Thought answered'),
    space,
    note('The Ultimate Question.')
  ])(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = []

  const style = {
    line: {width: 40}
  }
  
  const res = usage([
    note('Deep Thought answered'),
    spaces(2),
    note('The Ultimate Question.')
  ])(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const style = {
    line: {width: 40}
  }
  
  const res = synopsis('deepThought')(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const style = {
    line: {width: 40},
    cols: [
      {width: 10, padEnd: 2},
      {width: 28}
    ]
  }
  
  const res = usage([
    synopsis('deepThought'),
    space,
    optsList,
    space,
    note('Deep Thought was created to come up with the Answer.')
  ])(opts)(style)

  console.log(res)
}())

;(function () {
  const opts = [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
  
  const style = {
    line: {width: 40},
    desc: {padStart: 3, width: 37}
  }
  
  const res = usageMap(({args, desc, types}) => layout([
    text(args.join(', ') + (types ? ' [' + types.join(', ') + ']' : '')),
    textFrom('desc')(desc)
  ]))(opts)(style)

  console.log(res)
}())