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
import Table from "../components/Table";
import useAsyncEffect from "use-async-effect";
import { goToMyRoom } from "../hooks";
import Layout from "../components/Layout";
import Header from "../components/Header";
import { useToasts } from "react-toast-notifications";
import TextButton from "../components/TextButton";
import HeaderContents from "../components/HeaderContents";

type MainProps = AppState & ActionTypes;
const Main: React.FC<RouteComponentProps & MainProps> = ({
  history,
  clientId,
  roomId,
  rooms,
  updateRoomId,
  updateClientId,
  updateRooms,
}) => {
  const { addToast } = useToasts();

  useAsyncEffect(
    goToMyRoom(
      { history, clientId, roomId, rooms, updateRoomId, addToast },
      true
    ),
    [roomId, clientId, history, rooms, updateRoomId]
  );

  return (
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
                    {room.gameStarted ? (
                      <span className="text-gray-500 line-through px-6 py-3 flex items-center">
                        {room.players.length}/2
                      </span>
                    ) : (
                      <span className="text-gray-700 px-6 py-3 flex items-center">
                        {room.players.length}/2
                      </span>
                    )}
                  </Table.Data>
                  <Table.Data className="p-2 flex justify-end">
                    {!room.gameStarted && (
                      <IconButton
                        className="mr-3"
                        onClick={async () => {
                          if (roomId === room.id) {
                            history.push(`/rooms/${room.id}`);
                            return;
                          }
                          if (roomId) {
                            addToast("You are already in a different room.", {
                              appearance: "error",
                              autoDismiss: true,
                            });
                            return;
                          }
                          if (!clientId) {
                            addToast("You did not set the clientId yet.", {
                              appearance: "error",
                              autoDismiss: true,
                            });
                            return;
                          }

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
                            addToast(newRoomId.error, {
                              appearance: "error",
                              autoDismiss: true,
                            });
                          }
                        }}
                      >
                        <BiLogIn />
                      </IconButton>
                    )}
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
                  <TextButton
                    onClick={async () => {
                      if (roomId) {
                        addToast("You are already in a different room.", {
                          appearance: "error",
                          autoDismiss: true,
                        });
                        return;
                      }
                      if (!clientId) {
                        addToast("You did not set the clientId yet.", {
                          appearance: "error",
                          autoDismiss: true,
                        });
                        return;
                      }

                      emitToServer("make room", { client: clientId });
                      const newRoomId = await getServerResponse(
                        "make room response"
                      );
                      if (newRoomId.success) {
                        updateRooms([...(rooms ?? []), newRoomId.result]);
                        updateRoomId(newRoomId.result.id);
                        history.push(`/rooms/${newRoomId.result.id}`);
                      } else {
                        addToast(newRoomId.error, {
                          appearance: "error",
                          autoDismiss: true,
                        });
                      }
                    }}
                  >
                    Make a room
                  </TextButton>
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
