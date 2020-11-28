import React from "react";

const Layout: React.FC = ({ children }) => (
  <div className="w-full bg-gray-200 min-h-full">
    <div className="max-w-4xl mx-auto text-gray-900 h-full">{children} </div>
  </div>
);

export default Layout;
