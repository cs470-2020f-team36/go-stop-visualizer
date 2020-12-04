import React, { useState } from "react";
import { BiHome, BiLogIn, BiCalculator } from "react-icons/bi";
import { RouteComponentProps } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { connect } from "redux-zero/react";
import actions, { ActionTypes } from "../actions";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Layout from "../components/Layout";
import TextButton from "../components/TextButton";
import TextInput from "../components/TextInput";
import { goToMyRoom } from "../hooks";
import i18n from "../i18n";
import { AppState } from "../store";
import { GameEssentials } from "../types/game";
import { postprocessPolicy } from "../utils/game";
import { emitToServer, getServerResponse } from "../utils/server";

type EstimateProps = AppState & ActionTypes;
const Estimate: React.FC<RouteComponentProps & EstimateProps> = ({
  history,
  clientId,
  updateClientId,
  roomId,
  rooms,
  updateRoomId,
}) => {
  const { addToast } = useToasts();
  const [estimate, setEstimate] = useState<{
    policy: number[];
    value: number;
  } | null>(null);

  const [content, setContent] = useState("");

  return (
    <Layout>
      <Header>
        <div className="flex justify-between">
          <div className="flex">
            <IconButton className="mr-4" onClick={() => history.push("/")}>
              <BiHome />
            </IconButton>
            <TextInput
              className="w-64 my-1"
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
      </Header>
      <main>
        <h2 className="p-4 font-bold text-3xl text-gray-800">Estimate</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow max-w-4xl m-auto box-content mx-4 overflow-hidden">
          <div
            className="w-full px-4 py-3 relative text-center"
            style={{ minHeight: "3rem" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="54"
              height="14"
              viewBox="0 0 54 14"
              className="absolute py-1 box-content"
              style={{
                left: "1rem",
              }}
            >
              <g fill="none" fillRule="evenodd" transform="translate(1 1)">
                <circle
                  cx="6"
                  cy="6"
                  r="6"
                  fill="#FF5F56"
                  stroke="#E0443E"
                  strokeWidth=".5"
                ></circle>
                <circle
                  cx="26"
                  cy="6"
                  r="6"
                  fill="#FFBD2E"
                  stroke="#DEA123"
                  strokeWidth=".5"
                ></circle>
                <circle
                  cx="46"
                  cy="6"
                  r="6"
                  fill="#27C93F"
                  stroke="#1AAB29"
                  strokeWidth=".5"
                ></circle>
              </g>
            </svg>
            <div
              className="text-gray-700 font-bold"
              style={{ margin: "0 72px" }}
            >
              Paste the serialized game (JSON file) into the text field below.
            </div>
          </div>
          <CodeEditor value={content} onChange={(v) => setContent(v)} />
          <div className="flex justify-end p-4">
            <TextButton
              onClick={async () => {
                let game: GameEssentials;
                try {
                  game = JSON.parse(content);
                } catch {
                  addToast("The JSON is invalid.", {
                    appearance: "error",
                    autoDismiss: true,
                  });
                  return;
                }
                emitToServer("estimate game", { game });
                const estimateGameResult = await getServerResponse(
                  "estimate game response"
                );
                if (estimateGameResult.success) {
                  setEstimate(estimateGameResult.result);
                } else {
                  addToast(estimateGameResult.error, {
                    appearance: "error",
                    autoDismiss: true,
                  });
                  return;
                }
              }}
            >
              Query to AI
            </TextButton>
          </div>
        </div>
        {!!estimate && (
          <div
            className="w-full h-full flex place-items-center fixed z-10 top-0 left-0"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.45)",
            }}
          >
            <div className="p-8 bg-white rounded-2xl w-2/3 text-center m-auto">
              <h3 className="font-black text-3xl text-gray-800 mb-3">
                Estimation: {estimate.value} Points
              </h3>
              <div className="text-left pt-4">
                {postprocessPolicy(estimate.policy, i18n.language).map(
                  ([i, a, p]) => (
                    <div
                      className={`flex ${
                        i === 1 ? "h-12 text-xl font-bold" : "h-10"
                      } my-4`}
                    >
                      <div className="w-20 pr-8 py-2 text-right">{i}.</div>
                      <div
                        className="box-border p-2 relative"
                        style={{ width: "calc(100% - 5rem)" }}
                      >
                        <div
                          className="absolute top-0 left-0 h-full bg-gray-300 rounded-xl"
                          style={{
                            width: `${
                              (parseFloat(p) /
                                parseFloat(
                                  postprocessPolicy(
                                    estimate.policy,
                                    i18n.language
                                  )[0][2]
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                        <span className="relative z-10">{a}</span>
                        <span className="absolute right-0 mr-2 z-10">{p}</span>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="flex justify-end pt-4">
                <TextButton onClick={() => setEstimate(null)}>Close</TextButton>
              </div>
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

interface CodeEditorProps {
  value: string;
  onChange?: (e: string) => void;
}
const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  const defaultValue = React.useRef(value);

  const handleInput = (e: React.ChangeEvent<HTMLDivElement>) => {
    if (onChange) {
      onChange(e.target.innerHTML);
    }
  };

  return (
    <div
      contentEditable
      className="w-full px-4 font-mono break-all overflow-y-auto whitespace-normal"
      style={{
        minHeight: "8rem",
        maxHeight: "calc(100vh - 20rem)",
      }}
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  );
};

export default connect<AppState>((s) => s, actions)(Estimate);
