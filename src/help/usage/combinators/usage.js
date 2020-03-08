const layout = require('../../layout/combinators/layout')

module.exports = (toStrings = []) => (opts = []) => (
  layout(toStrings.map(toString => toString(opts)))
)