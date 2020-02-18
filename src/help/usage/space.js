const note = require('./note')

module.exports = (id = 'line') => (
  note('', id)
)