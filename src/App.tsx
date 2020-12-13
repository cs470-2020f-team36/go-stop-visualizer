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
import { useToasts } from "react-toast-notifications";
import Estimate from "./pages/Estimate";

type AppProps = AppState & ActionTypes;

const App: React.FC<AppProps> = ({
  clientId,
  updateClientId,
  updateRoomId,
  updateRooms,
}) => {
  const { addToast } = useToasts();

  // preload images
  useEffect(() => {
    const images = [
      ...[2, 4, 5, 6, 7, 8, 9, 10, 12].map(
        (m) => `A${m.toString().padStart(2, "0")}`
      ),
      ...[1, 3, 8, 11, 12].map((m) => `B${m.toString().padStart(2, "0")}`),
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        .map((m) => `J${m.toString().padStart(2, "0")}`)
        .map((s) => [s + "0", s + "1"])
        .flat(),
      ...["J110", "J111", "J112", "J120"],
      ...[1, 2, 3, 4, 5, 6, 7, 9, 10, 12].map(
        (m) => `R${m.toString().padStart(2, "0")}`
      ),
      ...["bomb", "bonus2", "bonus3", "hidden"],
    ];
    images.forEach((slug) => {
      new Image().src = `/images/cards/${slug}.png`;
    });
  }, []);

  // server check
  useAsyncEffect(async () => {
    if (!socket) return;
    const welcomeMessage = await getServerResponse("connect response");
    if (welcomeMessage.success) {
      try {
        assert(welcomeMessage.result.split(" ")[1].slice(0, -1) === socket.id);
        console.info("Connected to the server.");
      } catch {
        addToast("Socket id does not match", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    } else {
      addToast(welcomeMessage.error, {
        appearance: "error",
        autoDismiss: true,
      });
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
      addToast(myRoomMessage.error, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }, [clientId]);

  // update state.rooms on list rooms response
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
        <Route
          exact
          path="/estimate"
          render={(props) => <Estimate {...props} />}
        />
        <Route exact path="/" render={(props) => <Main {...props} />} />
        <Route path="/" render={(props) => <NotFound {...props} />} />
      </Switch>
    </BrowserRouter>
  );
};

export default connect<AppState>((s) => s, actions)(App);
