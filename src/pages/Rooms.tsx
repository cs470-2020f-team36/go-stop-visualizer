import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { connect } from "redux-zero/react";
import actions, { ActionTypes } from "../actions";
import { AppState } from "../store";
import { emitToServer, getServerResponse } from "../utils/server";
import { BlockLoading } from "react-loadingg";
import IconButton from "../components/IconButton";
import { BiExit } from "react-icons/bi";
import { BsPlayFill } from "react-icons/bs";
import Layout from "../components/Layout";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import TextButton from "../components/TextButton";
import { Room } from "../types/server";
import { goToMyRoom } from "../hooks";
import Table from "../components/Table";
import RoomGameStarted from "../components/RoomGameStarted";

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
    history,
    updateRoomId,
  } = props;
  const room: Room | null =
    rooms?.find((room) => room.id === match.params.roomId) ?? null;

  return rooms === null ? (
    <div>loading</div>
  ) : !room ? (
    <Redirect to="/" />
  ) : !room.gameStarted ? (
    <Layout>
      <Header>
        <TextInput
          className="w-64"
          placeholder="Client ID"
          value={clientId ?? ""}
          onChange={(event) => {
            updateClientId(event.target.value);
          }}
        />
        <TextButton
          size="sm"
          onClick={goToMyRoom(
            { history, clientId, roomId, rooms, updateRoomId },
            false
          )}
        >
          Go to my room
        </TextButton>
      </Header>
      <main>
        <h2 className="p-4 font-bold text-3xl text-gray-800 inline-flex">
          Room {match.params.roomId}
          {roomId === match.params.roomId && clientId && (
            <>
              <IconButton
                onClick={async () => {
                  emitToServer("start game", { client: clientId });
                  const myRoomMessage = await getServerResponse(
                    "start game response"
                  );
                  if (!myRoomMessage.success) {
                    console.error(myRoomMessage.error);
                  }
                }}
                className="ml-4"
              >
                <BsPlayFill />
              </IconButton>
              <IconButton
                onClick={async () => {
                  emitToServer("exit room", { client: clientId });
                  const myRoomMessage = await getServerResponse(
                    "exit room response"
                  );
                  if (myRoomMessage.success) {
                    setTimeout(() => {
                      history.replace("/");
                    }, 300);
                  } else {
                    console.error(myRoomMessage.error);
                  }
                }}
                className="ml-4"
              >
                <BiExit />
              </IconButton>
            </>
          )}
        </h2>

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
    <RoomGameStarted id={match.params.roomId} />
  );
};

export default connect<AppState>((s) => s, actions)(Rooms);
