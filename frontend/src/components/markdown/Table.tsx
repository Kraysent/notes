import type { ReactNode } from "react";

export interface TableProps {
  children: ReactNode;
}

export interface TableRowProps {
  children: ReactNode;
}

export interface TableCellProps {
  children: ReactNode;
}

export interface TableHeaderProps {
  children: ReactNode;
}

export function Table(props: TableProps) {
  return (
    <table className="w-full my-3 border-collapse border-spacing-0" {...props}>
      {props.children}
    </table>
  );
}

export function TableRow(props: TableRowProps) {
  return <tr {...props}>{props.children}</tr>;
}

export function TableCell(props: TableCellProps) {
  return (
    <td className="py-2 px-4 border border-white/20" {...props}>
      {props.children}
    </td>
  );
}

export function TableHeader(props: TableHeaderProps) {
  return (
    <th
      className="py-2 px-4 border border-white/20 font-semibold bg-white/5"
      {...props}
    >
      {props.children}
    </th>
  );
}
