module.exports = (prefix = '--no-') => (opt = {}) => {
  const {args = [], defaultValues, reverse = false, ...rest} = opt
  const args2 = args.map(prefixWith(prefix))
  return {...rest, reverse: !reverse, args: args2}
}

function prefixWith (prefix) {
  return arg => prefix + removeLeadingDashes(arg)
}

function removeLeadingDashes (arg) {
  return arg.length > 0 && arg[0] === '-' ? removeLeadingDashes(arg.slice(1)) : arg
}