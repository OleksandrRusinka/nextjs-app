'use client'

import { Button, Card, CardBody, CardHeader } from '@heroui/react'
import { Edit, Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'

import { useDeletePost } from '@/entities/api/posts'
import type { Post } from '@/entities/models'
import { usePostsStore } from '@/shared/store'

// interfaces
interface PostCardProps {
  post: Post
  onEdit: (post: Post) => void
}

// component
const PostCard: FC<PostCardProps> = ({ post, onEdit }) => {
  const deletePostMutation = useDeletePost()

  const savedPosts = usePostsStore((state) => state.savedPosts)
  const addSavedPost = usePostsStore((state) => state.addSavedPost)
  const removeSavedPost = usePostsStore((state) => state.removeSavedPost)

  const isUserPost = post.id < 0
  const isSaved = savedPosts.some((p) => p.id === post.id)

  const handleToggleSave = () => {
    if (isSaved) {
      removeSavedPost(post.id)
    } else {
      addSavedPost(post)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePostMutation.mutateAsync(post.id)
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }

  return (
    <Card
      className={`flex h-full flex-col border-2 p-2 ${
        isUserPost ? 'border-green-100 bg-green-50/30' : 'border-gray-100'
      }`}
      shadow='none'
    >
      <CardHeader className='pb-2'>
        <div className='flex w-full items-start justify-between gap-3'>
          <h3 className='line-clamp-2 flex-1 text-lg font-semibold text-gray-900'>{post.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs ${
              isUserPost ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {isUserPost ? 'Your Post' : `#${post.id}`}
          </span>
        </div>
      </CardHeader>

      <CardBody className='flex flex-1 flex-col pt-0'>
        <p className='mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600'>{post.body}</p>

        <div className='mt-auto border-t border-gray-100 pt-3'>
          <div className='flex items-center justify-between gap-2'>
            <Button
              as={Link}
              href={`/posts/${post.id}`}
              size='sm'
              color='primary'
              variant='flat'
              className='font-medium'
            >
              Read More
            </Button>

            <div className='flex items-center gap-2'>
              {!isUserPost && (
                <Button
                  isIconOnly
                  size='sm'
                  variant='flat'
                  color={isSaved ? 'danger' : 'default'}
                  className='h-8 min-w-8'
                  onPress={handleToggleSave}
                  title={isSaved ? 'Remove from saved' : 'Save post'}
                >
                  <Heart className={`h-3 w-3 ${isSaved ? 'fill-current' : ''}`} />
                </Button>
              )}

              {isUserPost && (
                <>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='flat'
                    color='warning'
                    className='h-8 min-w-8'
                    onPress={() => onEdit(post)}
                    title='Edit post'
                  >
                    <Edit className='h-3 w-3' />
                  </Button>

                  <Button
                    isIconOnly
                    size='sm'
                    variant='flat'
                    color='danger'
                    className='h-8 min-w-8'
                    onPress={handleDelete}
                    isLoading={deletePostMutation.isPending}
                    title='Delete post'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default PostCard
