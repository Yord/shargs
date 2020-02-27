const {br}   = require('./br')
const {text} = require('./text')

const defsFrom = id => (definitions = []) => (
  (style = {}) => (
    {[id]: {title: TITLE = {}, desc: DESC = {}} = {}} = style,
    definitions.map(({title, desc}) =>
      text(title)({line: TITLE}) +
      text(desc)({line: DESC})   +
      br(style) // We should not assume a br here by default. Make it configurable!
    ).join('')
  )
)

const defs = defsFrom('defs')

module.exports = {
  defs,
  defsFrom
}