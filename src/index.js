const {fromArgs} = require('./fromArgs')
const {parser}   = require('./parser')
const {toArgs}   = require('./toArgs')
const {toArgv}   = require('./toArgv')
const {toOpts}   = require('./toOpts')

module.exports = {
  parser,
  fromArgs,
  toArgs,
  toArgv,
  toOpts
}