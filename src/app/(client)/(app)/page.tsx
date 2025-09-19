import { postsApi } from '@/entities/api/posts'
import type { Post } from '@/entities/models'
import { HomeModule } from '@/modules/home'

export default async function HomePage() {
  let initialPosts: Post[] = []

  try {
    initialPosts = await postsApi.fetchPosts()
  } catch (error) {
    console.error('Failed to fetch initial posts:', error)
  }

  return <HomeModule initialData={initialPosts} />
}
