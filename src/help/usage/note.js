const {textFrom} = require('../layout/text')

module.exports = (string = '', id = 'line') => (
  () => (
    textFrom(id)(string)
  )
)