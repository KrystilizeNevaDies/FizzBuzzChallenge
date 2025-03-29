import {
  Configuration, DefaultConfig, GameRuntimeApi, GameStorageApi,
} from 'client/src/index.ts';

export const API_URL = 'http://localhost:5108';

DefaultConfig.config = new Configuration({
  basePath: API_URL,
});

export const GAME_STORAGE_API = new GameStorageApi();
export const GAME_RUNTIME_API = new GameRuntimeApi();
