import { Game, GameAction, GameEssentials } from "./game";

export type Result<S> =
  | ({ success: true } & S)
  | { success: false; error: string; errorCode: number };

export type Message = {
  "connect response": { result: string };

  "list rooms": {};
  "list rooms response": { result: Room[] };

  "my room": { client: string };
  "my room response": { result: Room | null };

  "make room": { client: string };
  "make room response": { result: Room };

  "join room": { client: string; room: string };
  "join room response": {};

  "exit room": { client: string };
  "exit room response": {};

  "start game": { client: string };
  "start game response": {};

  "end game": { client: string };
  "end game response": {};

  "spectate game": { room: string };
  "spectate game response": { result: Game };

  play: { client: string; action: GameAction };
  "play response": { result: Game };

  "estimate game": { game: GameEssentials };
  "estimate game response": { result: { policy: number[]; value: number } };
};

export interface Room {
  id: string;
  players: string[];
  gameStarted: boolean;
  singlePlayer: boolean;
}
