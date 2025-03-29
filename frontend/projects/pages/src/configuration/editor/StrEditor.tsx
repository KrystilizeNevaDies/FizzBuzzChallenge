import { StrValue } from 'common/src/logic/game.ts';
import { assertUnreachable, DeepReadonly, hashMemo } from 'common/src/util/util.ts';
import { ActionIcon, Badge } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faMailReply, faPlus } from '@fortawesome/free-solid-svg-icons';
import ModifiableTextInput from 'common/src/components/ModifiableTextInput.tsx';
import {
  strValue2DefaultValue,
  strValueType2DisplayName,
} from 'common/src/logic/data.ts';
import React from 'react';
import SelectionMenu from './SelectionMenu.tsx';
import ElementEditor from './ElementEditor.tsx';

type StrEditorProps<K extends StrValue['type']> = {
  str: DeepReadonly<StrValue & { type: K }>,
  setStr: (str: DeepReadonly<StrValue>) => void,
  original: DeepReadonly<StrValue & { type: K }> | 'none'
}

function LiteralStrEditor({ str, setStr, original }: StrEditorProps<'literal'>) {
  return (
    <ModifiableTextInput
      value={str.value}
      setValue={(res) => {
        setStr({ type: 'literal', value: res });
      }}
      originalValue={original === 'none' ? str.value : original.value}
    />
  );
}

function ResponseStrEditor({ str, setStr, original }: StrEditorProps<'response'>) {
  return (
    <Badge m={8}>Response</Badge>
  );
}

function BlankStrEditor({ str, setStr, original }: StrEditorProps<'blank'>) {
  return (
    <SelectionMenu
      label="String"
      onSelect={(type: StrValue['type']) => setStr(strValue2DefaultValue[type])}
      options={[
        {
          id: 'literal',
          displayName: strValueType2DisplayName.literal,
          icon: faPen,
          color: 'blue',
        },
        {
          id: 'response',
          displayName: strValueType2DisplayName.response,
          icon: faMailReply,
          color: 'grape',
        },
      ]}
    >
      <ActionIcon size="lg" color="cyan" variant="light"><FontAwesomeIcon icon={faPlus} /></ActionIcon>
    </SelectionMenu>
  );
}

const StrEditor = hashMemo(({ str, setStr, original }: StrEditorProps<StrValue['type']>) => {
  const { type } = str;
  let elements: React.JSX.Element;
  switch (type) {
    case 'literal':
      elements = <LiteralStrEditor str={str} setStr={setStr} original={original as any} />;
      break;
    case 'response':
      elements = <ResponseStrEditor str={str} setStr={setStr} original={original as any} />;
      break;
    case 'blank':
      elements = <BlankStrEditor str={str} setStr={setStr} original={original as any} />;
      break;
    default:
      throw assertUnreachable(type);
  }

  return (
    <ElementEditor
      value={str}
      setValue={setStr}
      displayName={strValueType2DisplayName[type]}
      type="string"
      original={original}
    >
      {elements}
    </ElementEditor>
  );
});
export default StrEditor;
