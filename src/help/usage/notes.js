const texts = require('../layout/texts')

module.exports = (strings = [], id = undefined) => (
  () => (
    texts(strings, id)
  )
)