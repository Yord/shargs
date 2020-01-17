const pipe = require('./pipe')

module.exports = (
  (f, ...fs) =>
  ({errs = []} = {}) =>
  ({errs: errs2 = [], argv = []} = {}) =>
  pipe(f, ...fs)({errs: errs.concat(errs2), argv})
)