import CodeBlock from './CodeBlock'

interface CodeProps {
  inline?: boolean
  className?: string
  children: string
  [key: string]: any
}

export function Code({ inline, className, children, ...props }: CodeProps) {
  const match = /language-(\w+)/.exec(className || '')

  if (!inline && match) {
    return (
      <CodeBlock language={match[1]} {...props}>
        {children}
      </CodeBlock>
    )
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

