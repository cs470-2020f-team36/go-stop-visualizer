import React from "react";
import { Card } from "../types/game";
import { cardNameKo, cardToImageSrc } from "../utils/card";

import "./CardButton.css";

type CardButtonProps = {
  card?: Card;
  onClick?: React.MouseEventHandler;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
  anchorBottom?: boolean;
  hoverEnabled?: boolean;
};

const CardButton: React.FC<CardButtonProps> = (props) => {
  const {
    card = "?",
    anchorBottom = false,
    hoverEnabled = true,
    children,
    ...restProps
  } = props;
  return (
    <button
      {...restProps}
      className={`${hoverEnabled ? "card-button" : ""} ${
        props.className ?? ""
      } ${anchorBottom ? "anchor-bottom" : ""} ${
        !hoverEnabled ? "cursor-default" : ""
      }`}
    >
      <img
        src={cardToImageSrc(card)}
        className="w-full h-full"
        style={{
          borderRadius: 4,
        }}
        alt={cardNameKo(card)}
      />
    </button>
  );
};

export default CardButton;
