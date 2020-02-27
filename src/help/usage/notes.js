const {textsFrom} = require('../layout/texts')

const notesFrom = id => (strings = []) => () => textsFrom(id)(strings)

const notes = notesFrom('line')

module.exports = {
  notes,
  notesFrom
}