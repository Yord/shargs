const optsMap = require('./optsMap')

module.exports = optsMap(
  opt => ({...opt, args: (opt.args || []).slice(0, 1)})
)