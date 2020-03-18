module.exports = (f = a => a) => usageFunction => (opts = []) => (
  usageFunction(opts.map(f))
)