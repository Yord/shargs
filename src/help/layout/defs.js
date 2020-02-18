const br   = require('./br')
const text = require('./text')

// Do something with id
module.exports = (definitions = [], id = 'defs') => (
  (style = {}) => (
    {[id]: {title: TITLE = {}, desc: DESC = {}} = {}} = style,
    definitions.map(({title, desc}) =>
      text(title)({line: TITLE}) +
      text(desc)({line: DESC})   +
      br()(style) // We should not assume a br here by default. Make it configurable!
    ).join('')
  )
)