const {addRemainingOptsAndPosArgs} = require('./addRemainingOptsAndPosArgs')
const {assignOptsAndPosArgs}       = require('./assignOptsAndPosArgs')
const {verifyCommand}              = require('./verifyCommand')
const {pipe}                       = require('../pipe')

const toOpts = (opt = {}) => {
  const {errs: errs2, opt: opt2} = verifyCommand(opt)

  const defaultCommand = {
    key: 'default',
    opts: []
  }

  const opt3 = opt2 || defaultCommand

  return ({errs = [], argv = []} = {errs: [], argv: []}) => pipe(
    assignOptsAndPosArgs(opt3),
    addRemainingOptsAndPosArgs(opt3)
  )({errs: [...errs, ...errs2], argv})
}

module.exports = {
  toOpts
}