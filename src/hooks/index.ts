import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ActionTypes } from "../actions";
import { AppState } from "../store";
import { emitToServer, getServerResponse } from "../utils/server";

type GoToMyRoomProps = Pick<RouteComponentProps, "history"> &
  Pick<AppState, "clientId" | "roomId" | "rooms"> &
  Pick<ActionTypes, "updateRoomId">;

export const goToMyRoom = (
  { history, clientId, roomId, rooms, updateRoomId }: GoToMyRoomProps,
  onlyIfGameStarted: boolean
) => async () => {
  if (roomId && rooms?.find((room) => room.id === roomId)?.gameStarted) {
    history.push(`/rooms/${roomId}`);
    return;
  }

  if (!clientId) return;

  emitToServer("my room", { client: clientId });

  const myRoomMessage = await getServerResponse("my room response");
  if (myRoomMessage.success) {
    updateRoomId(myRoomMessage.result?.id ?? null);

    if (
      myRoomMessage.result?.id &&
      (myRoomMessage.result?.gameStarted || !onlyIfGameStarted)
    ) {
      history.push(`/rooms/${myRoomMessage.result?.id}`);
    } else if (!myRoomMessage.result?.id) {
      console.error("not joined");
    }
  } else {
    console.error(myRoomMessage.error);
  }
};

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 32,
    height: 32,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
