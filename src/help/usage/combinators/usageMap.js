const layout = require('../../layout/combinators/layout')

module.exports = (f = () => layout([])) => (opts = []) => layout(opts.map(f))