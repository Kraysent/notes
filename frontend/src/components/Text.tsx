import type { ReactNode, HTMLAttributes } from 'react'

export const TextSize = {
  Large: 'large',
  Medium: 'medium',
  Small: 'small',
} as const

export const TextColor = {
  Primary: 'primary',
  Secondary: 'secondary',
} as const

export type TextSizeType = typeof TextSize[keyof typeof TextSize]
export type TextColorType = typeof TextColor[keyof typeof TextColor]

interface TextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  size?: TextSizeType
  color?: TextColorType
}

function Text({ children, size = TextSize.Medium, color = TextColor.Primary, className = '', ...props }: TextProps) {
  const sizeClasses = {
    [TextSize.Large]: 'text-xl font-semibold',
    [TextSize.Medium]: 'font-medium',
    [TextSize.Small]: 'text-sm',
  }

  const colorClasses = {
    [TextColor.Primary]: 'text-gray-900 dark:text-gray-100',
    [TextColor.Secondary]: 'text-gray-500 dark:text-gray-400',
  }

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Text

