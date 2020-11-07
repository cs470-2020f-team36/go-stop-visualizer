import React from "react";

const mapIconBaseSize = {
  sm: "text-xl",
  base: "text-2xl",
  lg: "text-4xl",
};

type IconButtonProps = {
  size?: keyof typeof mapIconBaseSize;
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
};

const IconButton: React.FC<IconButtonProps> = (props) => {
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

export default IconButton;
