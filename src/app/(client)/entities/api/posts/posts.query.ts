import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'

import type { CreatePostDto, Post } from '@/entities/models'
import { usePostsStore } from '@/shared/store'

import { postsApi } from './posts.api'

export const POSTS_QUERY_KEYS = {
  root: ['posts'] as const,
  list: () => [...POSTS_QUERY_KEYS.root, 'list'] as const,
  detail: (id: string | number) => [...POSTS_QUERY_KEYS.root, 'detail', id] as const,
}

export const usePosts = (): UseQueryResult<Post[], Error> => {
  const savedPosts = usePostsStore((state) => state.savedPosts)

  return useQuery({
    queryKey: [...POSTS_QUERY_KEYS.list(), savedPosts.length, savedPosts.map((p: Post) => p.id).join(',')],
    queryFn: async (): Promise<Post[]> => {
      const apiPosts = await postsApi.fetchPosts()

      const allPosts = [...savedPosts, ...apiPosts]
      const uniquePosts = allPosts.filter(
        (post: Post, index: number, arr: Post[]) => arr.findIndex((p: Post) => p.id === post.id) === index,
      )

      return uniquePosts.sort((a: Post, b: Post) => {
        if (a.id < 0 && b.id >= 0) return -1
        if (a.id >= 0 && b.id < 0) return 1
        if (a.id < 0 && b.id < 0) return b.id - a.id
        return a.id - b.id
      })
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export const usePost = (id: string | number): UseQueryResult<Post, Error> => {
  const getSavedPost = usePostsStore((state) => state.getSavedPost)

  return useQuery({
    queryKey: POSTS_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const numId = Number(id)

      if (numId < 0) {
        const savedPost = getSavedPost(numId)
        if (!savedPost) throw new Error(`Saved post ${id} not found`)
        return savedPost
      }

      if (isNaN(numId) || numId === 0) {
        throw new Error(`Invalid post ID: ${id}`)
      }

      return postsApi.fetchPostById(id)
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message.includes('Invalid post ID') || error.message.includes('404')) {
        return false
      }
      return failureCount < 2
    },
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const addSavedPost = usePostsStore((state) => state.addSavedPost)

  return useMutation({
    mutationFn: async (data: CreatePostDto) => {
      const newPost = await postsApi.createPost(data)
      addSavedPost(newPost)
      return newPost
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEYS.root,
      })
    },
    onError: (error) => {
      console.error('Failed to create post:', error)
    },
  })
}

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const updateSavedPost = usePostsStore((state) => state.updateSavedPost)

  return useMutation({
    mutationFn: async (data: { id: number; title: string; body: string }) => {
      updateSavedPost(data.id, { title: data.title, body: data.body })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEYS.root,
      })
    },
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient()
  const removeSavedPost = usePostsStore((state) => state.removeSavedPost)

  return useMutation({
    mutationFn: async (id: number) => {
      removeSavedPost(id)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: POSTS_QUERY_KEYS.root,
      })
    },
  })
}

export const useSavedPosts = (): UseQueryResult<Post[], Error> => {
  const savedPosts = usePostsStore((state) => state.savedPosts)

  return useQuery({
    queryKey: ['saved-posts', savedPosts.map((p: Post) => p.id).join(',')],
    queryFn: () => Promise.resolve(savedPosts),
    staleTime: Infinity,
  })
}
