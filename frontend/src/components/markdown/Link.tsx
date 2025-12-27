import type { ReactNode } from 'react'

interface LinkProps {
  href?: string
  children: ReactNode
  [key: string]: any
}

export function Link({ href, children, ...props }: LinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  )
}

