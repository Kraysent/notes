interface InputProps {
  type?: string;
  value?: string;
  placeholder?: string;
  checked?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}

export function Input({
  type = "text",
  value,
  placeholder,
  checked,
  ...props
}: InputProps) {
  if (type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={checked}
        {...props}
        className="mr-2"
      />
    );
  }

  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      {...props}
      className="px-2 py-1 bg-[#2d2d2d] border border-[#404040] rounded text-gray-100 focus:outline-none focus:border-[#555] disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}
