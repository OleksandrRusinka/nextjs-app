import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { Post } from '@/entities/models'
import { PostDetailModule } from '@/modules/post-detail'

export const revalidate = 30

export async function generateStaticParams() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')

    if (!response.ok) {
      return []
    }

    const posts = await response.json()

    return posts.slice(0, 20).map((post: Post) => ({
      slug: String(post.id),
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

// interface
interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  const numericSlug = Number(slug)
  if (isNaN(numericSlug) || numericSlug === 0) {
    notFound()
  }

  return <PostDetailModule postId={slug} />
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params

  const numericSlug = Number(slug)
  if (isNaN(numericSlug) || numericSlug === 0) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${slug}`)

    if (!response.ok) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.',
      }
    }

    const post: Post = await response.json()

    return {
      title: `${post.title} | Blog`,
      description: post.body.substring(0, 160) + '...',
    }
  } catch (error) {
    return {
      title: 'Post | Blog',
      description: 'Blog post',
    }
  }
}
