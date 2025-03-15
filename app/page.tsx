import Image from 'next/image'
import { client, urlFor } from '../lib/sanity'
import Link from 'next/link'
import { format } from 'date-fns'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

async function getPosts() {
  const posts = await client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      author->,
      categories[]->
    }
  `)
  return posts
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="mb-8">
              <Image
                src="/IMG_4199.JPG"
                alt="Bingjia Yang"
                width={120}
                height={120}
                className="rounded-full mx-auto shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Developer Designer Dreamer Doer
            </h1>
            <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto mb-8">
              This is Bingjia Yang. I am currently studying at the University of New South Wales, 
              pursuing a Master&apos;s degree in Information Technology and seeking a job in full-stack development. 
              Passionate about developing useful applications.
            </p>
            <Link 
              href="https://github.com/YBJ0000"
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              target="_blank"
            >
              GitHub <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12 text-center">
            Recent Posts
          </h2>
          <div className="space-y-12">
            {posts.map((post: Post) => (
              <article key={post._id} className="group">
                <Link href={`/blog/${post.slug.current}`}>
                  <div className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
                    {post.mainImage && (
                      <div className="relative h-96">
                        <Image
                          src={urlFor(post.mainImage).url()}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-gray-600">
                        {post.title}
                      </h3>
                      <div className="mt-4 flex items-center gap-x-4 text-sm text-gray-500">
                        <time dateTime={post.publishedAt}>
                          {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
                        </time>
                        <span>·</span>
                        <span>By {post.author?.name}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: SanityImageSource;
  publishedAt: string;
  author: { name: string };
}
