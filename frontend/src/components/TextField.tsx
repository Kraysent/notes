import type { KeyboardEvent, ChangeEvent } from 'react'
import { getText } from '../texts'

interface TextFieldProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  onBlur?: () => void
  placeholderKey?: string
  autoFocus?: boolean
}

function TextField({ value, onChange, onKeyDown, onBlur, placeholderKey, autoFocus }: TextFieldProps) {
  const placeholder = placeholderKey ? getText(placeholderKey) : ""

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      autoFocus={autoFocus}
      className="flex-1 text-xl font-semibold bg-transparent border-none outline-none focus:outline-none p-0 m-0"
      placeholder={placeholder}
    />
  )
}

export default TextField

