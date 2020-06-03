const toArgv = any => ({
  errs: [],
  argv: Array.isArray(any) && any.every(_ => typeof _ === 'string') ? any : []
})

module.exports = {
  toArgv
}