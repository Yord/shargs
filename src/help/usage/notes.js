const texts = require('../layout/text')

module.exports = (strings = [], id = undefined) => (
  () => (
    texts(strings, id)
  )
)