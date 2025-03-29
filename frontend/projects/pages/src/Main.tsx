import React, {lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { MantineProvider, Paper } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Home from './Home.tsx';
import './main.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const queryClient = new QueryClient();

const GamePage = lazy(() => import('./game/GamePage.tsx'));
const ConfigurationPage = lazy(() => import('./configuration/ConfigurationPage.tsx'));

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="dark">
          <Notifications />
          <Paper shadow="xl" radius="xs" withBorder p="xl" miw="40vw" mih="80vh">
            <Routes>
              <Route index element={<Home />} />
              <Route path="game/:gameCode" element={<GamePage />} />
              <Route path="configuration" element={<ConfigurationPage />} />
              <Route path="*" element={<>404</>} />
            </Routes>
          </Paper>
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>,
);
