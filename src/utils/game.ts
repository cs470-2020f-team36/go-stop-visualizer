import { Card, Game } from "../types/game";

export function hiddenHand(game: Game, player: 0 | 1): Card[] {
  const len = game.board.hands[player].length;
  const shown = game.board.hands[player].filter(
    (card) =>
      card.startsWith("*") ||
      game.state.shaking_histories[player].flat().includes(card)
  );
  return [...shown, ...Array(len - shown.length).fill("?")];
}
