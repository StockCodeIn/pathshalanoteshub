//sec/app/blogs/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models/blog';
import styles from "@/styles/Blog.module.css";
import Image from "next/image";

const contentTypeLabels: Record<string, string> = {
  vacancy: 'Vacancy',
  result: 'Result',
  'admit-card': 'Admit Card',
  'answer-key': 'Answer Key',
  'exam-date': 'Exam Date',
  article: 'Article',
  update: 'Update',
};

type BlogItem = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  authorName?: string;
  contentType?: string;
  publishedAt?: string | Date;
  createdAt?: string | Date;
};

const canonicalUrl = 'https://www.pathshalanoteshub.in/blogs';
const pageTitle = 'Blogs | Pathshala Notes Hub';
const pageDescription =
  'Latest education updates, exam notifications, vacancy news and study articles from Pathshala Notes Hub.';

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    siteName: 'Pathshala Notes Hub',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: pageDescription,
  },
};

function formatDate(value?: string | Date) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getExcerpt(post: BlogItem) {
  return post.excerpt?.trim() || 'Read the full update on Pathshala Notes Hub.';
}

function getContentTypeLabel(contentType?: string) {
  return contentTypeLabels[contentType || 'article'] || 'Article';
}

function normalizeBlogItem(doc: Record<string, unknown>): BlogItem | null {
  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : '';
  const title = typeof doc.title === 'string' ? doc.title.trim() : '';

  if (!slug || !title) return null;

  return {
    _id: String(doc._id),
    slug,
    title,
    excerpt: typeof doc.excerpt === 'string' ? doc.excerpt : undefined,
    featuredImage: typeof doc.featuredImage === 'string' ? doc.featuredImage : undefined,
    authorName: typeof doc.authorName === 'string' ? doc.authorName : undefined,
    contentType: typeof doc.contentType === 'string' ? doc.contentType : undefined,
    publishedAt:
      typeof doc.publishedAt === 'string' || doc.publishedAt instanceof Date
        ? doc.publishedAt
        : undefined,
    createdAt:
      typeof doc.createdAt === 'string' || doc.createdAt instanceof Date
        ? doc.createdAt
        : undefined,
  };
}

async function getVisibleBlogs() {
  await connectDB();

  const blogFields =
    '_id slug title excerpt featuredImage authorName contentType publishedAt createdAt';

  const rawFeatured = await Blog.find({ isPublished: true, isFeatured: true })
    .select(blogFields)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .lean();

  const featuredPosts = rawFeatured
    .map((doc) => normalizeBlogItem(doc as Record<string, unknown>))
    .filter((post): post is BlogItem => post !== null);

  const featuredIds = featuredPosts.map((post) => post._id);

  const rawLatest = await Blog.find({
    isPublished: true,
    ...(featuredIds.length ? { _id: { $nin: featuredIds } } : {}),
  })
    .select(blogFields)
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(20)
    .lean();

  const latestPosts = rawLatest
    .map((doc) => normalizeBlogItem(doc as Record<string, unknown>))
    .filter((post): post is BlogItem => post !== null);

  return {
    featuredPosts,
    latestPosts,
    allVisiblePosts: [...featuredPosts, ...latestPosts],
  };
}

function buildCollectionJsonLd(posts: BlogItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.slice(0, 10).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${canonicalUrl}/${post.slug}`,
        name: post.title,
      })),
    },
  };
}

export default async function BlogsPage() {
  const { featuredPosts, latestPosts, allVisiblePosts } = await getVisibleBlogs();
  const jsonLd = buildCollectionJsonLd(allVisiblePosts);

 return (
  <main>

    {/* ================= HERO ================= */}

    <section className={styles.blogHero}>
      <div className={styles.blogHeroContent}>
        <h1>Education & Exam Updates</h1>

        <p>
          Read the latest education news, government vacancies,
          admit cards, answer keys, board exam updates and detailed
          study articles published by Pathshala Notes Hub.
        </p>
      </div>
    </section>

    {/* ================= FEATURED ================= */}

    {featuredPosts.length > 0 && (
      <section className={styles.blogSection}>

        <h2 className={styles.blogSectionTitle}>
          Featured Updates
        </h2>

        <div className={styles.blogGrid}>

          {featuredPosts.map((post) => (

            <Link
              key={post._id}
              href={`/blogs/${post.slug}`}
              className={styles.blogCard}
            >

              {post.featuredImage && (

                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={600}
                  height={340}
                  className={styles.blogCardImage}
                />

              )}

              <div className={styles.blogCardBody}>

                <span className={styles.blogCategory}>
                  {getContentTypeLabel(post.contentType)}
                </span>

                <h3>{post.title}</h3>

                <p>{getExcerpt(post)}</p>

              </div>

              <div className={styles.blogCardFooter}>

                <span>
                  {post.authorName?.trim() || "Pathshala Notes Hub"}
                </span>

                <span>
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>

              </div>

            </Link>

          ))}

        </div>

      </section>
    )}

    {/* ================= LATEST ================= */}

    <section className={styles.blogSection}>

      <h2 className={styles.blogSectionTitle}>
        Latest Blog Posts
      </h2>

      {latestPosts.length > 0 ? (

        <div className={styles.blogGrid}>

          {latestPosts.map((post) => (

            <Link
              key={post._id}
              href={`/blogs/${post.slug}`}
              className={styles.blogCard}
            >

              {post.featuredImage && (

                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={600}
                  height={340}
                  className={styles.blogCardImage}
                />

              )}

              <div className={styles.blogCardBody}>

                <span className={styles.blogCategory}>
                  {getContentTypeLabel(post.contentType)}
                </span>

                <h3>{post.title}</h3>

                <p>{getExcerpt(post)}</p>

              </div>

              <div className={styles.blogCardFooter}>

                <span>
                  {post.authorName?.trim() || "Pathshala Notes Hub"}
                </span>

                <span>
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>

              </div>

            </Link>

          ))}

        </div>

      ) : allVisiblePosts.length > 0 ? (

        <div className={styles.blogInfoBox}>

          <p>
            No additional latest blog posts are available right now.
          </p>

        </div>

      ) : (

        <div className={styles.blogInfoBox}>

          <p>
            No blog posts have been published yet.
          </p>

        </div>

      )}

    </section>

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />

  </main>
);
}