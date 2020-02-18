const line = require('./line')

module.exports = (strings = [], id = 'line') => (
  (style = {}) => (
    strings.map(string => line(string, id)(style)).join('')
  )
)