import React from 'react';
import {
  Group, Space, Stack, Text, Title,
} from '@mantine/core';
import { LandingPage } from './home/writeup.tsx';

export default function Home() {
  return (
    <Stack justify="center">
      <LandingPage />
    </Stack>
  );
}
