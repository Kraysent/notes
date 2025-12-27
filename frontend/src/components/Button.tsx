import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
  title?: string
}

function Button({ children, onClick, title }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2d2d2d] hover:bg-gray-50 dark:hover:bg-[#3d3d3d] transition-colors flex items-center justify-center"
      title={title}
    >
      {children}
    </button>
  )
}

export default Button

