import type { ReactNode, AnchorHTMLAttributes } from 'react'

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  href?: string
}

function Link({ children, href, className = '', ...props }: LinkProps) {
  return (
    <a 
      href={href} 
      className={`text-[#60a5fa] underline ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}

export default Link

