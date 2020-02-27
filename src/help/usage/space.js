const {noteFrom} = require('./note')

const spaceFrom = id => noteFrom(id)('')

const space = spaceFrom('line')

module.exports = {
  space,
  spaceFrom
}