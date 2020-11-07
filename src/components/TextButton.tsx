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
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
};

const TextButton: React.FC<TextButtonProps> = (props) => {
  const { size = "base", ...restProps } = props;
  return (
    <button
      {...restProps}
      className={`flex items-center justify-center p-3 rounded-full
        disabled:bg-transparent hover:bg-gray-300 active:bg-gray-400 focus:bg-gray-400 
        disabled:opacity-50 disabled:cursor-not-allowed 
        focus:outline-none focus:shadow-outline ${mapIconBaseSize[size]} ${
        props.className ?? ""
      }`}
    />
  );
};

export default TextButton;
