import { NumValue } from 'common/src/logic/game.ts';
import { assertUnreachable, DeepReadonly, hashMemo } from 'common/src/util/util.ts';
import { ActionIcon, Group, Badge } from '@mantine/core';
import ModifiableNumberInput from 'common/src/components/ModifiableNumberInput.tsx';
import {
  numValueType2DefaultValue,
  numValueType2DisplayName,
} from 'common/src/logic/data.ts';
import {
  faPen, faQuestion, faScissors, faCalculator, faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import SelectionMenu from './SelectionMenu.tsx';
import StrEditor from './StrEditor.tsx';
import ElementEditor from './ElementEditor.tsx';

type NumEditorProps<K extends NumValue['type']> = {
  num: DeepReadonly<NumValue & { type: K }>,
  setNum: (num: DeepReadonly<NumValue>) => void,
  original: DeepReadonly<NumValue & { type: K }> | 'none'
}

function LiteralNumEditor({ num, setNum, original }: NumEditorProps<'literal'>) {
  return (
    <ModifiableNumberInput
      value={num.value}
      setValue={(res) => {
        setNum({ type: 'literal', value: res });
      }}
      originalValue={original === 'none' ? num.value : original.value}
      positiveOnly
    />
  );
}

function QueryNumEditor({ num, setNum, original }: NumEditorProps<'query'>) {
  return (
    <Badge m={8}>Query</Badge>
  );
}

function ModNumEditor({ num, setNum, original }: NumEditorProps<'mod'>) {
  return (
    <Group>
      <NumEditor
        num={num.a}
        setNum={(newA) => setNum({ ...num, a: newA })}
        original={original === 'none' ? 'none' : original?.a ?? 'none'}
      />
      <Badge m={8}>%</Badge>
      <NumEditor
        num={num.n}
        setNum={(newN) => setNum({ ...num, n: newN })}
        original={original === 'none' ? 'none' : original?.n ?? 'none'}
      />
    </Group>
  );
}

function FromStrNumEditor({ num, setNum, original }: NumEditorProps<'from-string'>) {
  return (
    <>
      <Badge m={8}>Number From String</Badge>
      <StrEditor
        str={num.str}
        setStr={(newStr) => setNum({ ...num, str: newStr })}
        original={original === 'none' ? 'none' : num.str}
      />
    </>
  );
}

function BlankNumEditor({ num, setNum, original }: NumEditorProps<'blank'>) {
  return (
    <SelectionMenu
      label="Number"
      onSelect={(type: NumValue['type']) => setNum(numValueType2DefaultValue[type])}
      options={[
        {
          id: 'literal',
          displayName: numValueType2DisplayName.literal,
          icon: faPen,
          color: 'blue',
        },
        {
          id: 'query',
          displayName: numValueType2DisplayName.query,
          icon: faQuestion,
          color: 'grape',
        },
        {
          id: 'from-string',
          displayName: numValueType2DisplayName['from-string'],
          icon: faScissors,
          color: 'green',
        },
        {
          id: 'mod',
          displayName: numValueType2DisplayName.mod,
          icon: faCalculator,
          color: 'orange',
        },
      ]}
    >
      <ActionIcon size="lg" color="cyan" variant="light"><FontAwesomeIcon icon={faPlus} /></ActionIcon>
    </SelectionMenu>
  );
}

const NumEditor = hashMemo(({ num, setNum, original }: NumEditorProps<NumValue['type']>) => {
  const { type } = num;
  let elements: React.JSX.Element;
  switch (type) {
    case 'literal':
      elements = <LiteralNumEditor num={num} setNum={setNum} original={original as any} />;
      break;
    case 'query':
      elements = <QueryNumEditor num={num} setNum={setNum} original={original as any} />;
      break;
    case 'mod':
      elements = <ModNumEditor num={num} setNum={setNum} original={original as any} />;
      break;
    case 'from-string':
      elements = <FromStrNumEditor num={num} setNum={setNum} original={original as any} />;
      break;
    case 'blank':
      elements = <BlankNumEditor num={num} setNum={setNum} original={original as any} />;
      break;
    default:
      throw assertUnreachable(type);
  }

  return (
    <ElementEditor
      value={num}
      setValue={setNum}
      displayName={numValueType2DisplayName[type]}
      type="number"
      original={original}
    >
      {elements}
    </ElementEditor>
  );
});
export default NumEditor;
