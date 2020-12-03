import { Card, Game, GameAction } from "../types/game";
import { cardNameKo, getMonthName } from "./card";

export function hiddenHand(game: Game, player: 0 | 1, peep: boolean): Card[] {
  if (peep) return game.board.hands[player];
  const len = game.board.hands[player].length;
  const shown = game.board.hands[player].filter(
    (card) =>
      card.startsWith("*") ||
      game.state.shaking_histories[player].flat().includes(card)
  );
  return [...shown, ...Array(len - shown.length).fill("?")];
}

export function actionNameKo(action: GameAction): string {
  switch (action.kind) {
    case "throw":
      return `${cardNameKo(action.card)} 내기`;
    case "throw bomb":
      return "폭탄 패 내기";
    case "bomb":
      return `${action.month}월 폭탄 내기`;
    case "shakable":
      return `${cardNameKo(action.card)} 내기`;
    case "shaking":
      return action.option ? "흔들기" : "흔들지 않기";
    case "select match":
      return `${cardNameKo(action.match)} 가져오기`;
    case "four of a month":
      return action.option ? "총통으로 끝내기" : "총통으로 끝내지 않기";
    case "move animal 9":
      return action.option
        ? "9월 열끗 쌍피로 쓰기"
        : "9월 열끗 그대로 열끗으로 쓰기";
    case "go":
      return action.option ? "고" : "스톱";
  }
}

export function actionNameEn(action: GameAction): string {
  switch (action.kind) {
    case "throw":
      return `throw ${cardNameKo(action.card)}`;
    case "throw bomb":
      return "throw a bomb card";
    case "bomb":
      return `throw a bomb of ${getMonthName(action.month)}`;
    case "shakable":
      return `throw ${cardNameKo(action.card)}`;
    case "shaking":
      return action.option ? "shake" : "don't shake";
    case "select match":
      return `select ${cardNameKo(action.match)}`;
    case "four of a month":
      return action.option
        ? "end the game by a four-of-a-month"
        : "don't end the game by a four-of-a-month";
    case "move animal 9":
      return action.option
        ? "use the animal of September as a double junk"
        : "use the animal of September as an animal";
    case "go":
      return action.option ? "go" : "stop";
  }
}
