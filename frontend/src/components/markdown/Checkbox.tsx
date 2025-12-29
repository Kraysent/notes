import { StringSlice } from "../../utils";

export interface CheckboxProps {
  checked: boolean;
  onChange?: (node: StringSlice) => void;
  "data-startline"?: number;
  "data-startcolumn"?: number;
  "data-startoffset"?: number;
  "data-endline"?: number;
  "data-endcolumn"?: number;
  "data-endoffset"?: number;
  [key: string]: unknown;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <input
      type="checkbox"
      defaultChecked={props.checked}
      onChange={() => {
        if (props.onChange) {
          const node: StringSlice = {
            startPos: {
              line: props["data-startline"] ?? 0,
              column: props["data-startcolumn"] ?? 0,
              offset: props["data-startoffset"] ?? 0,
            },
            endPos: {
              line: props["data-endline"] ?? 0,
              column: props["data-endcolumn"] ?? 0,
              offset: props["data-endoffset"] ?? 0,
            },
          };
          props.onChange(node);
        }
      }}
      className="mr-2"
    />
  );
}
