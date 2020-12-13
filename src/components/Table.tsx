// Table component for rendering room/user list

import React from "react";

const Wrapper: React.FC = ({ children }) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow max-w-4xl m-auto box-content mx-4">
    <table className="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
      {children}
    </table>
  </div>
);
const Head: React.FC = ({ children }) => <thead>{children}</thead>;
const Body: React.FC = ({ children }) => <tbody>{children}</tbody>;
const Row: React.FC<React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>> = ({ children, ...props }) => (
  <tr {...props} className={`text-left ${props.className ?? ""}`}>
    {children}
  </tr>
);
const Data: React.FC<React.DetailedHTMLProps<
  React.TdHTMLAttributes<HTMLTableDataCellElement>,
  HTMLTableDataCellElement
>> = ({ children, ...props }) => (
  <td
    {...props}
    className={`border-dashed border-t border-gray-200 ${
      props.className ?? ""
    }`}
  >
    {children}
  </td>
);
const Header: React.FC<React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
  HTMLTableHeaderCellElement
>> = ({ children, ...props }) => (
  <th
    {...props}
    className={`py-2 px-3 sticky top-0 border-b text-gray-700 border-gray-200 bg-gray-100 ${
      props.className ?? ""
    }`}
  >
    {children}
  </th>
);

const Table = {
  Wrapper,
  Head,
  Body,
  Row,
  Data,
  Header,
};

export default Table;
