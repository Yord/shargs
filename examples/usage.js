const {note}  = require('../src/help/usage/note')
const {notes} = require('../src/help/usage/notes')

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