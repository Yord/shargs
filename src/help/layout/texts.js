const text = require('./text')

module.exports = (strings = [], id = 'line') => (
  (style = {}) => (
    strings.map(string => text(string, id)(style)).join('')
  )
)