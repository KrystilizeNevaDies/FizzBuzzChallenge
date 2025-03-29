import { Condition, NumValue, StrValue } from 'common/src/logic/game.ts';
import {
  assertUnreachable, DeepReadonly, hashMemo, join,
} from 'common/src/util/util.ts';
import {
  ActionIcon,
  Badge,
  Container,
  Group,
  Paper,
  Pill,
  SegmentedControl,
  Stack,
} from '@mantine/core';
import React from 'react';
import { makeKeys } from 'common/src/util/reactUtils.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEquals, faObjectGroup, faPen, faPeopleLine, faPlus, faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { conditionType2DefaultValue, conditionType2DisplayName } from 'common/src/logic/data.ts';
import SelectionMenu from './SelectionMenu.tsx';
import NumEditor from './NumEditor.tsx';
import StrEditor from './StrEditor.tsx';
import ElementEditor from './ElementEditor.tsx';

type ConditionEditorProps<K extends Condition['type']> = {
  condition: DeepReadonly<Condition & { type: K }>,
  setCondition: (condition: DeepReadonly<Condition>) => void,
  original: DeepReadonly<Condition & { type: K }> | 'none'
}

function LiteralConditionEditor({ condition, setCondition, original }: ConditionEditorProps<'literal'>) {
  return (
    <SegmentedControl
      value={condition.value ? 'True' : 'False'}
      data={['True', 'False']}
      onChange={(value) => {
        setCondition({ type: 'literal', value: value === 'True' });
      }}
    />
  );
}

function NumEqualsConditionEditor({ condition, setCondition, original }: ConditionEditorProps<'num-equals'>) {
  const numEqualsCondition = condition;
  const onSetNum = (num: DeepReadonly<NumValue>, i: number) => {
    const values = [...numEqualsCondition.values];
    if (num.type === 'blank') {
      values.splice(i, 1);
    } else {
      values[i] = num;
    }
    setCondition({
      type: 'num-equals',
      values,
    });
  };
  return (
    <>
      {makeKeys(join(condition.values.map((value, i) => {
        const originalElementNum = original === 'none' ? 'none' : original?.values?.[i] ?? 'none';
        return <NumEditor num={value} setNum={(num) => onSetNum(num, i)} original={originalElementNum} />;
      }), <Badge>=</Badge>))}
      <NumEditor
        num={{ type: 'blank' }}
        setNum={(newNum) => onSetNum(newNum, condition.values.length)}
        original={{ type: 'blank' }}
      />
    </>
  );
}

function StrEqualsConditionEditor({ condition, setCondition, original }: ConditionEditorProps<'str-equals'>) {
  const strEqualsCondition = condition;
  const onSetStr = (str: DeepReadonly<StrValue>, i: number) => {
    const values = [...strEqualsCondition.values];
    if (str.type === 'blank') {
      values.splice(i, 1);
    } else {
      values[i] = str;
    }
    setCondition({
      type: 'str-equals',
      values,
    });
  };
  return (
    <>
      {makeKeys(join([...condition.values].map((value, i) => {
        const originalElementStr = original === 'none' ? 'none' : original?.values?.[i] ?? 'none';
        return <StrEditor str={value} setStr={(str) => onSetStr(str, i)} original={originalElementStr} />;
      }), <Badge>=</Badge>))}
      <StrEditor
        str={{ type: 'blank' }}
        setStr={(newStr) => onSetStr(newStr, condition.values.length)}
        original={{ type: 'blank' }}
      />
    </>
  );
}

function AllConditionEditor({ condition, setCondition, original }: ConditionEditorProps<'all'>) {
  const allCondition = condition;
  const onSetCondition = (condition: DeepReadonly<Condition>, i: number) => {
    const conditions = [...allCondition.conditions];
    if (condition.type === 'blank') {
      conditions.splice(i, 1);
    } else {
      conditions[i] = condition;
    }
    setCondition({
      type: 'all',
      conditions,
    });
  };
  return (
    <Group>
      <Pill bg="gray">ALL</Pill>
      <Container>
        {condition.conditions.map((condition, i) => {
          const originalElementCondition = original === 'none' ? 'none' : original.conditions[i];
          return (
            <ConditionEditor
              condition={condition}
              setCondition={(newCondition) => onSetCondition(newCondition, i)}
              original={originalElementCondition}
            />
          );
        })}
        <ConditionEditor
          condition={{ type: 'blank' }}
          setCondition={(newCondition) => onSetCondition(newCondition, condition.conditions.length)}
          original={{ type: 'blank' }}
        />
      </Container>
    </Group>
  );
}

