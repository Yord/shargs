const layout = require('../../layout')
const text   = require('./text')

module.exports = (strings = [], id = 'line') => layout(
  strings.map(string => text(string, id))
)