import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models/blog';
import { sanitizeHtml, stripHtml } from '@/lib/html';
import { addHeadingIds } from '@/lib/addHeadingIds';
import TableOfContents from '@/components/TableOfContents';
import { extractHeadings } from '@/lib/extractHeadings';
import { injectInternalLinks } from '@/lib/injectInternalLinks';
import Breadcrumbs from '@/components/Breadcrumbs';
import { buildBreadcrumbJsonLd } from '@/lib/breadcrumbSchema';
import { buildFaqJsonLd } from '@/lib/faqSchema';
import styles from "@/styles/Blog.module.css";

const contentTypeLabels: Record<string, string> = {
  vacancy: 'Vacancy',
  result: 'Result',
  'admit-card': 'Admit Card',
  'answer-key': 'Answer Key',
  'exam-date': 'Exam Date',
  article: 'Article',
  update: 'Update',
};

type SourceLink = {
  url: string;
  label?: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type BlogDoc = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  contentHtml?: string;
  featuredImage?: string;
  ogImage?: string;
  authorName?: string;
  tags?: string[];
  publishedAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  sourceLinks?: SourceLink[];
  faq?: FAQItem[];
  relatedPosts?: string[];
  contentType?: string;
  readingTime?: number;
  isPublished: boolean;
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

function normalizeSourceLinks(value: unknown): SourceLink[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const links = value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const record = item as Record<string, unknown>;
      const url = typeof record.url === 'string' ? record.url.trim() : '';
      const label = typeof record.label === 'string' ? record.label.trim() : undefined;

      if (!url) return null;

      return { url, ...(label ? { label } : {}) };
    })
    .filter((item): item is SourceLink => item !== null);

  return links.length ? links : undefined;
}

function normalizeBlogDoc(doc: Record<string, unknown> | null | undefined): BlogDoc | null {
  if (!doc) return null;

  const slug = typeof doc.slug === 'string' ? doc.slug.trim() : '';
  const title = typeof doc.title === 'string' ? doc.title.trim() : '';
  const isPublished = typeof doc.isPublished === 'boolean' ? doc.isPublished : false;

  if (!slug || !title) return null;

  return {
    _id: String(doc._id),
    slug,
    title,
    isPublished,
    excerpt: typeof doc.excerpt === 'string' ? doc.excerpt : undefined,
    contentHtml: typeof doc.contentHtml === 'string' ? doc.contentHtml : undefined,
    featuredImage: typeof doc.featuredImage === 'string' ? doc.featuredImage : undefined,
    ogImage: typeof doc.ogImage === 'string' ? doc.ogImage : undefined,
    authorName: typeof doc.authorName === 'string' ? doc.authorName : undefined,
    tags: Array.isArray(doc.tags)
      ? doc.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
      : undefined,
    publishedAt:
      typeof doc.publishedAt === 'string' || doc.publishedAt instanceof Date
        ? doc.publishedAt
        : undefined,
    createdAt:
      typeof doc.createdAt === 'string' || doc.createdAt instanceof Date
        ? doc.createdAt
        : undefined,
    updatedAt:
      typeof doc.updatedAt === 'string' || doc.updatedAt instanceof Date
        ? doc.updatedAt
        : undefined,
    seoTitle: typeof doc.seoTitle === 'string' ? doc.seoTitle : undefined,
    seoDescription: typeof doc.seoDescription === 'string' ? doc.seoDescription : undefined,
    canonicalUrl: typeof doc.canonicalUrl === 'string' ? doc.canonicalUrl : undefined,
    sourceLinks: normalizeSourceLinks(doc.sourceLinks),
    faq: Array.isArray(doc.faq) ? doc.faq
      .map((item) => ({
        question: String((item as any)?.question || '').trim(),
        answer: String((item as any)?.answer || '').trim(),
      }))
      .filter((item) => item.question.length > 0 && item.answer.length > 0) : [],

    relatedPosts: Array.isArray(doc.relatedPosts) ? doc.relatedPosts.filter((item): item is string => typeof item === 'string') : [],
    contentType: typeof doc.contentType === 'string' ? doc.contentType : undefined,
    readingTime: typeof doc.readingTime === 'number' ? doc.readingTime : undefined,
  };
}

const blogFields =
  '_id title slug excerpt contentHtml featuredImage ogImage authorName tags publishedAt createdAt updatedAt seoTitle seoDescription canonicalUrl sourceLinks faq relatedPosts contentType readingTime isPublished';

const getPublishedPostBySlug = cache(async (slug: string): Promise<BlogDoc | null> => {
  await connectDB();

  const rawPost = await Blog.findOne({ slug, isPublished: true })
    .select(blogFields)
    .lean();

  return normalizeBlogDoc(rawPost as Record<string, unknown> | null);
});

function getCanonical(post: BlogDoc) {
  return post.canonicalUrl?.trim() || `https://www.pathshalanoteshub.in/blogs/${post.slug}`;
}

function getDescription(post: BlogDoc) {
  return (
    post.seoDescription?.trim() ||
    post.excerpt?.trim() ||
    stripHtml(post.contentHtml || '').slice(0, 160).trim() ||
    'Pathshala Notes Hub blog post.'
  );
}

