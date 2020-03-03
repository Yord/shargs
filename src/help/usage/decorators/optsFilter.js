module.exports = p => usageFunction => (opts = []) => (
  usageFunction(opts.filter(p))
)