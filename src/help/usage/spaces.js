const brs = require('../layout/brs')

module.exports = (length, id = undefined) => (
  () => (
    brs(length, id)
  )
)