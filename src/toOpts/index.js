const {addRemainingOptsAndPosArgs} = require('./addRemainingOptsAndPosArgs')
const {assignOptsAndPosArgs}       = require('./assignOptsAndPosArgs')
const {pipe}                       = require('../pipe')

const toOpts = (opt = {key: '', opts: []}) => {
  return ({errs = [], argv = []} = {errs: [], argv: []}) => pipe(
    assignOptsAndPosArgs(opt),
    addRemainingOptsAndPosArgs(opt)
  )({errs, argv})
}

module.exports = {
  toOpts
}