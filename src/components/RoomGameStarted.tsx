import React, { useEffect, useState } from "react";
import { connect } from "redux-zero/react";
import useAsyncEffect from "use-async-effect";
import { BlockLoading } from "react-loadingg";
import { MdClose, MdLanguage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import actions, { ActionTypes } from "../actions";
import { socket } from "../socket";
import { AppState } from "../store";
import { GameActionSelectMatch } from "../types/game";
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
import CardButton from "./CardButton";
import { RouteComponentProps } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useTranslation } from "react-i18next";
import { capitalize } from "../utils/string";

const RoomGameStarted: React.FC<
  RouteComponentProps & { id: string } & AppState & ActionTypes
> = ({ id, updateGame, game, clientId, roomId, ...routeComponentProps }) => {
  const { addToast } = useToasts();

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

  const { t, i18n } = useTranslation();

  const isMyTurn = game && game.players[game.state.player] === clientId;
  const [showLogs, setShowLogs] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactElement | null>(
    null
  );

  useAsyncEffect(async () => {
    if (!socket) return;
    if (!game) return;
    if (!isMyTurn) return;
    if (!Object.values(game.flags).some((v: boolean) => v)) return;

    if (game.flags.go) {
      setShowDialog(true);
      setDialogContent(
        <>
          <h2 className="font-black text-xl text-gray-800 mb-3">
            {t("Declare Go?")}
          </h2>
          <div className="flex justify-center">
            <TextButton
              style={{ minWidth: "3em", marginRight: "2em" }}
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "go", option: true },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("go"))}</span>
            </TextButton>
            <TextButton
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "go", option: false },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("stop"))}</span>
            </TextButton>
          </div>
        </>
      );
    } else if (game.flags.shaking) {
      setShowDialog(true);
      setDialogContent(
        <>
          <h2 className="font-black text-xl text-gray-800 mb-3">
            {t("Shake cards?")}
          </h2>
          <div
            style={{
              maxWidth: "calc(80% + 2em)",
              margin: "auto",
              marginTop: "2em",
            }}
          >
            <div
              className="flex justify-between"
              style={{ maxWidth: "14em", margin: "auto" }}
            >
              {game.state.shaking![1].map((card) => (
                <CardButton
                  key={card}
                  card={card}
                  hoverEnabled={false}
                  style={{ maxWidth: "4em", width: "30%", cursor: "default" }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <TextButton
              style={{ minWidth: "3em", marginRight: "2em" }}
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "shaking", option: true },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("yes"))}</span>
            </TextButton>
            <TextButton
              style={{ minWidth: "3em" }}
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "shaking", option: false },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("no"))}</span>
            </TextButton>
          </div>
        </>
      );
    } else if (game.flags.select_match) {
      setShowDialog(true);
      setDialogContent(
        <>
          <h2 className="font-black text-xl text-gray-800 mb-3">
            {t("Please Choose a Card to Capture.")}
          </h2>
          <div
            style={{
              maxWidth: "calc(80% + 2em)",
              margin: "auto",
              marginTop: "2em",
            }}
          >
            <div
              className="flex justify-between"
              style={{ maxWidth: "14em", margin: "auto" }}
            >
              <CardButton
                card={(game.actions[0] as GameActionSelectMatch).match}
                style={{ maxWidth: "6em", width: "40%" }}
                onClick={async () => {
                  emitToServer("play", {
                    client: clientId!,
                    action: {
                      kind: "select match",
                      match: (game.actions[0] as GameActionSelectMatch).match,
                    },
                  });
                  setShowDialog(false);
                  const playMessage = await getServerResponse("play response");
                  if (playMessage.success) {
                    updateGame(playMessage.result);
                  } else {
                    setShowDialog(true);
                    addToast(playMessage.error, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  }
                }}
              />
              <CardButton
                card={(game.actions[1] as GameActionSelectMatch).match}
                style={{ maxWidth: "6em", width: "40%" }}
                onClick={async () => {
                  emitToServer("play", {
                    client: clientId!,
                    action: {
                      kind: "select match",
                      match: (game.actions[1] as GameActionSelectMatch).match,
                    },
                  });
                  setShowDialog(false);
                  const playMessage = await getServerResponse("play response");
                  if (playMessage.success) {
                    updateGame(playMessage.result);
                  } else {
                    setShowDialog(true);
                    addToast(playMessage.error, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  }
                }}
              />
            </div>
          </div>
        </>
      );
    } else if (game.flags.move_animal_9) {
      setShowDialog(true);
      setDialogContent(
        <>
          <h2 className="font-black text-xl text-gray-800 mb-3">
            {t("Use Animal of September As a Double Junk?")}
          </h2>
          <div className="flex justify-center">
            <TextButton
              style={{ minWidth: "3em", marginRight: "2em" }}
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "move animal 9", option: true },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("yes"))}</span>
            </TextButton>
            <TextButton
              style={{ minWidth: "3em" }}
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "move animal 9", option: false },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("no"))}</span>
            </TextButton>
          </div>
        </>
      );
    } else if (game.flags.four_of_a_month) {
      setShowDialog(true);
      setDialogContent(
        <>
          <h2 className="font-black text-xl text-gray-800 mb-3">
            {t("Finish the Game with Four-of-a-Month?")}
          </h2>
          <div className="flex justify-center">
            <TextButton
              style={{ minWidth: "3em", marginRight: "2em" }}
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "four of a month", option: true },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("yes"))}</span>
            </TextButton>
            <TextButton
              style={{ minWidth: "3em" }}
              onClick={async () => {
                emitToServer("play", {
                  client: clientId!,
                  action: { kind: "four of a month", option: false },
                });
                setShowDialog(false);
                const playMessage = await getServerResponse("play response");
                if (playMessage.success) {
                  updateGame(playMessage.result);
                } else {
                  setShowDialog(true);
                  addToast(playMessage.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                }
              }}
            >
              <span>{capitalize(t("no"))}</span>
            </TextButton>
          </div>
        </>
      );
    }
  }, [socket, game, updateGame]);

  const index = game?.players.findIndex((p) => p === clientId) as -1 | 0 | 1;
  const involved = !!clientId && game?.players.includes(clientId);

  return game === null ? (
    <div className="w-full h-full">
      <BlockLoading />
    </div>
  ) : (
    <div className="w-full h-full">
      <div className="fixed z-50">
        {involved && (
          <TextButton
            size="sm"
            onClick={async () => {
              if (!socket) return;
              if (!clientId) return;
              socket.emit("end game", { client: clientId });
              const endGameMessage = await getServerResponse(
                "end game response"
              );
              if (!endGameMessage.success) {
                addToast(endGameMessage.error, {
                  appearance: "error",
                  autoDismiss: true,
                });
              }
            }}
          >
            End Game
          </TextButton>
        )}
      </div>
      <div className="fixed z-30 right-0 top-0">
        <IconButton
          onClick={() => {
            setShowLogs((s) => !s);
          }}
        >
          {showLogs ? <MdClose /> : <IoIosArrowDown />}
        </IconButton>
        <IconButton
          onClick={() => {
            i18n.changeLanguage(i18n.language !== "ko" ? "ko" : "en");
          }}
        >
          <MdLanguage />
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
        roomId={roomId}
        updateGame={updateGame}
        {...routeComponentProps}
      />
      {showDialog && (
        <div
          className="w-full h-full flex place-items-center fixed z-10 top-0 left-0"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
          }}
        >
          <div className="p-8 bg-white rounded-2xl w-2/3 text-center m-auto">
            {dialogContent}
          </div>
        </div>
      )}
    </div>
  );
};

export default connect<AppState>((s) => s, actions)(RoomGameStarted);
