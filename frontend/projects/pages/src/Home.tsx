import React from 'react';
import {
  Button, Group, Space, Title,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { GAME_STORAGE_API } from 'common/src/network/server.ts';
import { Game } from 'common/src/logic/game.ts';

export default function Home() {
  // games
  const {
    data: games, isPending: gamesPending, error: gamesError, refetch: refetchGames,
  } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const gameCodes = await GAME_STORAGE_API.gameStorageListGet();
      return gameCodes.map((storage) => ({
        gameCode: storage.gameCode!,
        game: JSON.parse(storage.game!) as Game,
      })).sort((a, b) => a.game.displayName.localeCompare(b.game.displayName));
    },
  });

  const goToRandomGame = () => {
    const index = Math.floor(Math.random() * (games!).length);
    window.location.href = `game/${games![index].gameCode}`;
  };

  return (
    <>
      <Title>Home</Title>
      <Space h={64} />
      <Group justify="center">
        <Button disabled={games == null || games.length === 0} variant="light" onClick={goToRandomGame}>Random Game</Button>
        <Button variant="light" onClick={() => window.location.href = 'configuration'}>Configurate</Button>
      </Group>
    </>
  );
}
