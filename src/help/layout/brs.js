const br = require('./br')

module.exports = (length = 1, id = undefined) => (
  (style = {}) => (
    Array.from({length}, () => br(id)(style)).join('')
  )
)