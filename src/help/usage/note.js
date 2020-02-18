const text = require('../layout/text')

module.exports = (string = '', id = 'line') => (
  () => (
    text(string, id)
  )
)