import React from "react";
import { GoTriangleRight } from "react-icons/go";
import { RouteComponentProps } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { useWindowSize } from "../hooks";
import { socket } from "../socket";
import { Card, Game, GameAction } from "../types/game";
import { cardNameKo, cardToImageSrc } from "../utils/card";
import { hiddenHand } from "../utils/game";
import { emitToServer, getServerResponse } from "../utils/server";
import CardButton from "./CardButton";
import TextButton from "./TextButton";

const GoStop: React.FC<
  RouteComponentProps & {
    game: Game;
    player: 0 | 1 | null;
    clientId: string | null;
    updateGame: (game: Game | null) => void;
  }
> = ({ game, player, clientId, updateGame, ...routeComponentProps }) => {
  return (
    <div
      className="w-full h-full flex place-items-center"
      style={{
        backgroundColor: "#3B7157",
      }}
    >
      <GoStopField game={game} player={player} clientId={clientId} />
      {game.state.ended ? (
        <GameEnded
          game={game}
          player={player}
          clientId={clientId}
          updateGame={updateGame}
          {...routeComponentProps}
        />
      ) : null}
    </div>
  );
};

const GameEnded: React.FC<
  RouteComponentProps & {
    game: Game;
    player: 0 | 1 | null;
    clientId: string | null;
    updateGame: (game: Game | null) => void;
  }
