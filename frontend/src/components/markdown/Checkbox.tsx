import { generateId } from "../../utils";

export interface CheckboxProps {
  node: unknown;
  checked: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <input
      id={generateId(props.node)}
      type="checkbox"
      defaultChecked={props.checked}
      onChange={props.onChange}
      className="mr-2"
    />
  );
}
