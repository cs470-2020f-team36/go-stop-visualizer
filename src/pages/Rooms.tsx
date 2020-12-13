// a page component for `/rooms/${roomId}`

import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { connect } from "redux-zero/react";
import actions, { ActionTypes } from "../actions";
import { AppState } from "../store";
import { emitToServer, getServerResponse } from "../utils/server";
import { BlockLoading } from "react-loadingg";
import IconButton from "../components/IconButton";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { BsPlayFill } from "react-icons/bs";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { Room } from "../types/server";
import Table from "../components/Table";
import RoomGameStarted from "../components/RoomGameStarted";
import { useToasts } from "react-toast-notifications";
import HeaderContents from "../components/HeaderContents";

const Rooms: React.FC<
  RouteComponentProps<{
    roomId: string;
  }> &
    AppState &
    ActionTypes
> = (props) => {
  const {
    match,
    rooms,
    clientId,
    updateClientId,
    roomId,
    updateRoomId,
    history,
    location,
  } = props;
  const { addToast } = useToasts();
  const room: Room | null =
    rooms?.find((room) => room.id === match.params.roomId) ?? null;

  return rooms === null ? (
    <Layout>
      <BlockLoading />
    </Layout>
  ) : !room ? (
    // if there is no such room, redirect to '/'
    <Redirect to="/" />
  ) : !room.gameStarted ? (
    <Layout>
      <Header>
        <HeaderContents
          history={history}
          clientId={clientId}
          rooms={rooms}
          roomId={roomId}
          updateClientId={updateClientId}
          updateRoomId={updateRoomId}
        />
      </Header>
      <main>
        {/* show some buttons */}
        <h2 className="p-4 font-bold text-3xl text-gray-800 inline-flex">
          Room {match.params.roomId}
          {roomId === match.params.roomId && clientId && (
            <>
              <IconButton
                onClick={async () => {
                  emitToServer("start game", { client: clientId });
                  const startGameMessage = await getServerResponse(
                    "start game response"
                  );
                  if (!startGameMessage.success) {
                    addToast(startGameMessage.error, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  }
                }}
                className="ml-4"
              >
                <BsPlayFill />
              </IconButton>
              <IconButton
                onClick={async () => {
                  emitToServer("exit room", { client: clientId });
                  const exitRoomMessage = await getServerResponse(
                    "exit room response"
                  );
                  if (exitRoomMessage.success) {
                    history.replace("/");
                  } else {
                    addToast(exitRoomMessage.error, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  }
                }}
                className="ml-4"
              >
                <BiLogOut />
              </IconButton>
            </>
          )}
          {roomId !== match.params.roomId && clientId && (
            <>
              <IconButton
                onClick={async () => {
                  emitToServer("join room", {
                    client: clientId,
                    room: match.params.roomId,
                  });
                  const joinRoomMessage = await getServerResponse(
                    "join room response"
                  );
                  if (joinRoomMessage.success) {
                    updateRoomId(room.id);
                  } else {
                    addToast(joinRoomMessage.error, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                  }
                }}
                className="ml-4"
              >
                <BiLogIn />
              </IconButton>
            </>
          )}
        </h2>

        {/* show the list of players */}
        <Table.Wrapper>
          <Table.Head>
            <Table.Row>
              <Table.Header>Player ID</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {rooms === null ? (
              <Table.Row>
                <Table.Data className="w-full" colSpan={3}>
                  <div className="h-24 relative">
                    <BlockLoading />
                  </div>
                </Table.Data>
              </Table.Row>
            ) : (
              rooms
                .find((room) => room.id === match.params.roomId)!
                .players.map((player) => (
                  <Table.Row key={player}>
                    <Table.Data className="w-1/2">
                      <span className="text-gray-700 px-6 py-3 flex items-center">
                        {player}
                      </span>
                    </Table.Data>
                  </Table.Row>
                ))
            )}
          </Table.Body>
        </Table.Wrapper>
      </main>
    </Layout>
  ) : (
    <RoomGameStarted
      id={match.params.roomId}
      history={history}
      match={match}
      location={location}
    />
  );
};

export default connect<AppState>((s) => s, actions)(Rooms);
