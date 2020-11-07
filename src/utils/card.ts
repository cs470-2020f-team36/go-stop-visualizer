import { Card } from "../types/game";

export function cardToImageSrc(card: Card) {
  return `/images/cards/${
    card.startsWith("?")
      ? "hidden"
      : card.startsWith("*")
      ? "bomb"
      : card.startsWith("+")
      ? `bonus${card[1]}`
      : card
  }.png`;
}

export function cardNameKo(card: Card) {
  if (card.startsWith("B")) {
    return `${parseInt(card.substring(1))}월 광`;
  }
  if (card.startsWith("A")) {
    return `${parseInt(card.substring(1))}월 열끗`;
  }
  if (card.startsWith("R")) {
    const month = parseInt(card.substring(1));
    const ribbon = [1, 2, 3].includes(month)
      ? "홍"
      : [4, 5, 7].includes(month)
      ? "청"
      : [6, 9, 10].includes(month)
      ? "초"
      : null;
    return `${month}월 띠${!ribbon ? "" : ` (${ribbon}단)`}`;
  }
  if (card.startsWith("J")) {
    const month = parseInt(card.substring(1, 3));
    const index = parseInt(card.substring(3));
    const multiple = index === 2 || month === 12 ? 2 : 1;
    return `${month}월 ${multiple === 2 ? "쌍" : ""}피${
      multiple === 2 ? "" : ` (${index})`
    }`;
  }
  if (card.startsWith("+")) {
    const multiple = parseInt(card.substring(1));
    return `보너스 ${multiple === 2 ? "쌍" : "쓰리"}피`;
  }
  if (card.startsWith("*")) {
    const index = parseInt(card.substring(1));
    return `폭탄 (${index})`;
  }
  return "숨겨진 패";
}
