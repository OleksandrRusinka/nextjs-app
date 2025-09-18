import { type FC, type ReactNode } from 'react'

import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'

// interface
interface LayoutModuleProps {
  children: ReactNode
}

// component
const LayoutModule: FC<LayoutModuleProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className='min-h-[calc(100vh-160px)] flex-1'>{children}</main>
      <Footer />
    </>
  )
}

export default LayoutModule
