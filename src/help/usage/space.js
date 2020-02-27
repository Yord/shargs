const {noteFrom} = require('./note')

module.exports = (id = 'line') => (
  noteFrom(id)('')
)