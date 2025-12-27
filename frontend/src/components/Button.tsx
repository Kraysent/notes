import type { ReactNode } from 'react'
import { getText } from '../texts'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  tooltipKey?: string
}

function Button({ children, onClick, tooltipKey }: ButtonProps) {
  const tooltip = tooltipKey ? getText(tooltipKey) : ""

  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-600 bg-[#2d2d2d] hover:bg-[#3d3d3d] transition-colors flex items-center justify-center"
      title={tooltip}
    >
      {children}
    </button>
  )
}

export default Button

