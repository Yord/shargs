const layout = require('./layout')

module.exports = (toStrings = []) => (
  (opts = []) => (
    layout(toStrings.map(toString => toString(opts)))
  )
)