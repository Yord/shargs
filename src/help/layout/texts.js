const text = require('./text')

module.exports = (strings = [], id = undefined) => (
  (style = {}) => (
    strings.map(string => text(string, id)(style)).join('')
  )
)