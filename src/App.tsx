import React, { useEffect } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { connect } from "redux-zero/react";
import useAsyncEffect from "use-async-effect";

import actions, { ActionTypes } from "./actions";
import { AppState } from "./store";
import Rooms from "./pages/Rooms";
import Main from "./pages/Main";
import {
  attachServerListener,
  emitToServer,
  getServerResponse,
  removeServerListener,
} from "./utils/server";
import { assert } from "./utils/test";
import { Message, Result } from "./types/server";
import { socket } from "./socket";
import NotFound from "./pages/NotFound";

type AppProps = AppState & ActionTypes;

const App: React.FC<AppProps> = ({
  clientId,
  updateClientId,
  updateRoomId,
  updateRooms,
}) => {
  // server check
  useAsyncEffect(async () => {
    if (!socket) return;
    const welcomeMessage = await getServerResponse("connect response");
    if (welcomeMessage.success) {
      try {
        assert(welcomeMessage.message.split(" ")[1].slice(0, -1) === socket.id);
        console.log("connected!");
      } catch {
        console.error("Socket id does not match");
      }
    }
  }, [socket.connected]);

  // initialize client id from the localStorage
  useEffect(() => {
    updateClientId(localStorage.getItem("clientId") ?? "");
  }, [updateClientId]);

  // initialize my room whenever (socket and) clientId changes
  useAsyncEffect(async () => {
    if (!clientId) return;

    emitToServer("my room", { client: clientId });
    const myRoomMessage = await getServerResponse("my room response");
    if (myRoomMessage.success) {
      updateRoomId(myRoomMessage.result?.id ?? null);
    } else {
      console.error(myRoomMessage.error);
    }
  }, [clientId]);

  useEffect(() => {
    emitToServer("list rooms", {});

    const listRoomsListener = (
      message: Result<Message["list rooms response"]>
    ) => {
      if (message.success) {
        updateRooms(message.result);
      }
    };
    attachServerListener("list rooms response", listRoomsListener);

    return () => {
      removeServerListener("list rooms response", listRoomsListener);
    };
  }, [updateRooms]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/rooms/:roomId" component={Rooms} />
        <Route path="/rooms" render={() => <Redirect to="/" />} />
        <Route exact path="/" render={(props) => <Main {...props} />} />
        <Route path="/" render={(props) => <NotFound {...props} />} />
      </Switch>
    </BrowserRouter>
  );
};

export default connect<AppState>((s) => s, actions)(App);
