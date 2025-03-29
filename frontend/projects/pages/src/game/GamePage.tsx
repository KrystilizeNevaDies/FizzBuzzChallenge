import React, { MutableRefObject, useRef, useState } from 'react';
import {
  Button,
  Center,
  Chip,
  Group,
  Input,
  Loader,
  LoadingOverlay,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useEventListener, useInputState, useDocumentTitle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { GAME_RUNTIME_API, GAME_STORAGE_API } from 'common/src/network/server.ts';
import { Game } from 'common/src/logic/game.ts';

type PreviousStatus = { intent: 'success' | 'fail', message: string }

function notifyUser(wasCorrect: boolean, guess: string) {
  if (wasCorrect) {
    notifications.show({
      title: 'Correct!',
      message:
  <Group justify="center">
    <Text>
      You guessed
      <Text span>{guess}</Text>
      {' '}
      Correctly!
    </Text>
  </Group>,
    });
  } else {
    notifications.show({
      title: 'Incorrect!',
      message: `You guessed "${guess}" incorrectly!`,
    });
  }
}

export default function GamePage() {
  useDocumentTitle('FizzBuzz - Game');
  const { gameCode } = useParams();
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [previousStatus, setPreviousStatus] = useState<PreviousStatus | null>(null);

  // fetch game for display purposes
  const { data: game, isPending: gamePending, error: gameError } = useQuery({
    queryKey: ['game'],
    queryFn: async () => {
      if (gameCode == null) {
        return null;
      }
      const storage = await GAME_STORAGE_API.gameStorageGetGameCodeGet({ gameCode });
      return {
        gameCode: storage.gameCode!,
        game: JSON.parse(storage.game!) as Game,
      };
    },
  });

  // fetch query for game
  const {
    data: query, isPending: queryPending, error: queryError, refetch: refreshQuery,
  } = useQuery({
    queryKey: ['query'],
    queryFn: async () => {
      if (gameCode == null) {
        return null;
      }
      return GAME_RUNTIME_API.gameRuntimeQueryGameCodeGet({ gameCode });
    },
  });

  const isLoading = queryPending || isValidating;

  const onSubmit = async (response: string) => {
    if (gameCode == null || query == null || isLoading) {
      // user clicked before all the data is ready
      return false;
    }
    try {
      setIsValidating(true);

      const wasCorrect = await GAME_RUNTIME_API.gameRuntimeRunGameCodeGet({ gameCode, query, response });
      notifyUser(wasCorrect, response);
      await refreshQuery();

      if (wasCorrect) {
        setPreviousStatus({
          intent: 'success',
          message: `"${response}" was correct!`,
        });
      } else {
        setPreviousStatus({
          intent: 'fail',
          message: `"${response}" was incorrect!`,
        });
      }

      return wasCorrect;
    } finally {
      setIsValidating(false);
    }
  };

  if (queryError != null) {
    return <Text c="red">{queryError.message}</Text>;
  }

  if (game == null) {
    return <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;
  }

  return (
    <>
      <Title>{game.game.displayName!}</Title>
      <Space h={32} />
      {isLoading && <Loader size={24} height={32} />}
      {!isLoading && <Chip checked={false} height={32} size="md">{query}</Chip>}
      <Space h={32} />
      <Center>
        <InputFields loading={isValidating} onSubmit={onSubmit} message={previousStatus} />
      </Center>
    </>
  );
}

function InputFields(props: {
  loading: boolean,
  onSubmit: (userGuess: string) => Promise<boolean>,
  message: PreviousStatus | null
}) {
  const { loading, message, onSubmit: onSubmitGuess } = props;
  const [userGuess, setUserGuess] = useInputState('');
  const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

  const onSubmit = async () => {
    if (userGuess === '') {
      return;
    }

    await onSubmitGuess(userGuess);

    // after submitting a response, select the full text

    // we need to focus before we can select the text, and that requires the next animation frame
    requestAnimationFrame(() => {
      if (inputRef.current != null) {
        inputRef.current.focus();

        // we need the focus to actually be processed before selecting, so wait another animation frame
        requestAnimationFrame(() => {
          if (inputRef.current != null) {
            inputRef.current.select();
          }
        });
      }
    });
  };

  const wrapperRef = useEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      void onSubmit();
    }
  });

  return (
    <Input.Wrapper
      ref={wrapperRef}
      label="Response"
      description={message != null && (
      <Text
        c={message.intent === 'success' ? 'green' : 'red'}
        size="sm"
        span
      >
        {message.message}
      </Text>
      )}
    >
      <Group>
        <Input
          ref={inputRef}
          disabled={loading}
          size="md"
          radius="xs"
          value={userGuess}
          onChange={setUserGuess}
          autoFocus
        />
        <Button
          disabled={loading}
          variant="light"
          rightSection={loading ? <Loader color="blue" size={16} /> : <FontAwesomeIcon icon={faArrowRight} width={16} />}
          size="md"
          mt="5"
          onClick={onSubmit}
        >
          Enter
        </Button>
      </Group>
    </Input.Wrapper>
  );
}