function FirstConditionEditor({ condition, setCondition, original }: ConditionEditorProps<'first'>) {
  const firstCondition = condition;

  const onSetTestCondition = (condition: DeepReadonly<Condition>, i: number) => {
    const candidates = [...firstCondition.candidates];
    candidates[i] = { ...candidates[i], test: condition };
    setCondition({
      type: 'first',
      candidates,
    });
  };

  const onSetValueCondition = (condition: DeepReadonly<Condition>, i: number) => {
    const candidates = [...firstCondition.candidates];
    candidates[i] = { ...candidates[i], value: condition };
    setCondition({
      type: 'first',
      candidates,
    });
  };

  const onNewCandidate = () => {
    const candidates = [...firstCondition.candidates];
    candidates.push({
      test: { type: 'blank' },
      value: { type: 'blank' },
    });
    setCondition({
      type: 'first',
      candidates,
    });
  };

  const onRemoveCandidate = (index: number) => {
    const candidates = [...firstCondition.candidates];
    candidates.splice(index, 1);
    setCondition({
      type: 'first',
      candidates,
    });
  };

  return (
    <Group m={8} preventGrowOverflow>
      <Pill bg="gray">FIRST</Pill>
      <Paper withBorder p={8}>
        <Stack justify="flex-start" align="start">
          {makeKeys(join(condition.candidates.map(({ test, value }, i) => {
            const originalTest = original === 'none' ? 'none' : original?.candidates?.[i]?.test ?? 'none';
            const originalValue = original === 'none' ? 'none' : original?.candidates?.[i]?.value ?? 'none';

            return (
              <Paper withBorder key={i} w="100%">
                <Group m={8} preventGrowOverflow>
                  <Pill bg="gray">IF</Pill>
                  <ConditionEditor
                    condition={test}
                    setCondition={(newCondition) => onSetTestCondition(newCondition, i)}
                    original={originalTest}
                  />
                </Group>
                <Group m={8} preventGrowOverflow>
                  <Pill bg="gray">THEN</Pill>
                  <ConditionEditor
                    condition={value}
                    setCondition={(newCondition) => onSetValueCondition(newCondition, i)}
                    original={originalValue}
                  />
                </Group>
                <ActionIcon
                  size="lg"
                  color="cyan"
                  onClick={() => onRemoveCandidate(i)}
                  m={8}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </ActionIcon>
              </Paper>
            );
          }), <Pill bg="gray">ELSE</Pill>))}
          <ActionIcon size="lg" color="cyan" variant="light" onClick={onNewCandidate}><FontAwesomeIcon icon={faPlus} /></ActionIcon>
        </Stack>
      </Paper>

    </Group>
  );
}

function BlankConditionEditor({ condition, setCondition, original }: ConditionEditorProps<'blank'>) {
  return (
    <SelectionMenu
      label="Condition"
      onSelect={(type: Condition['type']) => setCondition(conditionType2DefaultValue[type])}
      options={[
        {
          id: 'literal',
          displayName: conditionType2DisplayName.literal,
          icon: faPen,
          color: 'blue',
        },
        {
          id: 'str-equals',
          displayName: conditionType2DisplayName['str-equals'],
          icon: faEquals,
          color: 'grape',
        },
        {
          id: 'num-equals',
          displayName: conditionType2DisplayName['num-equals'],
          icon: faEquals,
          color: 'green',
        },
        {
          id: 'all',
          displayName: conditionType2DisplayName.all,
          icon: faObjectGroup,
          color: 'orange',
        },
        {
          id: 'first',
          displayName: conditionType2DisplayName.first,
          icon: faPeopleLine,
          color: 'lime',
        },
      ]}
    >
      <ActionIcon size="lg" color="cyan" variant="light"><FontAwesomeIcon icon={faPlus} /></ActionIcon>
    </SelectionMenu>
  );
}

const ConditionEditor = hashMemo(({ condition, setCondition, original }: ConditionEditorProps<Condition['type']>) => {
  const { type } = condition;
  let elements: React.JSX.Element;
  switch (type) {
    case 'literal':
      elements = <LiteralConditionEditor condition={condition} setCondition={setCondition} original={original as any} />;
      break;
    case 'num-equals':
      elements = <NumEqualsConditionEditor condition={condition} setCondition={setCondition} original={original as any} />;
      break;
    case 'str-equals':
      elements = <StrEqualsConditionEditor condition={condition} setCondition={setCondition} original={original as any} />;
      break;
    case 'all':
      elements = <AllConditionEditor condition={condition} setCondition={setCondition} original={original as any} />;
      break;
    case 'first':
      elements = <FirstConditionEditor condition={condition} setCondition={setCondition} original={original as any} />;
      break;
    case 'blank':
      elements = <BlankConditionEditor condition={condition} setCondition={setCondition} original={original as any} />;
      break;
    default:
      throw assertUnreachable(type);
  }

  return (
    <ElementEditor
      value={condition}
      setValue={setCondition}
      displayName={conditionType2DisplayName[type]}
      type="condition"
      original={original}
    >
      {elements}
    </ElementEditor>
  );
});
export default ConditionEditor;
