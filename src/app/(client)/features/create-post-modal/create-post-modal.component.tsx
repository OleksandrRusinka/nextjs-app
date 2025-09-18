'use client'

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@heroui/react'
import { FC, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useCreatePost } from '@/entities/api/posts'

// interface
interface CreatePostFormData {
  title: string
  body: string
}

interface CreatePostModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

// component
const CreatePostModal: FC<CreatePostModalProps> = ({ isOpen, onOpenChange }) => {
  const createPostMutation = useCreatePost()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      body: '',
    },
  })

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      await createPostMutation.mutateAsync({
        title: data.title,
        body: data.body,
        userId: 1,
      })
      onOpenChange()
      reset()
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  // return
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement='center'
      size='2xl'
      isDismissable={true}
      backdrop='blur'
      shouldBlockScroll={true}
      classNames={{
        backdrop: 'backdrop-blur-md bg-black/60 !z-[9998]',
        wrapper:
          'flex items-center justify-center min-h-screen w-full h-full !z-[9999] fixed top-0 left-0 right-0 bottom-0',
        base: 'max-w-2xl w-full mx-4 !z-[10000] bg-white rounded-xl shadow-2xl border border-gray-200/50',
        header: 'bg-transparent border-b border-gray-200/60 px-6 py-5',
        body: 'bg-transparent px-6 py-6',
        footer: 'bg-transparent border-t border-gray-200/60 px-6 py-5',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)} className='bg-transparent'>
            <ModalHeader className='text-2xl font-bold text-gray-900'>Create New Post</ModalHeader>
            <ModalBody>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <Input
                    {...register('title', {
                      required: 'Title is required',
                      minLength: { value: 5, message: 'Title must be at least 5 characters' },
                    })}
                    placeholder='Enter your post title...'
                    variant='bordered'
                    size='lg'
                    isInvalid={!!errors.title}
                    classNames={{
                      inputWrapper:
                        'border-2 border-gray-300/70 hover:border-blue-400 focus-within:border-blue-500 bg-gray-50/50 rounded-lg px-4 py-3 data-[invalid=true]:border-red-400',
                      input: 'text-gray-900 text-base placeholder-gray-500 font-medium outline-none',
                    }}
                  />
                  {errors.title && <p className='px-1 text-sm font-medium text-red-500'>{errors.title.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Textarea
                    {...register('body', {
                      required: 'Content is required',
                      minLength: { value: 20, message: 'Content must be at least 20 characters' },
                    })}
                    placeholder='Write your post content here...'
                    variant='bordered'
                    size='lg'
                    minRows={6}
                    isInvalid={!!errors.body}
                    classNames={{
                      inputWrapper:
                        'border-2 border-gray-300/70 hover:border-blue-400 focus-within:border-blue-500 bg-gray-50/50 rounded-lg px-4 py-3 w-full data-[invalid=true]:border-red-400',
                      input:
                        'text-gray-900 text-base placeholder-gray-500 font-medium resize-none leading-relaxed outline-none',
                    }}
                  />
                  {errors.body && <p className='px-1 text-sm font-medium text-red-500'>{errors.body.message}</p>}
                </div>
              </div>
            </ModalBody>

            <ModalFooter>
              <div className='flex justify-end gap-3'>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                  size='lg'
                  className='px-6 font-semibold text-gray-700 hover:bg-red-50 hover:text-red-600'
                >
                  Cancel
                </Button>
                <Button
                  color='primary'
                  type='submit'
                  size='lg'
                  isLoading={createPostMutation.isPending}
                  className='bg-gradient-to-r from-blue-500 to-blue-600 px-8 font-semibold text-white shadow-lg hover:from-blue-600 hover:to-blue-700'
                >
                  {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CreatePostModal
