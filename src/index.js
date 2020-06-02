const {fromArgs}   = require('./fromArgs')
const {parserSync} = require('./parserSync')
const {toArgs}     = require('./toArgs')
const {toArgv}     = require('./toArgv')
const {toOpts}     = require('./toOpts')

module.exports = {
  parserSync,
  fromArgs,
  toArgs,
  toArgv,
  toOpts
}