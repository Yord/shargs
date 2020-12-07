import {Err, Opt} from './parser'

export const verifyCommand: (opt?: Opt) =>
                            {errs: Err[], opt: Opt}