import type { CreatePostDto, Post } from '@/entities/models'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export const postsApi = {
  fetchPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts`)

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    return response.json()
  },

  fetchPostById: async (id: string | number): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch post ${id}: ${response.status}`)
    }

    return response.json()
  },

  createPost: async (data: CreatePostDto): Promise<Post> => {
    const newPost: Post = {
      id: -(Date.now() + Math.floor(Math.random() * 1000)),
      title: data.title,
      body: data.body,
      userId: data.userId,
    }

    return Promise.resolve(newPost)
  },
}
