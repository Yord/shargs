const layout = require('../../layout')
const {textFrom} = require('./text')

module.exports = (strings = [], id = 'line') => layout(
  strings.map(string => textFrom(id)(string))
)