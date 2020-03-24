const array   = (
  types =>
  (key, args = [], {
    desc     = '',
    only     = null,
    opts     = null,
    required = false,
    values   = null
  } = {}) =>
  ({
    key,
    types,
    args,
    desc,
    only,
    opts,
    required,
    values
  })
)

const number  = array(['number'])
const string  = array(['string'])
const bool    = array(['bool'])
const flag    = array([])
const command = array(null)

module.exports = {
  array,
  number,
  string,
  bool,
  flag,
  command
}