import React, { useEffect, useState } from "react";
import { connect } from "redux-zero/react";
import useAsyncEffect from "use-async-effect";
import { BlockLoading } from "react-loadingg";
import { MdClose } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import actions, { ActionTypes } from "../actions";
import { socket } from "../socket";
import { AppState } from "../store";
import { GameAction, GameActionSelectMatch } from "../types/game";
import { Result, Message } from "../types/server";
import {
  attachServerListener,
  emitToServer,
  getServerResponse,
  removeServerListener,
} from "../utils/server";
import GoStop from "./GoStop";
import TextButton from "./TextButton";
import IconButton from "./IconButton";

const RoomGameStarted: React.FC<{ id: string } & AppState & ActionTypes> = ({
  id,
  updateGame,
  game,
  clientId,
}) => {
  useEffect(() => {
    const listener = (message: Result<Message["spectate game response"]>) => {
      if (message.success) {
        updateGame(message.result);
      }
    };
    emitToServer("spectate game", { room: id });
    attachServerListener("spectate game response", listener);

    return () => removeServerListener("spectate game response", listener);
  }, [id, updateGame]);

  const isMyTurn = game && game.players[game.state.player] === clientId;

  useAsyncEffect(async () => {
    if (!socket) return;
    if (!game) return;
    if (!isMyTurn) return;
    if (!Object.values(game.flags).some((v: boolean) => v)) return;

    let action: GameAction | null = null;
    if (game.flags.go) {
      // eslint-disable-next-line no-restricted-globals
      const go = confirm(`Go?`);
      action = { kind: "go", option: go };
    } else if (game.flags.shaking) {
      // eslint-disable-next-line no-restricted-globals
      const shaking = confirm(`Shake?`);
      action = { kind: "shaking", option: shaking };
    } else if (game.flags.select_match) {
      // eslint-disable-next-line no-restricted-globals
      const option = confirm(
        `${(game.actions[0] as GameActionSelectMatch).match} (ok) or ${
          (game.actions[1] as GameActionSelectMatch).match
        } (cancel)?`
      );
      action = {
        kind: "select match",
        match: option
          ? (game.actions[0] as GameActionSelectMatch).match
          : (game.actions[1] as GameActionSelectMatch).match,
      };
    } else if (game.flags.move_animal_9) {
      // eslint-disable-next-line no-restricted-globals
      const moveAnimal9 = confirm(`move animal 9?`);
      action = { kind: "move animal 9", option: moveAnimal9 };
    } else if (game.flags.four_of_a_month) {
      // eslint-disable-next-line no-restricted-globals
      const fourOfAMonth = confirm(`end by four of a month?`);
      action = { kind: "four of a month", option: fourOfAMonth };
    }

    socket.emit("play", { client: clientId, action });
    const playMessage = await getServerResponse("play response");
    if (playMessage.success) {
      updateGame(playMessage.result);
    } else {
      console.error(playMessage.error);
    }
  }, [socket, game, updateGame]);

  const index = game?.players.findIndex((p) => p === clientId) as -1 | 0 | 1;

  const [showLogs, setShowLogs] = useState(false);

  return game === null ? (
    <div className="w-full h-full">
      <BlockLoading />
    </div>
  ) : (
    <div className="w-full h-full">
      <div className="fixed z-50">
        <TextButton
          size="sm"
          onClick={async () => {
            if (!socket) return;
            if (!clientId) return;
            socket.emit("end game", { client: clientId });
            const endGameMessage = await getServerResponse("end game response");
            if (!endGameMessage.success) {
              console.error(endGameMessage.error);
            }
          }}
        >
          End Game
        </TextButton>
      </div>
      <div className="fixed z-30 right-0 top-0">
        <IconButton
          onClick={() => {
            setShowLogs((s) => !s);
          }}
        >
          {showLogs ? <MdClose /> : <IoIosArrowDown />}
        </IconButton>
      </div>
      {showLogs && (
        <div
          className="fixed right-0 top-0 text-xs max-w-md overflow-y-auto z-20 bg-white bg-opacity-75 p-4 rounded-xl"
          style={{ maxHeight: "10rem" }}
        >
          <pre className="max-w-md break-all whitespace-pre-wrap">
            {game.logs.join("\n")}
          </pre>
        </div>
      )}
      <GoStop
        game={game}
        player={index === -1 ? null : index}
        clientId={clientId}
        updateGame={updateGame}
      />
    </div>
  );
};

export default connect<AppState>((s) => s, actions)(RoomGameStarted);
