import React from "react";

type TextInputProps = {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
  value?: string | number | readonly string[];
  placeholder?: string;
};

const TextInput: React.FC<TextInputProps> = (props) => {
  return (
    <input
      {...props}
      className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${props.className}`}
    />
  );
};

export default TextInput;
