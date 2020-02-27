const layout     = require('../../layout')
const {lineFrom} = require('./line')

const linesFrom = id => (strings = []) => layout(
  strings.map(string => lineFrom(id)(string))
)

const lines = linesFrom('line')

module.exports = {
  lines,
  linesFrom
}