import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models/blog';
import { verifyAdminToken } from '@/lib/adminAuth';
import { calculateReadingTime, sanitizeHtml } from '@/lib/html';

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const cleanText = (value: unknown) => `${value ?? ''}`.trim();

const cleanUrl = (value: unknown) => {
  const url = cleanText(value);
  if (!url) return '';
  return url;
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blog id' },
        { status: 400 }
      );
    }

    const payload = await authorize(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();
    console.log('PATCH BODY:', body);
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    const allowed = [
      'title',
      'slug',
      'excerpt',
      'contentHtml',
      'featuredImage',
      'ogImage',
      'authorName',
      'tags',
      'publishedAt',
      'isPublished',
      'isFeatured',
      'seoTitle',
      'seoDescription',
      'canonicalUrl',
      'sourceLinks',
      'faq',
      'relatedPosts',
      'contentType',
      'readingTime',
    ];

    const update: Record<string, any> = {};

    for (const key of allowed) {
      if (body[key] !== undefined) {
        update[key] = body[key];
      }
    }

    if (update.title !== undefined) {
      update.title = cleanText(update.title);
      if (!update.title) {
        return NextResponse.json(
          { success: false, error: 'Title is required' },
          { status: 400 }
        );
      }
    }

    if (update.excerpt !== undefined) {
      update.excerpt = cleanText(update.excerpt);
    }

    if (update.slug !== undefined) {
      update.slug = normalizeSlug(update.slug);
      if (!update.slug) {
        return NextResponse.json(
          { success: false, error: 'Slug is required' },
          { status: 400 }
        );
      }

      const existingSlug = await Blog.findOne({
        slug: update.slug,
        _id: { $ne: id },
      }).lean();

      if (existingSlug) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    if (update.contentHtml !== undefined) {
      update.contentHtml = sanitizeHtml(String(update.contentHtml || ''));
      if (!update.contentHtml.trim()) {
        return NextResponse.json(
          { success: false, error: 'Content is required' },
          { status: 400 }
        );
      }

      if (!body.readingTime || Number(body.readingTime) <= 0) {
        update.readingTime = calculateReadingTime(update.contentHtml);
      }
    }

    if (update.featuredImage !== undefined) {
      update.featuredImage = cleanUrl(update.featuredImage);
    }

    if (update.ogImage !== undefined) {
      update.ogImage = cleanUrl(update.ogImage);
    }

    if (update.authorName !== undefined) {
      update.authorName = cleanText(update.authorName);
    }

    if (update.seoTitle !== undefined) {
      update.seoTitle = cleanText(update.seoTitle);
    }

    if (update.seoDescription !== undefined) {
      update.seoDescription = cleanText(update.seoDescription);
    }

    if (update.canonicalUrl !== undefined) {
      update.canonicalUrl = cleanUrl(update.canonicalUrl);
    }

    if (update.tags !== undefined) {
      if (Array.isArray(update.tags)) {
        update.tags = update.tags
          .map((tag: unknown) => cleanText(tag))
          .filter(Boolean);
      } else {
        update.tags = String(update.tags)
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    }

    if (update.sourceLinks !== undefined) {
      if (!Array.isArray(update.sourceLinks)) {
        update.sourceLinks = [];
      } else {
        update.sourceLinks = update.sourceLinks
          .map((item: any) => ({
            label: cleanText(item?.label),
            url: cleanUrl(item?.url),
          }))
          .filter((item: { label: string; url: string }) => item.label && item.url);
      }
    }

    if (update.faq !== undefined) {
      update.faq = normalizeFaq(update.faq);
    }

    if (update.relatedPosts !== undefined) {
      update.relatedPosts = Array.isArray(update.relatedPosts) ? update.relatedPosts.map((slug: unknown) => cleanText(slug)).filter(Boolean) : [];
    }

    if (update.readingTime !== undefined) {
      update.readingTime = Math.max(1, Number(update.readingTime) || 1);
    }

    if (update.isPublished !== undefined) {
      update.isPublished = Boolean(update.isPublished);
    }

    if (update.isFeatured !== undefined) {
      update.isFeatured = Boolean(update.isFeatured);
    }

    if (update.publishedAt !== undefined) {
      if (!update.publishedAt) {
        update.publishedAt = null;
      } else if (!isValidDate(update.publishedAt)) {
        return NextResponse.json(
          { success: false, error: 'Invalid published date' },
          { status: 400 }
        );
      } else {
        update.publishedAt = new Date(update.publishedAt);
      }
    }

    Object.assign(blog, update);
    await blog.save();
  

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('PATCH /api/admin/blogs/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid blog id' },
        { status: 400 }
      );
    }

    const payload = await authorize(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/blogs/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}