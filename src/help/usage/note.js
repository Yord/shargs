const {textFrom} = require('../layout/text')

const noteFrom = id => (string = '') => (
  () => (
    textFrom(id)(string)
  )
)

const note = noteFrom('line')

module.exports = {
  note,
  noteFrom
}