const optsFilter = require('./optsFilter')

module.exports = optsFilter(
  ({types}) => typeof types !== 'undefined' && types !== null
)