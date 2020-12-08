import React from "react";
import { BiHome, BiLogIn, BiCalculator } from "react-icons/bi";
import { RouteComponentProps } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { ActionTypes } from "../actions";
import { goToMyRoom } from "../hooks";
import { AppState } from "../store";
import IconButton from "./IconButton";
import TextInput from "./TextInput";

type HeaderContentsProps = Pick<RouteComponentProps, "history"> &
  Pick<AppState, "clientId" | "roomId" | "rooms"> &
  Pick<ActionTypes, "updateClientId" | "updateRoomId">;

const HeaderContents: React.FC<HeaderContentsProps> = ({
  history,
  clientId,
  roomId,
  rooms,
  updateClientId,
  updateRoomId,
}) => {
  const { addToast } = useToasts();
  return (
    <>
      <div className="flex justify-between">
        <div className="flex">
          <IconButton className="mr-4" onClick={() => history.push("/")}>
            <BiHome />
          </IconButton>
          <TextInput
            className="w-64 my-1"
            style={{
              maxWidth: "calc(100vw - 14rem)",
            }}
            placeholder="Client ID"
            value={clientId ?? ""}
            onChange={(event) => {
              updateClientId(event.target.value);
            }}
          />
          {roomId && (
            <IconButton
              className="ml-4"
              onClick={goToMyRoom(
                { history, clientId, roomId, rooms, updateRoomId, addToast },
                false
              )}
            >
              <BiLogIn />
            </IconButton>
          )}
        </div>
        <div>
          <IconButton
            className="ml-4"
            onClick={() => history.push("/estimate")}
          >
            <BiCalculator />
          </IconButton>
        </div>
      </div>
    </>
  );
};

export default HeaderContents;
