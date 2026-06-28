import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models/blog';
import { verifyAdminToken } from '@/lib/adminAuth';
import { calculateReadingTime, sanitizeHtml, stripHtml } from '@/lib/html';

const createSlug = (title: string) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const cleanText = (value: unknown) => `${value ?? ''}`.trim();

const cleanUrl = (value: unknown) => {
  const url = cleanText(value);
  return url || '';
};

const normalizeFaq = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item: any) => ({
      question: cleanText(item?.question),
      answer: cleanText(item?.answer),
    }))
    .filter(
      (item) =>
        item.question.length > 0 &&
        item.answer.length > 0
    );
};

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isValidDate = (value: unknown) => {
  if (!value) return false;
  const d = new Date(String(value));
  return !Number.isNaN(d.getTime());
};

async function authorize(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const payload = await verifyAdminToken(token, process.env.GK_ADMIN_KEY || '');
  return payload;
}

export async function GET(request: NextRequest) {
  try {
    const payload = await authorize(request);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const published = searchParams.get('published');
    const query = cleanText(searchParams.get('query'));

    const filter: Record<string, any> = {};

    if (published === 'true') filter.isPublished = true;
    if (published === 'false') filter.isPublished = false;

    if (query) {
      filter.title = { $regex: escapeRegex(query), $options: 'i' };
    }

    const blogs = await Blog.find(filter)
      .sort({ updatedAt: -1, publishedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('GET /api/admin/blogs error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await authorize(request);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const title = cleanText(body.title);
    const rawSlug = cleanText(body.slug);
    const excerpt = cleanText(body.excerpt);
    const rawHtml = String(body.contentHtml || '');
    const contentHtml = sanitizeHtml(rawHtml);
    const plainTextContent = stripHtml(contentHtml);

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!contentHtml.trim() || !plainTextContent.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const normalizedSlug = rawSlug ? createSlug(rawSlug) : createSlug(title);

    if (!normalizedSlug) {
      return NextResponse.json(
        { success: false, error: 'Valid slug is required' },
        { status: 400 }
      );
    }

    let finalSlug = normalizedSlug;

    const existing = await Blog.findOne({ slug: finalSlug }).lean();
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-5)}`;
    }

    const cleanExcerpt = excerpt || plainTextContent.slice(0, 180).trim();

    if (!cleanExcerpt) {
      return NextResponse.json(
        { success: false, error: 'Excerpt is required' },
        { status: 400 }
      );
    }

    const isPublished = Boolean(body.isPublished);

    let publishDate: Date | undefined = undefined;
    if (isPublished) {
      if (body.publishedAt) {
        if (!isValidDate(body.publishedAt)) {
          return NextResponse.json(
            { success: false, error: 'Invalid publish date' },
            { status: 400 }
          );
        }
        publishDate = new Date(body.publishedAt);
      } else {
        publishDate = new Date();
      }
    }

    const tags = Array.isArray(body.tags)
      ? body.tags.map((tag: unknown) => cleanText(tag)).filter(Boolean)
      : cleanText(body.tags)
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);

    const sourceLinks = Array.isArray(body.sourceLinks)
      ? body.sourceLinks
          .map((item: any) => ({
            label: cleanText(item?.label),
            url: cleanUrl(item?.url),
          }))
          .filter((item: { label: string; url: string }) => item.label && item.url)
      : [];

      const faq = normalizeFaq(body.faq);

    const readingTime =
      Number(body.readingTime) > 0
        ? Math.max(1, Number(body.readingTime))
        : calculateReadingTime(contentHtml);

    const blog = new Blog({
      title,
      slug: finalSlug,
      excerpt: cleanExcerpt,
      contentHtml,
      featuredImage: cleanUrl(body.featuredImage),
      ogImage: cleanUrl(body.ogImage),
      authorName: cleanText(body.authorName) || 'Pathshala Notes Hub',
      tags,
      publishedAt: publishDate,
      isPublished,
      isFeatured: Boolean(body.isFeatured),
      seoTitle: cleanText(body.seoTitle) || title,
      seoDescription: cleanText(body.seoDescription) || cleanExcerpt.slice(0, 160),
      canonicalUrl: cleanUrl(body.canonicalUrl),
      sourceLinks,
      faq,
      relatedPosts: Array.isArray(body.relatedPosts)
      ? body.relatedPosts
      .map((slug: unknown) => cleanText(slug))
      .filter(Boolean)
      : [],
      contentType: cleanText(body.contentType) || 'article',
      readingTime,
    });

    await blog.save();

    return NextResponse.json({ success: true, blog }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/blogs error:', error);

    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists. Please try a different slug.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}