'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/ChapterEditor.module.css';

interface SourceLink {
  label: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  featuredImage: string;
  ogImage: string;
  authorName: string;
  tags: string[];
  publishedAt?: string;
  isPublished: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  sourceLinks?: SourceLink[];
  faq?: FAQItem[];
  relatedPosts?: string[];
  contentType: string;
  readingTime: number;
  updatedAt?: string;
}

const contentTypes = [
  { value: 'vacancy', label: 'Vacancy' },
  { value: 'result', label: 'Result' },
  { value: 'admit-card', label: 'Admit Card' },
  { value: 'answer-key', label: 'Answer Key' },
  { value: 'exam-date', label: 'Exam Date' },
  { value: 'article', label: 'Article' },
  { value: 'update', label: 'Update' },
];

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const defaultForm = {
  title: '',
  slug: '',
  excerpt: '',
  contentHtml: '',
  featuredImage: '',
  ogImage: '',
  authorName: '',
  tags: '',
  publishedAt: '',
  isPublished: false,
  isFeatured: false,
  seoTitle: '',
  seoDescription: '',
  canonicalUrl: '',
  sourceLinks: [{ label: '', url: '' }],
  faq: [
    {
      question: '',
      answer: '',
    },
  ],

  relatedPosts: '',
  contentType: 'article',
  readingTime: 0,
};

