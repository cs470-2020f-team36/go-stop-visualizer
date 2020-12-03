import React from "react";

const mapIconBaseSize = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

type TextButtonProps = {
  size?: keyof typeof mapIconBaseSize;
  dark?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
};

const TextButton: React.FC<TextButtonProps> = (props) => {
  const { size = "base", dark = false, ...restProps } = props;
  return (
    <button
      {...restProps}
      className={`flex items-center justify-center px-5 py-3 rounded-full
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

export default TextButton;
