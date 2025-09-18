'use client'

import { usePosts } from '@/entities/api/posts'
import type { Post } from '@/entities/models'
import { Button, Pagination, useDisclosure } from '@heroui/react'
import { FC, useMemo, useState } from 'react'
import { CreatePostModal, EditPostModal, PostCard } from '../../features'

// interface
interface PostListModuleProps {
  initialData?: Post[]
}

const POSTS_PER_PAGE = 6

// component
const PostListModule: FC<PostListModuleProps> = ({ initialData }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange } = useDisclosure()
  const { isOpen: isEditOpen, onOpenChange: onEditOpenChange, onOpen: onEditOpen } = useDisclosure()

  const { data: posts, isLoading } = usePosts()

  const { currentPosts, totalPages } = useMemo(() => {
    const allPosts = posts || initialData || []

    const uniquePosts = allPosts.filter(
      (post: Post, index: number, arr: Post[]) => arr.findIndex((p: Post) => p.id === post.id) === index,
    )

    const totalPages = Math.ceil(uniquePosts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const currentPosts = uniquePosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

    return { currentPosts, totalPages }
  }, [posts, initialData, currentPage])


  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    onEditOpen()
  }

  const handleCloseEditModal = () => {
    setEditingPost(null)
    onEditOpenChange()
  }

  if (isLoading && !initialData) return <div className='py-16 text-center text-gray-500'>Loading posts...</div>

  if (currentPosts.length === 0 && !isLoading)
    return (
      <div className='flex min-h-[calc(100vh-300px)] items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-6xl'>📝</div>
          <h3 className='mb-2 text-xl font-semibold text-gray-900'>No posts yet</h3>
          <p className='mb-6 text-gray-600'>Be the first to create a post!</p>
          <Button color='primary' onPress={onCreateOpen}>
            Create First Post
          </Button>
        </div>
        <CreatePostModal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} />
      </div>
    )

  return (
    <>
      <div className='space-y-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-2xl font-bold'>Latest Posts</h2>
          <Button color='primary' onPress={onCreateOpen}>
            ✏️ Create Post
          </Button>
        </div>

        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {currentPosts.map((post: Post, index: number) => (
            <PostCard key={`post-${post.id}-${index}`} post={post} onEdit={handleEditPost} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className='flex justify-center pt-8'>
            <Pagination
              isCompact
              showControls
              page={currentPage}
              total={totalPages}
              onChange={setCurrentPage}
              color='primary'
              size='lg'
              classNames={{
                wrapper: 'gap-2',
                item: 'w-10 h-10 text-small font-medium data-[active=true]:text-black',
                cursor: 'bg-white text-black font-bold shadow-lg border border-gray-300',
                prev: 'text-gray-600 bg-transparent',
                next: 'text-gray-600 bg-transparent',
              }}
            />
          </div>
        )}
      </div>

      <CreatePostModal isOpen={isCreateOpen} onOpenChange={onCreateOpenChange} />
      <EditPostModal isOpen={isEditOpen} onOpenChange={handleCloseEditModal} post={editingPost} />
    </>
  )
}

export default PostListModule
