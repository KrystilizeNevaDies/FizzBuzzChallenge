import { MantineTheme } from '@mantine/core';
import { Condition, NumValue, StrValue } from './game.ts';

export const type2Color: Record<'condition' | 'number' | 'string', (theme: MantineTheme) => string> = {
  condition: (theme) => theme.colors.orange[9],
  number: (theme) => theme.colors.blue[9],
  string: (theme) => theme.colors.green[9],
};

export const conditionType2DisplayName: Record<Condition['type'], string> = {
  'num-equals': 'Numbers Equal',
  'str-equals': 'Strings Equal',
  all: 'All',
  blank: 'Blank',
  first: 'First',
  literal: 'Boolean',
};

export const strValueType2DisplayName: Record<StrValue['type'], string> = {
  blank: 'Blank',
  literal: 'Write String',
  response: 'User Response',
};

export const numValueType2DisplayName: Record<NumValue['type'], string> = {
  blank: 'Blank',
  literal: 'Write Number',
  query: 'Query',
  'from-string': 'Number From String',
  mod: 'Modulo',
};

export const conditionType2DefaultValue: Record<Condition['type'], Condition> = {
  'num-equals': { type: 'num-equals', values: [] },
  'str-equals': { type: 'str-equals', values: [] },
  all: { type: 'all', conditions: [] },
  blank: { type: 'blank' },
  first: { type: 'first', candidates: [] },
  literal: { type: 'literal', value: true },
};

export const strValue2DefaultValue: Record<StrValue['type'], StrValue> = {
  blank: { type: 'blank' },
  literal: { type: 'literal', value: '' },
  response: { type: 'response' },
};

export const numValueType2DefaultValue: Record<NumValue['type'], NumValue> = {
  'from-string': { type: 'from-string', str: { type: 'blank' } },
  blank: { type: 'blank' },
  literal: { type: 'literal', value: 1 },
  mod: { type: 'mod', a: { type: 'blank' }, n: { type: 'blank' } },
  query: { type: 'query' },
};
