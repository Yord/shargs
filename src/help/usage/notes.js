const texts = require('../layout/texts')

module.exports = (strings = [], id = 'line') => (
  () => (
    texts(strings, id)
  )
)