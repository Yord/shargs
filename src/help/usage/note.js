const text = require('../layout/text')

module.exports = (string = '', id = undefined) => (
  () => (
    text(string, id)
  )
)