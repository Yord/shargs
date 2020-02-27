const {lineFrom} = require('./line')

const brFrom = id => lineFrom(id)('')

const br = brFrom('line')

module.exports = {
  br,
  brFrom
}