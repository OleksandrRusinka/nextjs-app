import { HomeModule } from '@/modules/home'

export const revalidate = 30

export default async function HomePage() {
  let initialPosts = []

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      next: { revalidate: 30 },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch posts')
    }

    const posts = await response.json()
    initialPosts = posts
  } catch (error) {
    console.error('Failed to fetch initial posts:', error)
  }

  return <HomeModule initialData={initialPosts} />
}
