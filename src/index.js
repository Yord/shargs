const {fromArgs}                    = require('./fromArgs')
const {parser, parserF, parserSync} = require('./parser')
const {toArgs}                      = require('./toArgs')
const {toArgv}                      = require('./toArgv')
const {toOpts}                      = require('./toOpts')

module.exports = {
  fromArgs,
  parser,
  parserF,
  parserSync,
  toArgs,
  toArgv,
  toOpts
}