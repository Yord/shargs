const optsFilter = require('./optsFilter')

module.exports = (list = []) => optsFilter(
  ({args}) => list.some(arg => args.includes(arg))
)