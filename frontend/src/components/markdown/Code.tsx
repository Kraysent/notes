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

  const isInPre = !inline
  const codeClassName = isInPre 
    ? `bg-transparent p-0 font-normal ${className || ''}`
    : `bg-white/10 ${className || ''}`

  return (
    <code className={codeClassName} {...props}>
      {children}
    </code>
  )
}

