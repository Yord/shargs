import {Args, Err} from '../parser'

export const fromArgs: <B>(obj?: {errs?: Err[], args?: Args[]}) => B