import { client, urlFor } from '../../../lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { PortableText } from '@portabletext/react'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { TypedObject } from '@portabletext/types'

interface Post {
  title: string;
  mainImage: SanityImageSource;
  body: TypedObject | TypedObject[];
  publishedAt: string;
  author: { name: string };
}

interface PageProps {
  params: { slug: string };
}

async function BlogPost({ params }: PageProps) {
  const post: Post = await getPost(params.slug)
  
  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-white text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <span className="mr-2">←</span>
          Home
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="max-w-3xl mx-auto p-8">
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="text-gray-500">
                By {post.author?.name} · {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
              </div>
            </header>

            {post.mainImage && (
              <div className="mb-8 relative rounded-2xl overflow-hidden">
                <Image
                  src={urlFor(post.mainImage).url()}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="w-full"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-900">  {/* 添加这个包装 div */}
                <PortableText value={post.body} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

async function getPost(slug: string) {
  const post = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      mainImage,
      body,
      publishedAt,
      author->,
      categories[]->
    }
  `, { slug })
  return post
}

export default BlogPost