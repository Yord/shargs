module.exports = ({errs = [], args: ARGS = []} = {}) => {
  const args = {...ARGS, '_': []}
  return {errs, args}
}