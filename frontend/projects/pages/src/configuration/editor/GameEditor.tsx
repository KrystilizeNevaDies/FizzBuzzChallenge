import { DeepReadonly, hashMemo, objectEquals } from 'common/src/util/util.ts';
import { Condition, Game } from 'common/src/logic/game.ts';
import {
  Text, Divider, Group, Dialog, Button, Space, Center, Stack, ActionIcon,
} from '@mantine/core';
import { useClipboard, useInputState } from '@mantine/hooks';
import ModifiableTextInput from 'common/src/components/ModifiableTextInput.tsx';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import ConditionEditor from './ConditionEditor.tsx';

const GameEditor = hashMemo(({ game, updateGame, playGameLink }: {
  game: DeepReadonly<Game>
  updateGame: (newGame: DeepReadonly<Game>) => void
  playGameLink: string
}) => {
  const [displayName, setDisplayName] = useInputState<string>(game.displayName);
  const [condition, setCondition] = useInputState<DeepReadonly<Condition>>(game.condition);
  const newGame: DeepReadonly<Game> = { displayName, condition };
  const modified = !objectEquals(newGame, game);

  const discardChanges = () => {
    setDisplayName(game.displayName);
    setCondition(game.condition);
  };

  useEffect(() => {
    discardChanges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game]);

  return (
    <>
      <Group justify="center">
        <Text size="lg">
          Currently Configuring &quot;
          {game.displayName}
          &quot;
        </Text>
        <a href={playGameLink}>
          <ActionIcon
            size="lg"
            color="cyan"
            variant="light"
          >
            <FontAwesomeIcon icon={faPlay} />
          </ActionIcon>
        </a>
      </Group>
      <Divider mt={8} mb={8} />
      <Center>
        <Stack>
          <Group justify="left" grow>
            <Text>Display Name</Text>
            <ModifiableTextInput
              value={displayName}
              setValue={setDisplayName}
              originalValue={game.displayName}
            />
          </Group>
        </Stack>
      </Center>
      <Space h="md" />
      <Text>Condition</Text>
      <Dialog opened={modified} size="lg" withBorder>
        <Text>You have modified changes.</Text>
        <Space h="lg" />
        <Group>
          <Button variant="light" onClick={() => updateGame(newGame)}>Apply</Button>
          <Button variant="light" color="red" onClick={discardChanges}>Discard</Button>
        </Group>
      </Dialog>
      <ConditionEditor condition={condition} setCondition={setCondition} original={game.condition} />
    </>
  );
});
export default GameEditor;
