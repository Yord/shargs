module.exports = f => usageFunction => (opts = []) => (
  usageFunction(opts.map(f))
)