module.exports = (p = () => true) => usageFunction => (opts = []) => (
  usageFunction(opts.filter(p))
)