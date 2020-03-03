const optsFilter = require('./optsFilter')

module.exports = list => optsFilter(
  ({args}) => list.some(cmd => args.includes(cmd))
)