export default function BlogEditorClient() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [filter, setFilter] = useState({ published: 'ALL', query: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 400);

    return () => clearTimeout(timer);
  }, [isLoggedIn, filter]);

  const fetchBlogs = async () => {
    const params = new URLSearchParams();
    if (filter.published !== 'ALL') params.append('published', filter.published.toLowerCase());
    if (filter.query.trim()) params.append('query', filter.query.trim());

    try {
      const res = await fetch(`/api/admin/blogs?${params.toString()}`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        setBlogs(data.blogs || []);
      } else if (res.status === 401) {
        localStorage.removeItem('admin_logged_in');
        router.push('/admin/login');
      } else {
        setMessage(`❌ ${data.error || 'Failed to fetch blogs'}`);
      }
    } catch (error) {
      console.error('Failed to fetch blogs', error);
      setMessage('❌ Failed to fetch blogs');
    }
  };

  const selectBlog = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      contentHtml: blog.contentHtml || '',
      featuredImage: blog.featuredImage || '',
      ogImage: blog.ogImage || '',
      authorName: blog.authorName || '',
      tags: (blog.tags || []).join(', '),
      publishedAt: blog.publishedAt ? blog.publishedAt.slice(0, 10) : '',
      isPublished: !!blog.isPublished,
      isFeatured: !!blog.isFeatured,
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      canonicalUrl: blog.canonicalUrl || '',
      sourceLinks: blog.sourceLinks && blog.sourceLinks.length > 0 ? blog.sourceLinks : [{ label: '', url: '' }],
      faq: blog.faq && blog.faq.length ? blog.faq : [{ question: '', answer: '' }],
      relatedPosts: (blog.relatedPosts || []).join(', '),
      contentType: blog.contentType || 'article',
      readingTime: blog.readingTime || 0,
    });
    setMessage('');
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setForm(defaultForm);
    setMessage('');
  };

  const handleFieldChange = <K extends keyof typeof defaultForm>(
    key: K,
    value: (typeof defaultForm)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    if (!form.title.trim()) {
      setMessage('❌ Title is required');
      setLoading(false);
      return;
    }

    if (!form.slug.trim()) {
      setMessage('❌ Slug is required');
      setLoading(false);
      return;
    }

    if (!form.excerpt.trim()) {
      setMessage('❌ Excerpt is required');
      setLoading(false);
      return;
    }

    if (!form.contentHtml.trim()) {
      setMessage('❌ HTML content is required');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        slug: createSlug(form.slug),
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        sourceLinks: form.sourceLinks.filter((item) => item.label.trim() && item.url.trim()),
        faq: form.faq.filter((item) => item.question.trim() && item.answer.trim()),
        relatedPosts: form.relatedPosts.split(',').map((slug) => slug.trim()).filter(Boolean),
      };


      let res: Response;

      if (selectedBlog) {
        res = await fetch(`/api/admin/blogs/${selectedBlog._id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/blogs', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Saved successfully');
        resetForm();
        fetchBlogs();
      } else {
        setMessage(`❌ ${data.error || 'Save failed'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Save failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog || !confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`/api/admin/blogs/${selectedBlog._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('✅ Deleted successfully');
        resetForm();
        fetchBlogs();
      } else {
        setMessage(`❌ ${data.error || 'Delete failed'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('admin_logged_in');
      router.push('/admin/login');
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Blog Admin Dashboard</h1>
          <p>Manage blog posts, publish updates, and keep your content-first system organized.</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search title..."
              value={filter.query}
              onChange={(e) => setFilter((prev) => ({ ...prev, query: e.target.value }))}
              style={{ padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
            />
            <select
              value={filter.published}
              onChange={(e) => setFilter((prev) => ({ ...prev, published: e.target.value }))}
            >
              <option value="ALL">All Posts</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>
          </div>

          <div className={styles.chapterCount}>
            📝 {blogs.length} blog post{blogs.length !== 1 ? 's' : ''}
          </div>

          <div className={styles.chapterList}>
            {blogs.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No blogs found</p>
                <small>Try a different filter or create a new post.</small>
              </div>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className={`${styles.chapterItem} ${selectedBlog?._id === blog._id ? styles.selected : ''}`}
                  onClick={() => selectBlog(blog)}
                >
                  <div className={styles.chapterInfo}>
                    <strong>{blog.title}</strong>
                    <span>{blog.contentType} • {blog.authorName || 'Author'}</span>
                  </div>
                  <span className={styles.badge}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className={styles.editor}>
          <div className={styles.editorHeader}>
            <h2>{selectedBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
            <p>
              {selectedBlog
                ? 'Update the article or save as draft.'
                : 'Add a new blog post for vacancy, result, admit card, or exam update.'}
            </p>
          </div>

          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;

                  setForm((prev) => {
                    const nextSlug = !selectedBlog ? createSlug(title) : prev.slug;
                    return {
                      ...prev,
                      title,
                      slug: nextSlug,
                      seoTitle: !selectedBlog && !prev.seoTitle ? title : prev.seoTitle,
                      canonicalUrl:
                        !selectedBlog && !prev.canonicalUrl
                          ? `https://www.pathshalanoteshub.in/blogs/${nextSlug}`
                          : prev.canonicalUrl,
                    };
                  });
                }}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => handleFieldChange('slug', createSlug(e.target.value))}
              />
              <small>Unique URL slug used for /blogs/[slug]</small>
            </div>

            <div className={styles.formGroup}>
              <label>Excerpt</label>
              <textarea
                rows={3}
                value={form.excerpt}
                onChange={(e) => {
                  const value = e.target.value;

                  setForm((prev) => ({
                    ...prev,
                    excerpt: value,
                    seoDescription:
                      !selectedBlog && !prev.seoDescription
                        ? value.slice(0, 160)
                        : prev.seoDescription,
                  }));
                }}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Featured Image URL</label>
              <input
                type="url"
                value={form.featuredImage}
                onChange={(e) => handleFieldChange('featuredImage', e.target.value)}
              />
            </div>

            {form.featuredImage ? (
              <div className={styles.thumbnailPreview}>
                <p>Featured image preview</p>
                <img src={form.featuredImage} alt="Featured preview" />
              </div>
            ) : null}

            <div className={styles.formGroup}>
              <label>Open Graph Image URL</label>
              <input
                type="url"
                value={form.ogImage}
                onChange={(e) => handleFieldChange('ogImage', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Author Name</label>
              <input
                type="text"
                value={form.authorName}
                onChange={(e) => handleFieldChange('authorName', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tags (comma separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => handleFieldChange('tags', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Content Type</label>
              <select
                value={form.contentType}
                onChange={(e) => handleFieldChange('contentType', e.target.value)}
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>SEO Title</label>
              <input
                type="text"
                value={form.seoTitle}
                onChange={(e) => handleFieldChange('seoTitle', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>SEO Description</label>
              <textarea
                rows={2}
                value={form.seoDescription}
                onChange={(e) => handleFieldChange('seoDescription', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Canonical URL</label>
              <input
                type="url"
                value={form.canonicalUrl}
                onChange={(e) => handleFieldChange('canonicalUrl', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Publish Date</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => handleFieldChange('publishedAt', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Reading Time (minutes)</label>
              <input
                type="number"
                min={0}
                value={form.readingTime}
                onChange={(e) => handleFieldChange('readingTime', Number(e.target.value))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Status</label>
              <select
                value={String(form.isPublished)}
                onChange={(e) => handleFieldChange('isPublished', e.target.value === 'true')}
              >
                <option value="false">Draft / Unpublished</option>
                <option value="true">Published</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Featured</label>
              <select
                value={String(form.isFeatured)}
                onChange={(e) => handleFieldChange('isFeatured', e.target.value === 'true')}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Source Links</label>
              {form.sourceLinks.map((link, index) => (
                <div key={index} style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => {
                      const next = [...form.sourceLinks];
                      next[index] = { ...next[index], label: e.target.value };
                      handleFieldChange('sourceLinks', next);
                    }}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => {
                      const next = [...form.sourceLinks];
                      next[index] = { ...next[index], url: e.target.value };
                      handleFieldChange('sourceLinks', next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...form.sourceLinks];
                      next.splice(index, 1);
                      handleFieldChange('sourceLinks', next.length ? next : [{ label: '', url: '' }]);
                    }}
                    style={{
                      width: 'fit-content',
                      padding: '0.5rem 0.8rem',
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleFieldChange('sourceLinks', [...form.sourceLinks, { label: '', url: '' }])
                }
                style={{
                  width: 'fit-content',
                  padding: '0.65rem 0.9rem',
                  background: '#2563eb',
                  color: '#fff',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                + Add Link
              </button>
            </div>

            <div className={styles.formGroup}>
              <label>Frequently Asked Questions (FAQ)</label>

              {form.faq.map((faq, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    display: 'grid',
                    gap: '.75rem',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => {
                      const next = [...form.faq];
                      next[index] = {
                        ...next[index],
                        question: e.target.value,
                      };
                      handleFieldChange('faq', next);
                    }}
                  />

                  <textarea
                    rows={3}
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const next = [...form.faq];
                      next[index] = {
                        ...next[index],
                        answer: e.target.value,
                      };
                      handleFieldChange('faq', next);
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      const next = [...form.faq];
                      next.splice(index, 1);

                      handleFieldChange(
                        'faq',
                        next.length
                          ? next
                          : [
                            {
                              question: '',
                              answer: '',
                            },
                          ]
                      );
                    }}
                    style={{
                      width: 'fit-content',
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      padding: '.6rem 1rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  handleFieldChange('faq', [
                    ...form.faq,
                    {
                      question: '',
                      answer: '',
                    },
                  ])
                }
                style={{
                  width: 'fit-content',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  padding: '.65rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                + Add FAQ
              </button>
            </div>
            <div className={styles.formGroup}>
              <label>Related Posts (Slug)</label>

              <input
                type="text"
                placeholder="slug-one, slug-two, slug-three"
                value={form.relatedPosts}
                onChange={(e) =>
                  handleFieldChange('relatedPosts', e.target.value)
                }
              />

              <small>
                Separate multiple blog slugs using commas.
              </small>
            </div>
            <div className={styles.formGroup}>
              <label>HTML Content</label>
              <textarea
                rows={22}
                className={styles.htmlEditor}
                value={form.contentHtml}
                onChange={(e) => handleFieldChange('contentHtml', e.target.value)}
                placeholder="Paste full article HTML here"
              />
            </div>

            <div className={styles.actions}>
              <button onClick={handleSave} disabled={loading} className={styles.saveBtn}>
                {loading ? 'Saving...' : selectedBlog ? 'Update Blog' : 'Create Blog'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={styles.saveBtn}
                style={{ background: '#f59e0b' }}
              >
                New Blog
              </button>
              {selectedBlog && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={styles.saveBtn}
                  style={{ background: '#ef4444' }}
                >
                  Delete
                </button>
              )}
            </div>

            {message && (
              <div className={message.startsWith('✅') ? styles.success : styles.error}>
                {message}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}