import createStore from "redux-zero";
import { Game } from "./types/game";
import { Room } from "./types/server";

export interface AppState {
  clientId: string | null;
  rooms: Room[] | null;
  roomId: string | null;
  game: Game | null;
}

const initialState: AppState = {
  clientId: null,
  rooms: null,
  roomId: null,
  game: null,
};

const store = createStore<AppState>(initialState);
export default store;
