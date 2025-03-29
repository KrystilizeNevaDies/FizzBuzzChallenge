import {
  ActionIcon, Anchor, Group, LoadingOverlay, NativeSelect, Space, Text, Title,
} from '@mantine/core';
import { useDocumentTitle, useInputState } from '@mantine/hooks';
import { Game } from 'common/src/logic/game.ts';
import { useQuery } from '@tanstack/react-query';
import { DeepReadonly } from 'common/src/util/util.ts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlay, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { GAME_STORAGE_API } from 'common/src/network/server.ts';
import GameEditor from './editor/GameEditor.tsx';

export default function ConfigurationPage() {
  useDocumentTitle('FizzBuzz - Configuration');
  const [selection, setSelection] = useInputState<string | null>(null);
  const [isModifying, setIsModifying] = useState<boolean>(false);

  // fetch games
  const {
    data: games, isPending: gamesPending, error: gamesError, refetch: refetchGames,
  } = useQuery({
    queryKey: ['gameCodes'],
    queryFn: async () => {
      const gameCodes = await GAME_STORAGE_API.gameStorageListGet();
      if (selection == null) {
        setSelection(gameCodes[0]?.gameCode ?? null);
      }
      return gameCodes.map((storage) => ({
        gameCode: storage.gameCode!,
        game: JSON.parse(storage.game!) as Game,
      })).sort((a, b) => a.game.displayName.localeCompare(b.game.displayName));
    },
  });

  const isLoading = gamesPending || isModifying;
  const game = games == null ? null
    : games.find((game) => game.gameCode === selection) ?? null;

  const putGame = async (gameCode: string, newGame: DeepReadonly<Game>) => {
    setIsModifying(true);
    try {
      await GAME_STORAGE_API.gameStorageSetGameCodePut({ gameCode, body: JSON.stringify(newGame) });
      await refetchGames();
    } finally {
      setIsModifying(false);
    }
  };

  const deleteGame = async (gameCode: string) => {
    setIsModifying(true);
    try {
      await GAME_STORAGE_API.gameStorageDeleteGameCodeDelete({ gameCode });
      await refetchGames();
      setSelection(games?.find((game) => game.gameCode !== gameCode)?.gameCode ?? null);
    } finally {
      setIsModifying(false);
    }
  };

  const updateGame = async (newGame: DeepReadonly<Game>) => {
    if (selection == null) {
      return; // cannot update game without any game being selected
    }
    await putGame(selection, newGame);
  };

  const createNewGame = async () => {
    if (games == null) {
      return; // cannot create a new game before game list has been loaded
    }

    let gameCode: number = 0;
    while (games.find((game) => game.gameCode === gameCode.toString()) != null) {
      gameCode++;
    }
    await putGame(gameCode.toString(), {
      displayName: 'New Game',
      condition: { type: 'blank' },
    });
    setSelection(gameCode.toString());
  };

  if (isLoading) {
    return <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;
  }

  if (gamesError != null) {
    return <Text c="red">{gamesError.message}</Text>;
  }

  return (
    <>
      <Title>Configuration</Title>
      <Space h="sm" />
      <Group align="end" justify="center">
        <NativeSelect
          radius="xs"
          value={selection ?? undefined}
          maw={256}
          data={(games ?? []).map((storage) => ({
            value: storage.gameCode,
            label: `${storage.gameCode} - ${storage.game.displayName}`,
          }))}
          onChange={setSelection}
          flex={1}
        />
        {games != null && selection != null && (
        <ActionIcon
          color="red"
          variant="light"
          size={36}
          onClick={() => deleteGame(selection)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
        )}
        <Anchor href={`/game/${game?.gameCode}`}>
          <ActionIcon
            size="lg"
            color="cyan"
            variant="light"
          >
            <FontAwesomeIcon icon={faPlay} />
          </ActionIcon>
        </Anchor>
        <ActionIcon
          color="cyan"
          variant="light"
          size={36}
          onClick={createNewGame}
        >
          <FontAwesomeIcon icon={faPlus} />
        </ActionIcon>
      </Group>
      <Space h="sm" />
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
      {selection != null && game == null && <Text>No game found for that name.</Text>}
      {selection != null && game != null && (
      <GameEditor
        game={game.game!}
        updateGame={updateGame}
      />
      )}
    </>
  );
}
