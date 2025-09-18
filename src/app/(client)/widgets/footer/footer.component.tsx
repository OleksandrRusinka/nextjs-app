import { FC } from 'react'

// interface
interface IProps {}

// component
const FooterComponent: FC<Readonly<IProps>> = () => {
  // return
  return (
    <footer className='mt-auto border-t border-gray-200 bg-gray-50/50'>
      <div className='mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8'>
        <div className='flex flex-col items-center justify-between space-y-2 text-center sm:flex-row sm:space-y-0'>
          <div className='text-sm text-gray-600'>
            Built with <span className='font-medium'>Next.js</span>
          </div>
          <div className='text-xs text-gray-500'>© {new Date().getFullYear()} Blog. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

export default FooterComponent
