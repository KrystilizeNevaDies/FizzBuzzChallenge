export type Game = {
  displayName: string
  condition: Condition
}

export type Condition = {
  type: 'literal'
  value: boolean
} | {
  type: 'num-equals'
  values: NumValue[]
} | {
  type: 'str-equals'
  values: StrValue[]
} | {
  type: 'all'
  conditions: Condition[]
} | {
  type: 'first' // use the first condition where the test is true
  candidates: { test: Condition, value: Condition }[]
} | {
  type: 'blank'
}

export type StrValue = {
  type: 'literal'
  value: string
} | {
  type: 'response'
} | {
  type: 'blank'
}

export type NumValue = {
  type: 'literal'
  value: number
} | {
  type: 'query'
} | {
  type: 'mod'
  a: NumValue // number to mod
  n: NumValue // modulo
} | {
  type: 'from-string'
  str: StrValue
} | {
  type: 'blank'
}
