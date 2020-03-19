const layoutMap  = require('./combinators/layoutMap')
const {lineFrom} = require('./line')

const o = (f, g) => x => f(g(x))

const linesFrom = o(layoutMap, lineFrom)

const lines = linesFrom('line')

module.exports = {
  lines,
  linesFrom
}