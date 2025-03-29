import React, { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import {
  Button, MantineProvider, Paper, Space,
} from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Home from './Home.tsx';
import './main.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import AppWrapper from './AppWrapper.tsx';

const queryClient = new QueryClient();

const GamePage = lazy(() => import('./game/GamePage.tsx'));
const ConfigurationPage = lazy(() => import('./configuration/ConfigurationPage.tsx'));

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MantineProvider defaultColorScheme="dark">
          <Notifications />
          <AppWrapper>
            <Routes>
              <Route index element={<Home />} />
              <Route path="game/:gameCode" element={<GamePage />} />
              <Route path="configuration" element={<ConfigurationPage />} />
              <Route path="*" element={<>404</>} />
            </Routes>
          </AppWrapper>
        </MantineProvider>
      </QueryClientProvider>
    </StrictMode>
  </BrowserRouter>,
);
