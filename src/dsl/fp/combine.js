module.exports = (...options) => {
  let errs2   = []
  const args2 = {}

  for (let i = 0; i < options.length; i++) {
    const {errs = [], args} = options[i]

    if (errs.length > 0) {
      errs2 = errs2.concat(errs)
    } else {
      const keys = Object.keys(args)

      for (let j = 0; j < keys.length; j++) {
        const key  = keys[j]
        const list = args[key]
        if (typeof args2[key] === 'undefined') {
          if (typeof list !== 'undefined' && list !== null && list.length > 0) {
            args2[key] = list
          } else {
            args2[key] = []
            // ADD ERROR!
            errs2.push({msg: 'FOOOOO #1', info: {list}})
          }
        } else {
          const types = args2[key][0].types || []
          for (let k = 0; k < list.length; k++) {
            const elem = list[k]
            if (typeof elem.types === 'undefined') {
              // ADD ERROR!
              errs2.push({msg: 'FOOOOO #2', info: {elem}})
            } else if (elem.types === types || elem.types.length === types.length) {
              args2[key].push(elem)
            } else {
              // ADD ERROR!
              errs2.push({msg: 'FOOOOO #3', info: {elem}})
            }
          }
        }
      }
    }
  }

  return {errs: errs2, args: args2}
}