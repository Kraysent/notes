import { StringSlice } from "../../utils";

export interface CheckboxProps {
  checked: boolean;
  onChange?: (node: StringSlice) => void;
  "data-startoffset"?: number;
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
              offset: props["data-startoffset"] ?? 0,
            },
            endPos: {
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
