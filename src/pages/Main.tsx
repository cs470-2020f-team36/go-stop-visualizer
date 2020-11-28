import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { connect } from "redux-zero/react";
import { BlockLoading } from "react-loadingg";
import { BiLogIn } from "react-icons/bi";
import { GrOverview } from "react-icons/gr";

import actions, { ActionTypes } from "../actions";
import { AppState } from "../store";
import { emitToServer, getServerResponse } from "../utils/server";
import IconButton from "../components/IconButton";
import TextInput from "../components/TextInput";
import Table from "../components/Table";
import useAsyncEffect from "use-async-effect";
import { goToMyRoom } from "../hooks";
import Layout from "../components/Layout";
import Header from "../components/Header";

type MainProps = AppState & ActionTypes;
const Main: React.FC<RouteComponentProps & MainProps> = ({
  history,
  clientId,
  roomId,
  rooms,
  updateRoomId,
  updateClientId,
}) => {
  useAsyncEffect(
    goToMyRoom({ history, clientId, roomId, rooms, updateRoomId }, true),
    [roomId, clientId, history, rooms, updateRoomId]
  );

  return (
    <Layout>
      <Header>
        <div className="flex">
          <TextInput
            className="w-64 my-1"
            placeholder="Client ID"
            value={clientId ?? ""}
            onChange={(event) => {
              updateClientId(event.target.value);
            }}
          />
          <IconButton
            className="ml-4"
            onClick={goToMyRoom(
              { history, clientId, roomId, rooms, updateRoomId },
              false
            )}
          >
            <BiLogIn />
          </IconButton>
        </div>
      </Header>
      <main>
        <h2 className="p-4 font-bold text-3xl text-gray-800">Rooms</h2>

        <Table.Wrapper>
          <Table.Head>
            <Table.Row>
              <Table.Header>Room ID</Table.Header>
              <Table.Header># of Players</Table.Header>
              <Table.Header></Table.Header>
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
              rooms.map((room) => (
                <Table.Row key={room.id}>
                  <Table.Data className="w-1/2">
                    <span className="text-gray-700 px-6 py-3 flex items-center">
                      {room.id}
                    </span>
                  </Table.Data>
                  <Table.Data className="w-1/4">
                    <span className="text-gray-700 px-6 py-3 flex items-center">
                      {room.players.length}/2
                    </span>
                  </Table.Data>
                  <Table.Data className="p-2 flex justify-end">
                    <IconButton
                      onClick={async () => {
                        if (roomId) return;
                        if (!clientId) return;

                        emitToServer("join room", {
                          client: clientId,
                          room: room.id,
                        });
                        const newRoomId = await getServerResponse(
                          "join room response"
                        );
                        if (newRoomId.success) {
                          updateRoomId(room.id);
                          history.push(`/rooms/${room.id}`);
                        } else {
                          console.error(newRoomId.error);
                        }
                      }}
                    >
                      <BiLogIn />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        history.push(`/rooms/${room.id}`);
                      }}
                    >
                      <GrOverview />
                    </IconButton>
                  </Table.Data>
                </Table.Row>
              ))
            )}
            <Table.Row>
              <Table.Data className="w-full" colSpan={3}>
                <div className="h-24 flex items-center justify-center">
                  <button
                    className="w-40 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-blue-500 hover:border-blue-600 hover:bg-blue-500 hover:text-white shadow-md py-2 px-6 inline-flex items-center m-auto"
                    onClick={async () => {
                      if (!clientId) return;

                      emitToServer("make room", { client: clientId });
                      const newRoomId = await getServerResponse(
                        "make room response"
                      );
                      if (newRoomId.success) {
                        updateRoomId(newRoomId.result.id);
                        setTimeout(() => {
                          history.push(`/rooms/${newRoomId.result.id}`);
                        }, 200);
                      } else {
                        console.error(newRoomId.error);
                      }
                    }}
                  >
                    <span className="mx-auto">Make a room</span>
                  </button>
                </div>
              </Table.Data>
            </Table.Row>
          </Table.Body>
        </Table.Wrapper>
      </main>
    </Layout>
  );
};

export default connect<AppState>((s) => s, actions)(Main);
