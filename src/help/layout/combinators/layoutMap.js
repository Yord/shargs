const layout = require('./layout')

module.exports = f => itemsList => layout(
  itemsList
  .map(f)
  .map(layout)
)