'use client'

import Link from 'next/link'
import { FC } from 'react'

import { usePostsStore } from '@/shared/store'

// component
const Header: FC = () => {
  const savedPostsCount = usePostsStore((state) => state.savedPosts.length)

  // return
  return (
    <header className='sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          <Link
            href='/'
            className='flex items-center space-x-2 font-bold text-gray-900 transition-colors hover:text-blue-600'
          >
            <span className='text-2xl'>📝</span>
            <span className='text-xl'>Blog</span>
          </Link>

          <nav className='flex items-center space-x-6'>
            <Link
              href='/'
              className='rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900'
            >
              All Posts
            </Link>
            <Link
              href='/saved'
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900'
            >
              Saved Posts
              {savedPostsCount > 0 && (
                <span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800'>
                  {savedPostsCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
