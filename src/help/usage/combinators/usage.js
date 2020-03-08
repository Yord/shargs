const layout = require('../../layout/combinators/layout')

module.exports = (functions = []) => (opts = []) => (
  layout(functions.map(f => f(opts)))
)