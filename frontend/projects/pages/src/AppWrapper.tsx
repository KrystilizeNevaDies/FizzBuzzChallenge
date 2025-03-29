import React from 'react';
import {
  AppShell, Burger, Divider, NavLink, Space, Text, Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {faHome, faCog, faPlay, faGamepad} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { GAME_STORAGE_API } from 'common/src/network/server.ts';
import { Game } from 'common/src/logic/game.ts';

export default function AppWrapper({ children }: { children: React.JSX.Element}) {
  const [opened, { toggle }] = useDisclosure();
  const path = window.location.pathname;

  // games
  const { data: games } = useQuery({
    queryKey: ['games'],
    queryFn: async () => {
      const gameCodes = await GAME_STORAGE_API.gameStorageListGet();
      return gameCodes.map((storage) => ({
        gameCode: storage.gameCode!,
        game: JSON.parse(storage.game!) as Game,
      })).sort((a, b) => a.game.displayName.localeCompare(b.game.displayName));
    },
  });

  const loadedGames = games ?? [];

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <NavLink
          href="/"
          label="Home"
          variant="light"
          leftSection={<FontAwesomeIcon icon={faHome} width={16} />}
          active={path === '/'}
        />
        <NavLink
          href="/configuration"
          label="Configuration"
          variant="light"
          leftSection={<FontAwesomeIcon icon={faCog} width={16} />}
          active={path === '/configuration'}
        />

        <NavLink
          label="Games"
          childrenOffset={28}
          leftSection={<FontAwesomeIcon icon={faGamepad} width={16} />}
          active={path.startsWith('/game')}
          defaultOpened={path.startsWith('/game')}
        >
          {loadedGames.map(({ gameCode, game }) => (
            <NavLink
              key={gameCode}
              href={`/game/${gameCode}`}
              label={game.displayName}
              variant="light"
              leftSection={<FontAwesomeIcon icon={faPlay} width={16} />}
              active={path === `/game/${gameCode}`}
            />
          ))}
        </NavLink>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
