module.exports = function flagAsBool ({errs = [], args = {}} = {}) {
  return Object.keys(args).reduce(
    ({errs: errs2, args: args2}, arg) => {
      const val = args2[arg]
      if (typeof val      === 'undefined') return {errs: errs2, args: args2}
      else if (val        === null)        return {errs: errs2, args: args2}
      else if (typeof val === 'boolean')   return {errs: errs2, args: args2}
      else if (typeof val === 'number')    return {errs: errs2, args: args2}
      else if (typeof val === 'string')    return {errs: errs2, args: args2}
      else if (Array.isArray(val))         return {errs: errs2, args: args2}
      else if (typeof val === 'object') {
        if (val.type === 'flag' && typeof val.count === 'number') {
          return {
            errs: errs2,
            args: {...args2, [arg]: val.count > 0}
          }
        } else {
          const {errs: errs3, args: args3} = flagAsBool({args: val})
          return {
            errs: errs2.concat(errs3),
            args: {...args2, [arg]: args3}
          }
        }
      } else {
        const {[arg]: f, ...rest} = args2
        return {errs: errs2, args: rest}
      }
    },
    {errs, args}
  )
}