'use client'

import { Button, Card, CardBody, CardHeader, useDisclosure } from '@heroui/react'
import Link from 'next/link'
import { FC, useState } from 'react'

import { useDeletePost, useSavedPosts } from '@/entities/api/posts'
import type { Post } from '@/entities/models'
import { ContainerComponent } from '@/shared/ui'
import { EditPostModal } from '../../features'

// interface
interface SavedPostsModuleProps {}

// component
const SavedPostsModule: FC<SavedPostsModuleProps> = () => {
  const { data: savedPosts = [] } = useSavedPosts()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  const deletePostMutation = useDeletePost()

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    onOpen()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  const handleCloseEditModal = () => {
    setEditingPost(null)
    onOpenChange()
  }

  // return
  return (
    <ContainerComponent className='py-8'>
      <div className='space-y-8'>
        <div className='space-y-4 text-center'>
          <h1 className='text-4xl font-bold text-gray-900'>Saved Posts</h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-600'>
            Your personally created posts that you can edit and delete
          </p>
        </div>

        {savedPosts.length === 0 ? (
          <div className='flex min-h-[calc(100vh-300px)] items-center justify-center'>
            <div className='text-center'>
              <div className='mb-4 text-6xl'>📝</div>
              <h3 className='mb-2 text-xl font-semibold text-gray-900'>No saved posts yet</h3>
              <p className='mb-6 text-gray-600'>Create your first post to see it here!</p>
              <Button as={Link} href='/' color='primary'>
                Go to All Posts
              </Button>
            </div>
          </div>
        ) : (
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {savedPosts.map((post: Post, index: number) => (
              <Card
                key={`saved-post-${post.id}-${index}`}
                className='flex h-full flex-col border-2 border-green-100 bg-green-50/30 p-2'
                shadow='none'
              >
                <CardHeader className='pb-2'>
                  <div className='flex w-full items-start justify-between gap-3'>
                    <h3 className='line-clamp-2 flex-1 text-lg font-semibold text-gray-900'>{post.title}</h3>
                    <span className='shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700'>
                      Your Post
                    </span>
                  </div>
                </CardHeader>

                <CardBody className='flex flex-1 flex-col pt-0'>
                  <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600'>{post.body}</p>
                  <div className='mt-auto space-y-2 border-t border-gray-100 pt-2'>
                    <div className='flex gap-2 text-center'>
                      <Button
                        as={Link}
                        href={`/posts/${post.id}`}
                        size='sm'
                        color='primary'
                        variant='flat'
                        className='flex-1 font-medium'
                      >
                        View
                      </Button>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        color='warning'
                        variant='flat'
                        className='flex-1 font-medium'
                        onPress={() => handleEdit(post)}
                      >
                        Edit
                      </Button>
                      <Button
                        size='sm'
                        color='danger'
                        variant='flat'
                        className='flex-1 font-medium'
                        onPress={() => handleDelete(post.id)}
                        isLoading={deletePostMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        <EditPostModal isOpen={isOpen} onOpenChange={handleCloseEditModal} post={editingPost} />
      </div>
    </ContainerComponent>
  )
}

export default SavedPostsModule
