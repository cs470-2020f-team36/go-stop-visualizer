import React from "react";
import { connect } from "redux-zero/react";
import actions, { ActionTypes } from "../actions";
import GoStop from "../components/GoStop";
import { AppState } from "../store";
import { Game } from "../types/game";

const game: Game = {
  board: {
    hands: [
      ["B01", "A04", "R04", "J100", "*0"],
      ["A02", "J040", "R10", "J101", "R12"],
    ],
    capture_fields: [
      [
        "R06",
        "J060",
        "J061",
        "A06",
        "B11",
        "J110",
        "J030",
        "A08",
        "J080",
        "B03",
        "J031",
        "J010",
        "J011",
        "A12",
        "J120",
        "+3",
      ],
      [
        "R03",
        "J071",
        "A07",
        "J112",
        "B08",
        "J081",
        "R09",
        "A09",
        "J090",
        "J091",
        "J111",
      ],
    ],
    center_field: {
      "2": ["J020"],
      "5": ["J051"],
      "7": ["J070"],
    },
    drawing_pile: [
      "R02",
      "B12",
      "J041",
      "J050",
      "R05",
      "+2",
      "A10",
      "J021",
      "A05",
      "R01",
      "R07",
    ],
  },
  state: {
    player: 0,
    bomb_increment: 2,
    go_histories: [[], []],
    select_match: null,
    shaking: null,
    shaking_histories: [[["R06", "J060", "J061"]], [["B08", "J080", "J081"]]],
    stacking_histories: [[], []],
    score_factors: [
      [
        {
          kind: "bright",
          arg: 0,
        },
        {
          kind: "animal",
          arg: 3,
        },
        {
          kind: "ribbon",
          arg: 1,
        },
        {
          kind: "junk",
          arg: 13,
        },
        {
          kind: "go",
          arg: 0,
        },
      ],
      [
        {
          kind: "bright",
          arg: 0,
        },
        {
          kind: "animal",
          arg: 2,
        },
        {
          kind: "ribbon",
          arg: 2,
        },
        {
          kind: "junk",
          arg: 7,
        },
        {
          kind: "go",
          arg: 0,
        },
      ],
    ],
    scores: [4, 0],
    animal_9_moved: null,
    ended: false,
    winner: null,
  },
  flags: {
    go: false,
    select_match: false,
    shaking: false,
    move_animal_9: false,
    four_of_a_month: false,
  },
  logs: [],
  actions: [
    {
      kind: "throw",
      card: "B01",
    },
    {
      kind: "throw",
      card: "A04",
    },
    {
      kind: "throw",
      card: "R04",
    },
    {
      kind: "throw",
      card: "J100",
    },
    {
      kind: "throw bomb",
    },
  ],
  players: ["카누", "Kanu"],
};

type TestProps = {};
const Test: React.FC<TestProps & ActionTypes> = ({ updateGame }) => {
  return (
    <div className="w-full h-full">
      <GoStop game={game} player={1} clientId={"hi"} updateGame={updateGame} />
    </div>
  );
};

export default connect<AppState>((s) => s, actions)(Test);
