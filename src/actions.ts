import Store from "redux-zero/interfaces/Store";
import { AppState } from "./store";
import { Game } from "./types/game";
import { Room } from "./types/server";

const updateClientId = (store: Store<AppState>) => (
  state: AppState,
  clientId: string
) => {
  localStorage.setItem("clientId", clientId);
  return { clientId } as Partial<AppState>;
};
const updateRooms = (store: Store<AppState>) => (
  state: AppState,
  rooms: Room[]
) => {
  return { rooms } as Partial<AppState>;
};
const updateRoomId = (store: Store<AppState>) => (
  state: AppState,
  roomId: string | null
) => {
  return { roomId } as Partial<AppState>;
};
const updateGame = (store: Store<AppState>) => (
  state: AppState,
  game: Game | null
) => {
  return { game } as Partial<AppState>;
};
type ActionsType = {
  updateClientId: ReturnType<typeof updateClientId>;
  updateRooms: ReturnType<typeof updateRooms>;
  updateRoomId: ReturnType<typeof updateRoomId>;
  updateGame: ReturnType<typeof updateGame>;
};

const actions: (store: Store<AppState>) => ActionsType = (store) => ({
  updateClientId: updateClientId(store),
  updateRooms: updateRooms(store),
  updateRoomId: updateRoomId(store),
  updateGame: updateGame(store),
});

type ConsumeState<T> = T extends (g: any, ...args: infer V) => infer W
  ? (...args: V) => W
  : unknown;

export type ActionTypes = {
  [key in keyof ReturnType<typeof actions>]: ConsumeState<
    ReturnType<typeof actions>[key]
  >;
};

export default actions;
