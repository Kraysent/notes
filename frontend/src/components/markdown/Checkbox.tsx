export interface CheckboxProps {
  node: unknown;
  checked: boolean;
  onChange?: (node: unknown) => void;
}

export function Checkbox(props: CheckboxProps) {
  return (
    <input
      type="checkbox"
      defaultChecked={props.checked}
      onChange={() => {
        props.onChange?.(props.node);
      }}
      className="mr-2"
    />
  );
}