function getPrimaryImage(post: BlogDoc) {
  return post.ogImage?.trim() || post.featuredImage?.trim() || '';
}

function toIsoDate(value?: string | Date) {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function formatDisplayDate(value?: string | Date) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getContentTypeLabel(type?: string) {
  return contentTypeLabels[type || 'article'] || 'Article';
}

function buildBlogPostingJsonLd(post: BlogDoc) {
  const canonical = getCanonical(post);
  const description = getDescription(post);
  const image = getPrimaryImage(post);
  const publishDate = toIsoDate(post.publishedAt || post.createdAt);
  const modifiedDate = toIsoDate(post.updatedAt || post.publishedAt || post.createdAt);
  const articleBody = stripHtml(post.contentHtml || '').slice(0, 5000);
  const section = getContentTypeLabel(post.contentType);
  const authorName = post.authorName?.trim() || 'Pathshala Notes Hub';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    headline: post.title,
    description,
    ...(image ? { image: [image] } : {}),
    ...(publishDate ? { datePublished: publishDate } : {}),
    ...(modifiedDate ? { dateModified: modifiedDate } : {}),
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pathshala Notes Hub',
      url: 'https://www.pathshalanoteshub.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.pathshalanoteshub.in/favicon.ico',
      },
    },
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
    articleSection: section,
    ...(articleBody ? { articleBody } : {}),
  };
}

async function getRelatedPosts(post: BlogDoc): Promise<BlogDoc[]> {
  await connectDB();

  const baseFilter = {
    isPublished: true,
    _id: { $ne: post._id },
  };

  const related: BlogDoc[] = [];
  const addedIds = new Set<string>();

  const addPosts = (
    docs: Record<string, unknown>[],
    limit: number = 3
  ) => {
    for (const doc of docs) {
      const normalized = normalizeBlogDoc(doc);

      if (!normalized) continue;

      if (addedIds.has(normalized._id)) continue;

      addedIds.add(normalized._id);
      related.push(normalized);

      if (related.length >= limit) break;
    }
  };

  // =====================================================
  // 1. Manual Related Posts (Highest Priority)
  // =====================================================

  if (post.relatedPosts?.length) {
    const rawManualPosts = await Blog.find({
      ...baseFilter,
      slug: { $in: post.relatedPosts },
    })
      .select(blogFields)
      .lean();

    const orderedManualPosts = post.relatedPosts
      .map((slug) =>
        rawManualPosts.find(
          (doc: any) => doc.slug === slug
        )
      )
      .filter(Boolean) as Record<string, unknown>[];

    addPosts(orderedManualPosts);
  }

  // =====================================================
  // 2. Same Tags
  // =====================================================

  if (
    related.length < 3 &&
    post.tags?.length
  ) {
    const rawTagPosts = await Blog.find({
      ...baseFilter,
      tags: { $in: post.tags },
    })
      .select(blogFields)
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .limit(10)
      .lean();

    addPosts(rawTagPosts as Record<string, unknown>[]);
  }

  // =====================================================
  // 3. Same Content Type
  // =====================================================

  if (
    related.length < 3 &&
    post.contentType
  ) {
    const rawTypePosts = await Blog.find({
      ...baseFilter,
      contentType: post.contentType,
    })
      .select(blogFields)
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .limit(10)
      .lean();

    addPosts(rawTypePosts as Record<string, unknown>[]);
  }

  // =====================================================
  // 4. Latest Blogs (Fallback)
  // =====================================================

  if (related.length < 3) {
    const rawLatestPosts = await Blog.find(baseFilter)
      .select(blogFields)
      .sort({
        publishedAt: -1,
        createdAt: -1,
      })
      .limit(10)
      .lean();

    addPosts(rawLatestPosts as Record<string, unknown>[]);
  }

  return related.slice(0, 3);
}

