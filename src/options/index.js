const array   = types => (key, args = [], fields = {}) => {
  const {
    desc     = '',
    only     = null,
    opts     = null,
    required = false,
    reverse  = false,
    values   = null
  } = fields

  const {__proto__, ...rest} = fields

  return {
    ...rest,
    key,
    types,
    args,
    desc,
    only,
    opts,
    required,
    reverse,
    values
  }
}

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