import {
  ActionIcon, Center, Group, Paper, useMantineTheme,
} from '@mantine/core';
import { DeepReadonly } from 'common/src/util/util.ts';
import { type2Color } from 'common/src/logic/data.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Condition, NumValue, StrValue } from 'common/src/logic/game.ts';
import ElementMenu from './ElementMenu.tsx';

export type Element = Condition | NumValue | StrValue
export type ElementType = 'condition' | 'number' | 'string'

export default function ElementEditor<T extends Element>({
  value, setValue, displayName, type, original, children,
}: {
  value: DeepReadonly<T>,
  setValue: (value: DeepReadonly<T>) => void,
  displayName: string,
  type: ElementType,
  original: DeepReadonly<T> | 'none',
  children: React.JSX.Element
}) {
  const theme = useMantineTheme();

  return (
    <Paper
      withBorder
      style={{
        borderColor: type2Color[type](theme),
        borderWidth: 2,
      }}
      shadow="sm"
    >
      <Group
        justify="center"
        align="center"
        m={4}
        miw={128}
        mih={64}
      >
        {children}
        {value.type !== 'blank' && (
          <ElementMenu
            label={displayName}
            onRemove={() => setValue({ type: 'blank' } as any)}
            onReset={() => setValue(original !== 'none' ? original : value)}
          >
            <ActionIcon size="lg" color="cyan"><FontAwesomeIcon icon={faCog} /></ActionIcon>
          </ElementMenu>
        )}
      </Group>
    </Paper>
  );
}
