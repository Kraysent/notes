import { StringSlice, type OriginalSlice } from "../../utils";

export interface CheckboxProps extends OriginalSlice {
  checked: boolean;
  onChange?: (node: StringSlice) => void;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <input
      type="checkbox"
      defaultChecked={props.checked}
      onChange={() => {
        if (props.onChange) {
          const node = StringSlice.fromOriginalSlice(props);
          props.onChange(node);
        }
      }}
      className="mr-2"
    />
  );
}
