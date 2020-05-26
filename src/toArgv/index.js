const toArgv = ({errs = [], any} = {errs: [], any: undefined}) => ({
  errs,
  argv: Array.isArray(any) && any.every(_ => typeof _ === 'string') ? any : []
})

module.exports = {
  toArgv
}