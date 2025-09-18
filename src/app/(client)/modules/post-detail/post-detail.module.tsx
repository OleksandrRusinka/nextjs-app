'use client'

import { Button, Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react'
import { ArrowLeft, Calendar, Edit, Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC } from 'react'

import { useDeletePost, usePost } from '@/entities/api/posts'
import { usePostsStore } from '@/shared/store'
import { ContainerComponent } from '@/shared/ui'

// interface
interface PostDetailModuleProps {
  postId: string
}

// component
const PostDetailModule: FC<PostDetailModuleProps> = ({ postId }) => {
  const { data: post, isLoading, error } = usePost(postId)
  const deletePostMutation = useDeletePost()

  const savedPosts = usePostsStore((state) => state.savedPosts)
  const addSavedPost = usePostsStore((state) => state.addSavedPost)
  const removeSavedPost = usePostsStore((state) => state.removeSavedPost)

  if (isLoading) {
    return (
      <ContainerComponent className='py-8'>
        <div className='mx-auto max-w-4xl text-center text-gray-500'>Loading post...</div>
      </ContainerComponent>
    )
  }

  if (error || !post) notFound()

  const isUserPost = post.id < 0
  const isSaved = savedPosts.some((p) => p.id === post.id)

  const handleToggleSave = () => (isSaved ? removeSavedPost(post.id) : addSavedPost(post))
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return
    try {
      await deletePostMutation.mutateAsync(post.id)
      window.location.href = '/'
    } catch (err) {
      console.error('Failed to delete post:', err)
    }
  }

  // return
  return (
    <ContainerComponent className='py-8'>
      <div className='mx-auto max-w-4xl space-y-8'>
        <Card
          className={`border-2 p-2 shadow-lg ${isUserPost ? 'border-green-100 bg-green-50/30' : 'border-gray-100'}`}
        >
          <CardHeader className='justify-between pb-4'>
            <h1 className='p-2 text-center text-3xl font-bold text-gray-900 md:text-4xl'>{post.title}</h1>
            <div className='mt-3 flex flex-wrap justify-center gap-4 text-sm text-gray-600'>
              <Chip size='sm' variant='flat' className='flex items-center gap-1 p-2'>
                <Calendar className='h-3 w-3' />
                <span>{new Date().toLocaleDateString()}</span>
              </Chip>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className='pt-6'>
            <div className='prose prose-lg prose-gray max-w-none'>
              <p className='whitespace-pre-wrap text-gray-700'>{post.body}</p>
            </div>
          </CardBody>
        </Card>

        <div className='flex flex-col items-center gap-3 border-t border-gray-200 pt-6'>
          <div className='flex flex-wrap justify-between gap-3'>
            {!isUserPost && (
              <Button
                color={isSaved ? 'danger' : 'default'}
                variant='flat'
                size='sm'
                onPress={handleToggleSave}
                className='flex items-center gap-2 font-medium'
              >
                <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            )}

            {isUserPost && (
              <>
                <Button
                  as={Link}
                  href='/saved'
                  color='warning'
                  variant='flat'
                  size='sm'
                  className='flex items-center gap-2 font-medium'
                >
                  <Edit className='h-4 w-4' /> Edit
                </Button>
                <Button
                  color='danger'
                  variant='flat'
                  size='sm'
                  onPress={handleDeletePost}
                  isLoading={deletePostMutation.isPending}
                  className='flex items-center gap-2 font-medium'
                >
                  <Trash2 className='h-4 w-4' /> Delete
                </Button>
              </>
            )}
          </div>

          <Button as={Link} href='/' color='primary' size='lg' className='flex items-center gap-2 px-8 font-semibold'>
            <ArrowLeft className='h-4 w-4' /> Back to All Posts
          </Button>
        </div>
      </div>
    </ContainerComponent>
  )
}

export default PostDetailModule
