const layout = require('../../layout')
const {lineFrom} = require('./line')

module.exports = (strings = [], id = 'line') => layout(
  strings.map(string => lineFrom(id)(string))
)
