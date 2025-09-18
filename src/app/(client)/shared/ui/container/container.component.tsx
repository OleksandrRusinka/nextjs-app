import { FC, ReactNode } from 'react'

import { cn } from '@heroui/react'

// interface
interface ContainerProps {
  children: ReactNode
  className?: string
}

// component
const ContainerComponent: FC<ContainerProps> = ({ children, className = '' }) => {
  return <div className={cn('mx-auto max-w-6xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

export default ContainerComponent
