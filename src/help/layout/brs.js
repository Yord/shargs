const layout = require('../../layout')
const br     = require('./br')

module.exports = (length = 1, id = 'line') => layout(
  Array.from({length}, () => br(id))
)