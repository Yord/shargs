import {Err} from '../parser'

export const toArgv: <A>(any?: A) => {errs: Err[], argv?: string[]}