export type Card =
  | "B01"
  | "B03"
  | "B08"
  | "B11"
  | "B12"
  | "A02"
  | "A04"
  | "A05"
  | "A06"
  | "A07"
  | "A08"
  | "A09"
  | "A10"
  | "A12"
  | "R01"
  | "R02"
  | "R03"
  | "R04"
  | "R05"
  | "R06"
  | "R07"
  | "R09"
  | "R10"
  | "R12"
  | "J010"
  | "J011"
  | "J020"
  | "J021"
  | "J030"
  | "J031"
  | "J040"
  | "J041"
  | "J050"
  | "J051"
  | "J060"
  | "J061"
  | "J070"
  | "J071"
  | "J080"
  | "J081"
  | "J090"
  | "J091"
  | "J100"
  | "J101"
  | "J110"
  | "J111"
  | "J112"
  | "J120"
  | "+2"
  | "+3"
  | "?"
  | "*0"
  | "*1"
  | "*2"
  | "*3"
  | "*4"
  | "*5"
  | "*6"
  | "*7"
  | "*8"
  | "*9"
  | "*10"
  | "*11";
export type CardList = Card[];

export interface GameBoard {
  hands: [CardList, CardList];
  capture_fields: [CardList, CardList];
  center_field: {
    "1"?: CardList;
    "2"?: CardList;
    "3"?: CardList;
    "4"?: CardList;
    "5"?: CardList;
    "6"?: CardList;
    "7"?: CardList;
    "8"?: CardList;
    "9"?: CardList;
    "10"?: CardList;
    "11"?: CardList;
    "12"?: CardList;
  };
  drawing_pile: CardList;
}

export type SelectMatch = [
  Card,
  CardList,
  [Card | null, CardList, Card, CardList, number] | null
];

// TODO: strict type def
type ScoreFactor =
  | ScoreFactorBright
  | ScoreFactorAnimal
  | ScoreFactorRibbon
  | ScoreFactorJunk
  | ScoreFactorFiveBirds
  | ScoreFactorBlueRibbons
  | ScoreFactorRedRibbons
  | ScoreFactorPlantRibbons
  | ScoreFactorFourOfAMonth
  | ScoreFactorThreeStackings
  | ScoreFactorGo
  | ScoreFactorShaking
  | ScoreFactorBrightPenalty
  | ScoreFactorAnimalPenalty
  | ScoreFactorJunkPenalty
  | ScoreFactorGoPenalty;
interface ScoreFactorBright {
  kind: "bright";
  arg: number;
}
interface ScoreFactorAnimal {
  kind: "animal";
  arg: number;
}
interface ScoreFactorRibbon {
  kind: "ribbon";
  arg: number;
}
interface ScoreFactorJunk {
  kind: "junk";
  arg: number;
}
interface ScoreFactorFiveBirds {
  kind: "five birds";
  arg: null;
}
interface ScoreFactorBlueRibbons {
  kind: "blue ribbons";
  arg: null;
}
interface ScoreFactorRedRibbons {
  kind: "red ribbons";
  arg: null;
}
interface ScoreFactorPlantRibbons {
  kind: "plant ribbons";
  arg: null;
}
interface ScoreFactorFourOfAMonth {
  kind: "four of a month";
  arg: null;
}
interface ScoreFactorThreeStackings {
  kind: "three stackings";
  arg: null;
}
interface ScoreFactorGo {
  kind: "go";
  arg: number;
}
interface ScoreFactorShaking {
  kind: "shaking";
  arg: number;
}
interface ScoreFactorBrightPenalty {
  kind: "bright penalty";
  arg: null;
}
interface ScoreFactorAnimalPenalty {
  kind: "animal penalty";
  arg: null;
}
interface ScoreFactorJunkPenalty {
  kind: "junk penalty";
  arg: null;
}
interface ScoreFactorGoPenalty {
  kind: "go penalty";
  arg: null;
}

export interface GameState {
  player: 0 | 1;
  bomb_increment: number;
  go_histories: [number[], number[]];
  select_match: SelectMatch | null;
  shaking: [Card, CardList] | null;
  shaking_histories: [Card[][], Card[][]];
  stacking_histories: [number[], number[]];
  score_factors: [ScoreFactor[], ScoreFactor[]];
  scores: [number, number];
  animal_9_moved: boolean | null;
  ended: boolean;
  winner: 0 | 1 | null;
}

export interface GameFlags {
  go: boolean;
  select_match: boolean;
  shaking: boolean;
  move_animal_9: boolean;
  four_of_a_month: boolean;
}

export interface Game {
  board: GameBoard;
  state: GameState;
  flags: GameFlags;
  logs: string[];
  players: string[];
  actions: GameAction[];
}
export type GameAction =
  | GameActionThrow
  | GameActionThrowBomb
  | GameActionBomb
  | GameActionShakable
  | GameActionShaking
  | GameActionSelectMatch
  | GameActionFourOfAMonth
  | GameActionMoveAnimal9
  | GameActionGo;
interface GameActionThrow {
  kind: "throw";
  card: Card;
}
interface GameActionThrowBomb {
  kind: "throw bomb";
}
interface GameActionBomb {
  kind: "bomb";
  month: number;
}
interface GameActionShakable {
  kind: "shakable";
  card: Card;
}
interface GameActionShaking {
  kind: "shaking";
  option: boolean;
}
export interface GameActionSelectMatch {
  kind: "select match";
  match: Card;
}
interface GameActionFourOfAMonth {
  kind: "four of a month";
  option: boolean;
}
interface GameActionMoveAnimal9 {
  kind: "move animal 9";
  option: boolean;
}
interface GameActionGo {
  kind: "go";
  option: boolean;
}
