const addUnusedOpts          = require('./addUnusedOpts')
const addPositionalArguments = require('./addPositionalArguments')
const pairArgvWithArgs       = require('./pairArgvWithArgs')
const pipe                   = require('../pipe')

module.exports = (opts = []) => pipe(
  pairArgvWithArgs(opts),
  addPositionalArguments(opts),
  addUnusedOpts(opts)
)