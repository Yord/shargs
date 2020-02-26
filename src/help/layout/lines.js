const layout = require('../../layout')
const line   = require('./line')

module.exports = (strings = [], id = 'line') => layout(
  strings.map(string => line(string, id))
)