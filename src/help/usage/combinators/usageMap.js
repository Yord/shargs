const layout = require('../../layout/combinators/layout')

module.exports = f => opts => layout(opts.map(f))