> = ({ game, player, clientId, updateGame, history }) => {
  const involved = !!clientId && game.players.includes(clientId);
  const { addToast } = useToasts();

  return (
    <div
      className="w-full h-full flex place-items-center fixed z-10 top-0 left-0"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.45)",
      }}
    >
      <div className="p-8 bg-white rounded-2xl w-2/3 text-center m-auto">
        <h2 className="font-black text-3xl text-gray-800 mb-3">
          {game.state.winner === null
            ? "🤔 나가리"
            : game.state.winner === player
            ? "🌟 승리!"
            : 1 - game.state.winner === player
            ? "😥 패배..."
            : `🏆 ${game.players[game.state.winner]}의 승리!`}
        </h2>
        <p>
          <span className="text-xl text-gray-800">
            {game.state.winner === null ? null : (
              <>
                총{" "}
                <span className="font-bold">
                  {game.state.scores[game.state.winner]}
                </span>
                점
              </>
            )}
          </span>
        </p>
        <p>
          <span className="text-md text-gray-800">
            {game.state.winner === null
              ? null
              : [
                  {
                    kind: "go-add",
                    arg: game.state.go_histories[game.state.winner].length,
                  },
                  ...game.state.score_factors[game.state.winner],
                ]
                  .map((factor) =>
                    factor.kind === "go-add"
                      ? factor.arg === 0
                        ? null
                        : `고 ${factor.arg}점`
                      : factor.kind === "go"
                      ? factor.arg <= 2
                        ? null
                        : `고 ${Math.pow(2, factor.arg - 2)}배`
                      : factor.kind === "bright"
                      ? factor.arg === 0
                        ? null
                        : `광 ${factor.arg}점`
                      : factor.kind === "animal"
                      ? factor.arg < 5
                        ? null
                        : `열끗 ${factor.arg - 4}점`
                      : factor.kind === "ribbon"
                      ? factor.arg < 5
                        ? null
                        : `단 ${factor.arg - 4}점`
                      : factor.kind === "junk"
                      ? factor.arg < 10
                        ? null
                        : `피 ${factor.arg - 9}점`
                      : factor.kind === "five birds"
                      ? `고도리 5점`
                      : factor.kind === "red ribbons"
                      ? `홍단 3점`
                      : factor.kind === "blue ribbons"
                      ? `청단 3점`
                      : factor.kind === "plant ribbons"
                      ? `초단 3점`
                      : factor.kind === "shaking"
                      ? factor.arg === 0
                        ? null
                        : `흔들기 ${Math.pow(2, factor.arg)}배`
                      : factor.kind === "bright penalty"
                      ? `광박 2배`
                      : factor.kind === "animal penalty"
                      ? `멍따 2배`
                      : factor.kind === "junk penalty"
                      ? `피박 2배`
                      : factor.kind === "go penalty"
                      ? `고박 2배`
                      : factor.kind === "four of a month"
                      ? `총통 10점`
                      : `쓰리뻑 10점`
                  )
                  .filter((x) => x !== null)
                  .join(", ")}
          </span>
        </p>
        <p>
          {involved ? (
            <>
              <TextButton
                className="m-auto mt-4"
                onClick={async () => {
                  if (!socket) return;
                  if (!clientId) return;

                  updateGame(null);

                  emitToServer("end game", { client: clientId });
                  const endGameMessage = await getServerResponse(
                    "end game response"
                  );
                  if (!endGameMessage.success) {
                    addToast(endGameMessage.error, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                    return;
                  }

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
              >
                새 게임 하기
              </TextButton>
              <TextButton
                className="m-auto mt-4"
                onClick={async () => {
                  if (!socket) return;
                  if (!clientId) return;

                  updateGame(null);

                  emitToServer("end game", { client: clientId });
                  const endGameMessage = await getServerResponse(
                    "end game response"
                  );
                  if (!endGameMessage.success) {
                    addToast(endGameMessage.error, {
                      appearance: "error",
                      autoDismiss: true,
                    });
                    return;
                  }

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
              >
                새 게임 하기
              </TextButton>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
};

const GoStopField: React.FC<{
  game: Game;
  player: 0 | 1 | null;
  clientId: string | null;
}> = ({ game, player, clientId }) => {
  const BASE_WIDTH = 1258;
  const BASE_HEIGHT = 1327 + (player === null ? -53 : 0);

  const windowSize = useWindowSize();
  const ratio = Math.min(
    (windowSize.width - 32) / BASE_WIDTH,
    (windowSize.height - 32) / BASE_HEIGHT
  );
  const bottom = player ?? 1;
  const top = bottom === 0 ? 1 : 0;

  return (
    <div
      className="m-auto"
      style={{
        width: ratio * BASE_WIDTH + 32,
        height: ratio * BASE_HEIGHT + 32,
        padding: 16,
      }}
    >
      <GoStopHand
        ratio={ratio}
        hand={hiddenHand(game, top)}
        clientId={clientId}
        turn={game.state.player === top}
      />
      <div style={{ height: ratio * 32 }} />

      <div className="flex justify-center" style={{ height: ratio * 189 }}>
        <GoStopNameCard ratio={ratio} name={game.players[top]} />
        <GoStopCaptureField
          captureField={game.board.capture_fields[top]}
          animal9Moved={game.state.animal_9_moved}
          ratio={ratio}
        />
        <GoStopScoreCard
          ratio={ratio}
          score={game.state.scores[top]}
          go={game.state.go_histories[top].length}
          stacking={game.state.stacking_histories[top].length}
          shaking={game.state.shaking_histories[top].length}
        />
      </div>
      <div style={{ height: ratio * 96 }} />
      <GoStopCenterField centerField={game.board.center_field} ratio={ratio} />
      <div style={{ height: ratio * 96 }} />
      <div className="flex justify-center" style={{ height: ratio * 189 }}>
        <GoStopNameCard ratio={ratio} name={game.players[bottom]} />
        <GoStopCaptureField
          captureField={game.board.capture_fields[bottom]}
          animal9Moved={game.state.animal_9_moved}
          ratio={ratio}
        />
        <GoStopScoreCard
          ratio={ratio}
          score={game.state.scores[bottom]}
          go={game.state.go_histories[bottom].length}
          stacking={game.state.stacking_histories[bottom].length}
          shaking={game.state.shaking_histories[bottom].length}
        />
      </div>
      <div style={{ height: ratio * 32 }} />
      <GoStopHand
        ratio={ratio}
        hand={
          player !== null ? game.board.hands[bottom] : hiddenHand(game, bottom)
        }
        mine={player !== null}
        actions={game.state.player === player ? game.actions : []}
        clientId={clientId}
        turn={game.state.player === bottom}
      />
    </div>
  );
};

const GoStopNameCard: React.FC<{ ratio: number; name: string }> = ({
  ratio,
  name,
}) => (
  <div
    style={{
      width: ratio * 106,
      marginRight: ratio * 40,
      height: ratio * 90 * 1.618,
      fontSize: 24 * ratio,
      padding: 8 * ratio,
      lineHeight: 1.1,
      borderRadius: 8 * ratio,
      backgroundColor: "#29604D",
      textAlign: "center",
      position: "relative",
    }}
    className="text-white"
  >
    <div
      style={{
        height: ratio * 90,
        backgroundColor: "white",
        borderRadius: 8 * ratio,
      }}
    >
      <img
        src="https://i1.wp.com/similarpng.com/wp-content/plugins/userswp/assets/images/no_profile.png"
        style={{
          width: ratio * 90,
          height: ratio * 90,
          borderRadius: 8 * ratio,
        }}
        className="object-cover object-center"
        alt={`${name}의 프로필 이미지`}
      />
    </div>
    <div
      style={{
        position: "absolute",
        bottom: 8 * ratio,
        width: ratio * 90,
      }}
      className="truncate"
    >
      {name}
    </div>
  </div>
);

const GoStopScoreCard: React.FC<{
  ratio: number;
  score: number;
  go: number;
  stacking: number;
  shaking: number;
}> = ({ ratio, score, go, stacking, shaking }) => (
  <div
    style={{
      width: ratio * 106,
      marginLeft: ratio * 40,
      height: ratio * 90 * 1.618,
      fontSize: 24 * ratio,
      padding: 8 * ratio,
      lineHeight: 1.1,
      borderRadius: 8 * ratio,
      backgroundColor: "#29604D",
      fontFamily: "sans-serif",
      textAlign: "left",
    }}
    className="text-white"
  >
    <div
      style={{
        fontSize: score > 99999 ? "1em" : score > 9999 ? "1.1em" : "1.3em",
        textAlign: "center",
        lineHeight: `${48 * ratio}px`,
        whiteSpace: "nowrap",
        width: "min-content",
        marginLeft: "50%",
        transform: "translateX(-50%)",
        padding: `0 ${8 * ratio}px`,
        borderRadius: 8 * ratio,
      }}
      className="font-bold text-right"
    >
      {score}점
    </div>
    <div style={{ marginLeft: 15 * ratio, width: 60 * ratio }}>
      🔥 <span className="font-black float-right">{go}</span>
    </div>
    <div style={{ marginLeft: 15 * ratio, width: 60 * ratio }}>
      💩 <span className="font-black float-right">{stacking}</span>
    </div>
    <div style={{ marginLeft: 15 * ratio, width: 60 * ratio }}>
      🔔 <span className="font-black float-right">{shaking}</span>
    </div>
  </div>
);

const GoStopCard: React.FC<{
  card: Card;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler;
  className?: string;
}> = ({
  card,
  width: w,
  height: h,
  alt,
  title,
  style = {},
  className,
  onClick,
}) => {
  const { width, height } =
    !w && !h
      ? { width: 68, height: 105 }
      : !w && !!h
      ? { width: (68 / 105) * h, height: h }
      : !!w && !h
      ? { width: w, height: (w * 105) / 68 }
      : { width: w, height: h };
  return (
    <img
      src={cardToImageSrc(card)}
      style={{
        width,
        height,
        objectPosition: "center",
        objectFit: "cover",
        ...style,
      }}
      alt={alt ?? cardNameKo(card)}
      title={title}
      className={className}
      onClick={onClick}
    />
  );
};

const GoStopHand: React.FC<{
  hand: Card[];
  mine?: boolean;
  actions?: GameAction[];
  ratio: number;
  style?: React.CSSProperties;
  clientId: string | null;
  turn: boolean;
}> = ({
  hand,
  mine = false,
  actions = [],
  ratio,
  style = {},
  turn,
  clientId,
}) => {
  const { addToast } = useToasts();
  const width = mine ? 100 * ratio : 68 * ratio;
  const height = mine ? 154 * ratio : 105 * ratio;
  const gap = mine ? 12 * ratio : 8 * ratio;
  return (
    <div className="flex w-full place-content-center">
      <div
        style={{
          width: mine ? 54 * ratio : 40 * ratio,
          height: height + 2 * gap,
          lineHeight: 1,
        }}
        className="flex items-center"
      >
        {turn && hand.length > 0 && (
          <GoTriangleRight
            size={mine ? 40 * ratio : 32 * ratio}
            color="white"
          />
        )}
      </div>
      <div
        className="flex"
        style={{
          padding: gap / 2,
          backgroundColor: hand.length === 0 ? "transparent" : "#29604D",
          borderRadius: 8 * ratio,
          marginRight: mine ? 54 * ratio : 40 * ratio,
          minWidth: 16 * ratio + 2 * gap,
          height: height + 2 * gap,
          ...style,
        }}
      >
        {hand.map((card, i) => {
          const action = !mine
            ? undefined
            : actions.find(
                (action) =>
                  (action.kind === "throw" && action.card === card) ||
                  (action.kind === "throw bomb" && card.startsWith("*")) ||
                  (action.kind === "bomb" &&
                    ["B", "A", "R", "J"].includes(card[0]) &&
                    action.month === parseInt(card.substring(1, 3), 10)) ||
                  (action.kind === "shakable" && action.card === card)
              );
          const title = !action
            ? undefined
            : action.kind === "throw"
            ? `${cardNameKo(card)} 내기`
            : action.kind === "throw bomb"
            ? `폭탄 내기`
            : action.kind === "bomb"
            ? `${action.month}월 폭탄`
            : `${cardNameKo(card)}로 ${parseInt(
                card.substring(1, 3),
                10
              )}월 흔들기`;
          return (
            <CardButton
              key={i}
              card={card}
              style={{
                width,
                margin: gap / 2,
                borderRadius: 4 * ratio,
              }}
              title={title}
              hoverEnabled={mine}
              anchorBottom
              className={
                !mine
                  ? ""
                  : actions.length === 0
                  ? "cursor-not-allowed"
                  : "cursor-pointer"
              }
              onClick={
                !mine
                  ? undefined
                  : async () => {
                      if (!action) return;
                      socket.emit("play", { client: clientId, action });
                      const playMessage = await getServerResponse(
                        "play response"
                      );
                      if (!playMessage.success) {
                        addToast(playMessage.error, {
                          appearance: "error",
                          autoDismiss: true,
                        });
                      }
                    }
              }
            />
          );
        })}
      </div>
    </div>
  );
};

const GoStopCaptureField: React.FC<{
  captureField: Card[];
  animal9Moved: boolean | null;
  ratio: number;
  style?: React.CSSProperties;
}> = ({ captureField, animal9Moved, ratio, style }) => {
  const brightCards = captureField.filter((card) => card.startsWith("B"));
  const animalCards = captureField.filter(
    (card) => card.startsWith("A") && (!animal9Moved || card !== "A09")
  );
  const isGodoriMade =
    animalCards.includes("A02") &&
    animalCards.includes("A04") &&
    animalCards.includes("A08");
  const animalScore =
    Math.max(animalCards.length - 4, 0) + (isGodoriMade ? 5 : 0);
  const ribbonCards = captureField.filter((card) => card.startsWith("R"));
  const isRedRibbonMade =
    ribbonCards.includes("R01") &&
    ribbonCards.includes("R02") &&
    ribbonCards.includes("R03");
  const isPlantRibbonMade =
    ribbonCards.includes("R04") &&
    ribbonCards.includes("R05") &&
    ribbonCards.includes("R07");
  const isBlueRibbonMade =
    ribbonCards.includes("R06") &&
    ribbonCards.includes("R09") &&
    ribbonCards.includes("R10");
  const ribbonScore =
    Math.max(ribbonCards.length - 4, 0) +
    (isBlueRibbonMade ? 3 : 0) +
    (isPlantRibbonMade ? 3 : 0) +
    (isRedRibbonMade ? 3 : 0);

  const junkCards = captureField.filter(
    (card) =>
      card.startsWith("J") ||
      card.startsWith("+") ||
      (!!animal9Moved && card === "A09")
  );
  const junkScore = junkCards
    .map((card) =>
      card.startsWith("J")
        ? card === "J110" || card === "J111"
          ? 1
          : card === "J120" || card === "J112"
          ? 2
          : 1
        : card === "A09"
        ? 2
        : card === "+2"
        ? 2
        : card === "+3"
        ? 3
        : 0
    )
    .reduce((a: number, b: number) => a + b, 0);

  return (
    <>
      <GoStopCaptureFieldPile
        pile={brightCards}
        sizeOfChunk={5}
        ratio={ratio}
        style={{ marginRight: 40 * ratio }}
        number={
          brightCards.length < 3
            ? brightCards.length
            : brightCards.length === 5
            ? 15
            : brightCards.length === 4
            ? 4
            : brightCards.includes("B12")
            ? 2
            : 3
        }
        isScore={brightCards.length >= 3}
      />
      <GoStopCaptureFieldPile
        pile={animalCards}
        ratio={ratio}
        style={{ marginRight: 40 * ratio }}
        number={animalScore > 0 ? animalScore : animalCards.length}
        isScore={animalScore > 0}
      />
      <GoStopCaptureFieldPile
        pile={ribbonCards}
        ratio={ratio}
        style={{ marginRight: 40 * ratio }}
        number={ribbonScore > 0 ? ribbonScore : ribbonCards.length}
        isScore={ribbonScore > 0}
      />
      <GoStopCaptureFieldPile
        pile={junkCards}
        sizeOfChunk={8}
        ratio={ratio}
        style={{ marginRight: 40 * ratio }}
        number={junkScore > 9 ? junkScore - 9 : junkScore}
        isScore={junkScore > 9}
      />
    </>
  );
};

const GoStopCaptureFieldPile: React.FC<{
  pile: Card[];
  ratio: number;
  number: number;
  isScore: boolean;
  sizeOfChunk?: number;
  style?: React.CSSProperties;
}> = ({ pile, ratio, number, isScore, sizeOfChunk = 3, style = {} }) => {
  const width = 68 * ratio;
  const height = 105 * ratio;
  const horizontalGap = 24 * ratio;
  const verticalGap = 28 * ratio;
  const numberOfChunks = Math.ceil(pile.length / sizeOfChunk);
  const wrapperWidth = width + (sizeOfChunk - 1) * horizontalGap;
  const wrapperHeight = height + (numberOfChunks - 1) * verticalGap;
  const last = pile.length - 1;
  return (
    <div
      style={{
        width: wrapperWidth,
        height: wrapperHeight,
        position: "relative",
        ...style,
      }}
    >
      {pile.map((card, i) => (
        <GoStopCard
          key={i}
          card={card}
          width={width}
          style={{
            position: "absolute",
            left: (i % sizeOfChunk) * horizontalGap,
            top: Math.floor(i / sizeOfChunk) * verticalGap,
            borderRadius: 4 * ratio,
          }}
        />
      ))}
      {pile.length === 0 ? null : (
        <div
          className="absolute"
          style={{
            width: 40 * ratio,
            height: 40 * ratio,
            left: (last % sizeOfChunk) * horizontalGap + width - 40 * ratio,
            top:
              Math.floor(last / sizeOfChunk) * verticalGap +
              height -
              40 * ratio,
            backgroundColor: "white",
            border: `${4 * ratio}px solid ${isScore ? "#262C34" : "#4f5257"}`,
            color: isScore ? "#262C34" : "#65676b",
            fontWeight: isScore ? "bold" : "normal",
            borderRadius: 8 * ratio,
            fontSize: 28 * ratio,
            lineHeight: `${32 * ratio}px`,
            textAlign: "center",
          }}
        >
          {number}
        </div>
      )}
    </div>
  );
};

const GoStopCenterField: React.FC<{
  centerField: Game["board"]["center_field"];
  ratio: number;
  style?: React.CSSProperties;
}> = ({ centerField, ratio, style = {} }) => {
  return (
    <div className="flex" style={{ height: ratio * 392, ...style }}>
      <div
        className="flex flex-wrap justify-between"
        style={{ height: ratio * 446, width: ratio * 428 }}
      >
        <GoStopCenterFieldItem field={centerField["1"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["2"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["3"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["7"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["8"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["9"]} ratio={ratio} />
      </div>
      <div
        className="flex justify-center items-center"
        style={{ height: ratio * 392, width: ratio * 290 }}
      >
        <GoStopCard
          card="?"
          width={90 * ratio}
          style={{ borderRadius: 8 * ratio }}
        />
      </div>
      <div
        className="flex flex-wrap justify-between"
        style={{ height: ratio * 446, width: ratio * 428 }}
      >
        <GoStopCenterFieldItem field={centerField["4"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["5"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["6"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["10"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["11"]} ratio={ratio} />
        <GoStopCenterFieldItem field={centerField["12"]} ratio={ratio} />
      </div>
    </div>
  );
};
const GoStopCenterFieldItem: React.FC<{
  field?: Card[];
  ratio: number;
  style?: React.CSSProperties;
}> = ({ field = [], ratio, style }) => {
  const gapRatio = field.length <= 3 ? 1 : field.length === 4 ? 2 / 3 : 1 / 2;
  return (
    <div
      className="relative"
      style={{ height: ratio * 180, width: ratio * 122 }}
    >
      {field.map((card, i) => (
        <GoStopCard
          key={i}
          card={card}
          width={90 * ratio}
          style={{
            position: "absolute",
            top: i * 20 * gapRatio * ratio,
            left: i * 16 * gapRatio * ratio,
            borderRadius: 8 * ratio,
          }}
        />
      ))}
    </div>
  );
};

export default GoStop;
