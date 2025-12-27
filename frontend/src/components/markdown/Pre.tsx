import type { ReactNode } from 'react'

interface PreProps {
  children: ReactNode
  [key: string]: any
}

export function Pre({ children, ...props }: PreProps) {
  return (
    <pre className="bg-white/5" {...props}>
      {children}
    </pre>
  )
}

