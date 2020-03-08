const {note} = require('../src/help/usage/note')

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