const {brsFrom} = require('../layout/brs')

module.exports = (length, id = 'line') => (
  () => (
    brsFrom(id)(length)
  )
)