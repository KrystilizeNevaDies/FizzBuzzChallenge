import React from 'react';
import {
  Button, Group, Title, Space,
} from '@mantine/core';

export default function Home() {
  return (
    <>
      <Title>Home</Title>
      <Space h={64} />
      <Group justify="center">
        <Button variant="light" onClick={() => window.location.href = 'game'}>Play</Button>
        <Button variant="light" onClick={() => window.location.href = 'configuration'}>Configurate</Button>
      </Group>
    </>
  );
}
