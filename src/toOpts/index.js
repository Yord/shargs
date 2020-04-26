const {addRestOpts}            = require('./addRestOpts')
const {addPositionalArguments} = require('./addPositionalArguments')
const {pairArgvWithArgs}       = require('./pairArgvWithArgs')
const {pipe}                   = require('../pipe')

const toOpts = (opts = []) => pipe(
  pairArgvWithArgs(opts),
  addPositionalArguments(opts),
  addRestOpts(opts)
)

module.exports = {
  toOpts
}