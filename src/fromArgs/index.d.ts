import {Args, Err} from '../parserSync'

export const fromArgs: <B>(obj?: {errs?: Err[], args?: Args[]}) => B