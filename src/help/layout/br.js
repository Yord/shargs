const line = require('./line')

const brFrom = id => line('', id)

const br = brFrom('line')

module.exports = {
  br,
  brFrom
}