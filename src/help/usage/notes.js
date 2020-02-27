const texts = require('../layout/texts')

const notesFrom = id => (strings = []) => () => texts(strings, id)

const notes = notesFrom('line')

module.exports = {
  notes,
  notesFrom
}