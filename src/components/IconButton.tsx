import React from "react";

const mapIconBaseSize = {
  sm: "text-xl",
  base: "text-2xl",
  lg: "text-4xl",
};

type IconButtonProps = {
  size?: keyof typeof mapIconBaseSize;
  dark?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
};

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { size = "base", dark = false, ...restProps } = props;
  return (
    <button
      {...restProps}
      className={`flex items-center justify-center p-3 rounded-full
        disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed 
        focus:outline-none focus:shadow-outline ${mapIconBaseSize[size]} ${
        props.className ?? ""
      } ${
        dark
          ? "text-white bg-opacity-15 hover:bg-opacity-35 bg-white"
          : "bg-opacity-25 hover:bg-opacity-50 text-gray-800 bg-gray-400"
      }`}
    />
  );
};

export default IconButton;
