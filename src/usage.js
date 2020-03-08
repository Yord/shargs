const layout = require('./help/layout/combinators/layout')

module.exports = (toStrings = []) => (opts = []) => (
  layout(toStrings.map(toString => toString(opts)))
)