const note = require('./note')

module.exports = (id = undefined) => (
  note('', id)
)