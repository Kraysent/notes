import type { ReactNode, HTMLAttributes } from 'react'

export const TextSize = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  Text: 'text',
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

function Text({ children, size = TextSize.H3, color = TextColor.Primary, className = '', ...props }: TextProps) {
  const sizeClasses = {
    [TextSize.H1]: 'text-[2.25em] font-bold leading-[1.2] mt-0 mb-[0.5em]',
    [TextSize.H2]: 'text-[1.5em] font-semibold leading-[1.3] mt-[1.25em] mb-[0.5em]',
    [TextSize.H3]: 'text-[1.25em] font-semibold leading-[1.4] mt-[1em] mb-[0.4em]',
    [TextSize.H4]: 'text-xl font-semibold leading-normal mt-2 mb-0.5',
    [TextSize.H5]: 'text-lg font-semibold leading-normal mt-2 mb-0.5',
    [TextSize.H6]: 'text-base font-semibold leading-normal mt-1 mb-0.5',
    [TextSize.Text]: 'text-sm leading-normal',
  }

  const colorClasses = {
    [TextColor.Primary]: 'text-gray-100',
    [TextColor.Secondary]: 'text-gray-400',
  }

  return (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Text

