const line = require('./line')

module.exports = (strings = [], id = undefined) => (
  (style = {}) => (
    strings.map(string => line(string, id)(style)).join('')
  )
)