async function getPreviousNextPosts(post: BlogDoc) {
  await connectDB();

  const [previous, next] = await Promise.all([
    Blog.findOne({
      isPublished: true,
      publishedAt: { $lt: post.publishedAt ?? post.createdAt },
    })
      .select(blogFields)
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean(),

    Blog.findOne({
      isPublished: true,
      publishedAt: { $gt: post.publishedAt ?? post.createdAt },
    })
      .select(blogFields)
      .sort({ publishedAt: 1, createdAt: 1 })
      .lean(),
  ]);

  return {
    previous: normalizeBlogDoc(previous as Record<string, unknown>),
    next: normalizeBlogDoc(next as Record<string, unknown>),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Pathshala Notes Hub',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = getCanonical(post);
  const description = getDescription(post);
  const image = getPrimaryImage(post);
  const title = post.seoTitle?.trim() || post.title;
  const publishedTime = toIsoDate(post.publishedAt || post.createdAt);
  const modifiedTime = toIsoDate(post.updatedAt || post.publishedAt || post.createdAt);
  const authorName = post.authorName?.trim() || 'Pathshala Notes Hub';
  const section = getContentTypeLabel(post.contentType);

  return {
    title,
    description,
    alternates: {
      canonical,
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
      title,
      description,
      url: canonical,
      siteName: 'Pathshala Notes Hub',
      type: 'article',
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      authors: [authorName],
      section,
      ...(post.tags?.length ? { tags: post.tags } : {}),
      images: image ? [{ url: image, alt: post.title }] : [],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const safeHtml = injectInternalLinks(addHeadingIds(sanitizeHtml(post.contentHtml || '')));
  const headings = extractHeadings(safeHtml);
  const jsonLd = buildBlogPostingJsonLd(post);
  const faqJsonLd = buildFaqJsonLd(post.faq || []);
  const relatedPosts = await getRelatedPosts(post);
  const { previous, next } = await getPreviousNextPosts(post);

  const publishedLabel = formatDisplayDate(post.publishedAt || post.createdAt || new Date());
  const updatedLabel = formatDisplayDate(post.updatedAt);
  const authorName = post.authorName?.trim() || 'Pathshala Notes Hub';
  const contentTypeLabel = getContentTypeLabel(post.contentType);
  const breadcrumbItems = [
    {
      href: '/',
      label: 'Home',
    },
    {
      href: '/blogs',
      label: 'Blogs',
    },
    {
      href: `/blogs/${post.slug}`,
      label: post.title,
    },
  ];

  const breadcrumbJsonLd =
    buildBreadcrumbJsonLd(breadcrumbItems);

 return (
  <main>

    {/* ================= HERO ================= */}

    <section className={styles.articleHero}>
      <div className={styles.articleHeroContent}>

        <span className={styles.articleCategory}>
          {contentTypeLabel}
        </span>

        <h1>{post.title}</h1>

        <p>
          {post.excerpt || getDescription(post)}
        </p>

        <div className={styles.articleMeta}>

          <span>
            By {authorName}
          </span>

          {publishedLabel && (
            <span>
              Published {publishedLabel}
            </span>
          )}

          {updatedLabel && (
            <span>
              Updated {updatedLabel}
            </span>
          )}

          {post.readingTime && post.readingTime > 0 && (
            <span>
              {post.readingTime} min read
            </span>
          )}

        </div>

      </div>
    </section>

    {/* ================= FEATURED IMAGE ================= */}

    {post.featuredImage && (

      <section className={styles.articleImageSection}>

        <Image
          src={post.featuredImage}
          alt={post.title}
          width={1200}
          height={630}
          priority
          sizes="(max-width:768px)100vw,1100px"
          className={styles.articleFeaturedImage}
        />

      </section>

    )}

    {/* ================= CONTENT ================= */}

    <section className={styles.articleContainer}>

      <Breadcrumbs items={breadcrumbItems} />

      <TableOfContents headings={headings} />

      <article className={styles.articleContent}>
        <div
          className={styles.articleHtml}
          dangerouslySetInnerHTML={{
            __html: safeHtml,
          }}
        />
      </article>

      {/* ================= SOURCES ================= */}

      {post.sourceLinks?.length ? (

        <aside className={styles.articleSources}>

          <h2>Source Links</h2>

          <ul>

            {post.sourceLinks.map((source, index) => (

              <li key={`${source.url}-${index}`}>

                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.label || source.url}
                </a>

              </li>

            ))}

          </ul>

        </aside>

      ) : null}

      {/* ================= FAQ ================= */}

      {post.faq?.length ? (

        <section className={styles.articleFaq}>

          <h2>
            Frequently Asked Questions
          </h2>

          {post.faq.map((item, index) => (

            <details
              key={index}
              className={styles.articleFaqItem}
            >

              <summary>
                {item.question}
              </summary>

              <p>
                {item.answer}
              </p>

            </details>

          ))}

        </section>

      ) : null}

    </section>

    {/* ================= PREVIOUS / NEXT ================= */}

    {(previous || next) && (

      <section className={styles.articleNavigation}>

        {previous ? (

          <Link
            href={`/blogs/${previous.slug}`}
            className={styles.articleNavCard}
          >

            <small>
              ← Previous Article
            </small>

            <h3>
              {previous.title}
            </h3>

          </Link>

        ) : (
          <div />
        )}

        {next ? (

          <Link
            href={`/blogs/${next.slug}`}
            className={styles.articleNavCard}
          >

            <small>
              Next Article →
            </small>

            <h3>
              {next.title}
            </h3>

          </Link>

        ) : (
          <div />
        )}

      </section>

    )}

    {/* ================= RELATED ================= */}

    {relatedPosts.length > 0 && (

      <section className={styles.relatedArticles}>

        <h2>
          Related Updates
        </h2>

        <div className={styles.relatedGrid}>

          {relatedPosts.map((item) => (

            <Link
              key={item._id}
              href={`/blogs/${item.slug}`}
              className={styles.relatedCard}
            >

              <h3>
                {item.title}
              </h3>

              <p>
                {item.excerpt || getDescription(item)}
              </p>

            </Link>

          ))}

        </div>

      </section>

    )}

    {/* ================= JSON LD ================= */}

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbJsonLd),
      }}
    />

    {faqJsonLd && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    )}

  </main>
);
}