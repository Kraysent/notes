import { StringSlice } from "../../utils";

export interface CheckboxProps {
  checked: boolean;
  onChange?: (node: StringSlice) => void;
  "data-startoffset"?: string;
  "data-endoffset"?: string;
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
              offset: Number(props["data-startoffset"]),
            },
            endPos: {
              offset: Number(props["data-endoffset"]),
            },
          };
          props.onChange(node);
        }
      }}
      className="mr-2"
    />
  );
}
