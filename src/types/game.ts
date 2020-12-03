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

export interface GameEssentials {
  board: GameBoard;
  state: GameState;
  flags: GameFlags;
}
export interface Game extends GameEssentials {
  logs: string[];
  players: string[];
  actions: GameAction[];
  estimate: [number[], number] | null;
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

export const ALL_ACTIONS: GameAction[] = [
  { kind: "throw", card: "B01" },
  { kind: "throw", card: "R01" },
  { kind: "throw", card: "J010" },
  { kind: "throw", card: "J011" },
  { kind: "throw", card: "A02" },
  { kind: "throw", card: "R02" },
  { kind: "throw", card: "J020" },
  { kind: "throw", card: "J021" },
  { kind: "throw", card: "B03" },
  { kind: "throw", card: "R03" },
  { kind: "throw", card: "J030" },
  { kind: "throw", card: "J031" },
  { kind: "throw", card: "A04" },
  { kind: "throw", card: "R04" },
  { kind: "throw", card: "J040" },
  { kind: "throw", card: "J041" },
  { kind: "throw", card: "A05" },
  { kind: "throw", card: "R05" },
  { kind: "throw", card: "J050" },
  { kind: "throw", card: "J051" },
  { kind: "throw", card: "A06" },
  { kind: "throw", card: "R06" },
  { kind: "throw", card: "J060" },
  { kind: "throw", card: "J061" },
  { kind: "throw", card: "A07" },
  { kind: "throw", card: "R07" },
  { kind: "throw", card: "J070" },
  { kind: "throw", card: "J071" },
  { kind: "throw", card: "B08" },
  { kind: "throw", card: "A08" },
  { kind: "throw", card: "J080" },
  { kind: "throw", card: "J081" },
  { kind: "throw", card: "A09" },
  { kind: "throw", card: "R09" },
  { kind: "throw", card: "J090" },
  { kind: "throw", card: "J091" },
  { kind: "throw", card: "A10" },
  { kind: "throw", card: "R10" },
  { kind: "throw", card: "J100" },
  { kind: "throw", card: "J101" },
  { kind: "throw", card: "B11" },
  { kind: "throw", card: "J110" },
  { kind: "throw", card: "J111" },
  { kind: "throw", card: "J112" },
  { kind: "throw", card: "B12" },
  { kind: "throw", card: "A12" },
  { kind: "throw", card: "R12" },
  { kind: "throw", card: "J120" },
  { kind: "throw", card: "+2" },
  { kind: "throw", card: "+3" },
  { kind: "throw bomb" },
  { kind: "bomb", month: 1 },
  { kind: "bomb", month: 2 },
  { kind: "bomb", month: 3 },
  { kind: "bomb", month: 4 },
  { kind: "bomb", month: 5 },
  { kind: "bomb", month: 6 },
  { kind: "bomb", month: 7 },
  { kind: "bomb", month: 8 },
  { kind: "bomb", month: 9 },
  { kind: "bomb", month: 10 },
  { kind: "bomb", month: 11 },
  { kind: "bomb", month: 12 },
  { kind: "shakable", card: "B01" },
  { kind: "shakable", card: "R01" },
  { kind: "shakable", card: "J010" },
  { kind: "shakable", card: "J011" },
  { kind: "shakable", card: "A02" },
  { kind: "shakable", card: "R02" },
  { kind: "shakable", card: "J020" },
  { kind: "shakable", card: "J021" },
  { kind: "shakable", card: "B03" },
  { kind: "shakable", card: "R03" },
  { kind: "shakable", card: "J030" },
  { kind: "shakable", card: "J031" },
  { kind: "shakable", card: "A04" },
  { kind: "shakable", card: "R04" },
  { kind: "shakable", card: "J040" },
  { kind: "shakable", card: "J041" },
  { kind: "shakable", card: "A05" },
  { kind: "shakable", card: "R05" },
  { kind: "shakable", card: "J050" },
  { kind: "shakable", card: "J051" },
  { kind: "shakable", card: "A06" },
  { kind: "shakable", card: "R06" },
  { kind: "shakable", card: "J060" },
  { kind: "shakable", card: "J061" },
  { kind: "shakable", card: "A07" },
  { kind: "shakable", card: "R07" },
  { kind: "shakable", card: "J070" },
  { kind: "shakable", card: "J071" },
  { kind: "shakable", card: "B08" },
  { kind: "shakable", card: "A08" },
  { kind: "shakable", card: "J080" },
  { kind: "shakable", card: "J081" },
  { kind: "shakable", card: "A09" },
  { kind: "shakable", card: "R09" },
  { kind: "shakable", card: "J090" },
  { kind: "shakable", card: "J091" },
  { kind: "shakable", card: "A10" },
  { kind: "shakable", card: "R10" },
  { kind: "shakable", card: "J100" },
  { kind: "shakable", card: "J101" },
  { kind: "shakable", card: "B11" },
  { kind: "shakable", card: "J110" },
  { kind: "shakable", card: "J111" },
  { kind: "shakable", card: "J112" },
  { kind: "shakable", card: "B12" },
  { kind: "shakable", card: "A12" },
  { kind: "shakable", card: "R12" },
  { kind: "shakable", card: "J120" },
  { kind: "shaking", option: false },
  { kind: "shaking", option: true },
  { kind: "select match", match: "B01" },
  { kind: "select match", match: "R01" },
  { kind: "select match", match: "J010" },
  { kind: "select match", match: "J011" },
  { kind: "select match", match: "A02" },
  { kind: "select match", match: "R02" },
  { kind: "select match", match: "J020" },
  { kind: "select match", match: "J021" },
  { kind: "select match", match: "B03" },
  { kind: "select match", match: "R03" },
  { kind: "select match", match: "J030" },
  { kind: "select match", match: "J031" },
  { kind: "select match", match: "A04" },
  { kind: "select match", match: "R04" },
  { kind: "select match", match: "J040" },
  { kind: "select match", match: "J041" },
  { kind: "select match", match: "A05" },
  { kind: "select match", match: "R05" },
  { kind: "select match", match: "J050" },
  { kind: "select match", match: "J051" },
  { kind: "select match", match: "A06" },
  { kind: "select match", match: "R06" },
  { kind: "select match", match: "J060" },
  { kind: "select match", match: "J061" },
  { kind: "select match", match: "A07" },
  { kind: "select match", match: "R07" },
  { kind: "select match", match: "J070" },
  { kind: "select match", match: "J071" },
  { kind: "select match", match: "B08" },
  { kind: "select match", match: "A08" },
  { kind: "select match", match: "J080" },
  { kind: "select match", match: "J081" },
  { kind: "select match", match: "A09" },
  { kind: "select match", match: "R09" },
  { kind: "select match", match: "J090" },
  { kind: "select match", match: "J091" },
  { kind: "select match", match: "A10" },
  { kind: "select match", match: "R10" },
  { kind: "select match", match: "J100" },
  { kind: "select match", match: "J101" },
  { kind: "select match", match: "B11" },
  { kind: "select match", match: "J110" },
  { kind: "select match", match: "J111" },
  { kind: "select match", match: "J112" },
  { kind: "select match", match: "B12" },
  { kind: "select match", match: "A12" },
  { kind: "select match", match: "R12" },
  { kind: "select match", match: "J120" },
  { kind: "four of a month", option: false },
  { kind: "four of a month", option: true },
  { kind: "move animal 9", option: false },
  { kind: "move animal 9", option: true },
  { kind: "go", option: false },
  { kind: "go", option: true },
];
