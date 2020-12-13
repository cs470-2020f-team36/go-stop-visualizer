import { ALL_ACTIONS, Card, Game, GameAction } from "../types/game";
import { cardNameKo, getMonthName } from "./card";
import { roundFloat } from "./number";

// hide private cards (if peep is false)
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

// return the name of an action in korean
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

// return the name of an action in english
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

// postprocess the policy to show the calculated policy
// see `Estimate.tsx` or `GoStop.tsx` to find a use case
export function postprocessPolicy(policyBefore: number[], language: string) {
  const policy_ = policyBefore
    .map(
      (v, i) =>
        [
          (language === "ko" ? actionNameKo : actionNameEn)(ALL_ACTIONS[i]),
          v,
        ] as [string, number]
    )
    .filter(([, v]) => v !== 0)
    .sort((a, b) => b[1] - a[1]);
  const policy: [number, string, string][] = [];
  for (let i = 0; i < policy_.length; i++) {
    if (i > 0 && policy_[i - 1][1] === policy_[i][1]) {
      policy.push([policy[i - 1][0], policy_[i][0], roundFloat(policy_[i][1])]);
    } else {
      policy.push([i + 1, policy_[i][0], roundFloat(policy_[i][1])]);
    }
  }
  return policy;
}
