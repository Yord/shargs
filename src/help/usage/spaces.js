const brs = require('../layout/brs')

module.exports = (length, id = 'line') => (
  () => (
    brs(length, id)
  )
)