const addRemainingOptsAndPosArgs = opt => ({errs, opts}) => ({
  errs,
  opts: addRemaining(opt, opts)
})

module.exports = {
  addRemainingOptsAndPosArgs
}

function addRemaining (opt, opts) {
  const opts3 = []

  const opts2 = opt.opts

  for (let i = 0; i < opts.length; i++) {
    const opt3 = opts[i]

    if (isIn(opts2, opt3) > -1) {
      const opt4 = opts2.find(equals(opt3))
      const opt5 = isCommand(opt3) ? {...opt3, values: addRemaining(opt4, (opt3.values))} : opt3
      opts3.push(opt5)
    } else {
      opts3.push(opt3)
    }
  }

  for (let i = 0; i < opts2.length; i++) {
    const opt3 = opts2[i]

    if (isIn(opts, opt3) === -1) {
      const opt4 = isCommand(opt3) ? {...opt3, values: addRemaining(opt3, opt3.opts)} : opt3
      opts3.push(opt4)
    }
  }

  return opts3
}

function isIn (opts, opt) {
  return opts.findIndex(equals(opt))
}

function equals (opt1) {
  return opt2 => (
    opt1.key === opt2.key &&
    arrayEquals(opt1.args, opt2.args) &&
    (typeof opt1.types === 'undefined' || typeof opt2.types === 'undefined' || arrayEquals(opt1.types, opt2.types)) &&
    (opt1.opts || []).length === (opt2.opts || []).length
  )
}

function arrayEquals (arr1, arr2) {
  return (
    (typeof arr1 === 'undefined' && typeof arr2 === 'undefined') || (
      Array.isArray(arr1) && Array.isArray(arr2) && 
      arr1.length === arr2.length &&
      arr1.reduce((bool, elem, i) => bool && elem === arr2[i], true)
    )
  )
}

function isCommand ({types, args, opts}) {
  return Array.isArray(args) && typeof types === 'undefined' && Array.isArray(opts)
}