const {flag, number} = require('../src/options')

const {note}     = require('../src/help/usage/note')
const {notes}    = require('../src/help/usage/notes')
const {optsDefs} = require('../src/help/usage/optsDefs')

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