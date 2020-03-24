const id = (key, val, errs, args) => ({errs, args})

const rm = (key, val, errs, args) => {
  const {[key]: f, ...rest} = args
  return {errs, args: rest}
}

const isFlag = ({type, count}) => type === 'flag' && typeof count === 'number'

module.exports = function transformArgs (fs = {}) {
  return ({errs = [], args = {}} = {}) => {
    const {
      undefined: undefinedF = id,
      null:      nullF      = id,
      boolean:   booleanF   = id,
      number:    numberF    = id,
      string:    stringF    = id,
      array:     arrayF     = id,
      flag:      flagF      = id,
      function:  functionF  = rm,
      otherwise: otherwiseF = rm
    } = fs
  
    return Object.keys(args).reduce(
      ({errs: errs2, args: args2}, arg) => {
        const val = args2[arg]
        if (typeof val      === 'undefined')             return undefinedF(arg, val, errs2, args2)
        else if (val        === null)                    return nullF(     arg, val, errs2, args2)
        else if (typeof val === 'boolean')               return booleanF(  arg, val, errs2, args2)
        else if (typeof val === 'number')                return numberF(   arg, val, errs2, args2)
        else if (typeof val === 'string')                return stringF(   arg, val, errs2, args2)
        else if (Array.isArray(val))                     return arrayF(    arg, val, errs2, args2)
        else if (typeof val === 'object' && isFlag(val)) return flagF(     arg, val, errs2, args2)
        else if (typeof val === 'object') {
          const {errs: errs3, args: args3} = transformArgs(fs)({args: val})
          return {
            errs: errs2.concat(errs3),
            args: {...args2, [arg]: args3}
          }
        }
        else if (typeof val === 'function')              return functionF( arg, val, errs2, args2)
        else                                             return otherwiseF(arg, val, errs2, args2)
      },
      {errs, args}
    )
  }
}