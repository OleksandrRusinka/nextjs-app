import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import type { Post } from '@/entities/models'

interface PostsState {
  savedPosts: Post[]
  addSavedPost: (post: Post) => void
  updateSavedPost: (id: number, updates: Partial<Post>) => void
  removeSavedPost: (id: number) => void
  getSavedPost: (id: number) => Post | undefined
}

export const usePostsStore = create<PostsState>()(
  devtools(
    persist(
      (set, get) => ({
        savedPosts: [],

        addSavedPost: (post) =>
          set((state) => ({
            savedPosts: [post, ...state.savedPosts],
          })),

        updateSavedPost: (id, updates) =>
          set((state) => ({
            savedPosts: state.savedPosts.map((post) => (post.id === id ? { ...post, ...updates } : post)),
          })),

        removeSavedPost: (id) =>
          set((state) => ({
            savedPosts: state.savedPosts.filter((post) => post.id !== id),
          })),

        getSavedPost: (id) => get().savedPosts.find((post) => post.id === id),
      }),
      {
        name: 'posts-storage',
      },
    ),
    {
      name: 'posts-store',
    },
  ),
)
