import type { CreatePostDto, Post } from '@/entities/models'

const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

export const postsApi = {
  fetchPosts: async (options?: RequestInit): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      next: { revalidate: 30 },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`)
    }

    const posts = await response.json()
    return posts.map((post: Post) => ({ ...post, source: 'fakejson' as const }))
  },

  fetchPostById: async (id: string | number, options?: RequestInit): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      next: { revalidate: 30 },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch post ${id}: ${response.status}`)
    }

    const post = await response.json()
    return { ...post, source: 'fakejson' as const }
  },

  createPost: async (data: CreatePostDto): Promise<Post> => {
    const newPost: Post = {
      id: -(Date.now() + Math.floor(Math.random() * 1000)),
      title: data.title,
      body: data.body,
      userId: data.userId,
      source: 'user',
    }

    return Promise.resolve(newPost)
  },

  updatePost: async (data: { id: number; title: string; body: string }): Promise<Post> => {
    if (data.id > 0) {
      const response = await fetch(`${API_BASE_URL}/posts/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          body: data.body,
          userId: 1,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update post ${data.id}: ${response.status}`)
      }

      return response.json()
    }

    return Promise.resolve({
      id: data.id,
      title: data.title,
      body: data.body,
      userId: 1,
      source: 'user',
    })
  },
}
