import React from "react";

const Header: React.FC<{ style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <header className="p-4" style={style}>
    {children}
  </header>
);

export default Header;
