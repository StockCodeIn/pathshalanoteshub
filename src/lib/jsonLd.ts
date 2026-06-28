const SITE_URL = 'https://www.pathshalanoteshub.in';
const SITE_NAME = 'Pathshala Notes Hub';
const DEFAULT_AUTHOR = 'Pathshala Notes Hub';
const DEFAULT_LOGO = `${SITE_URL}/og-image.png`;

export function buildArticleJsonLd(params: {
  title: string;
  description: string;
  url: string;
  authorName?: string;
  publishDate: string;
  modifiedDate: string;
  featuredImage?: string;
  tags?: string[];
}) {
  const {
    title,
    description,
    url,
    authorName,
    publishDate,
    modifiedDate,
    featuredImage,
    tags = [],
  } = params;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    image: featuredImage ? [featuredImage] : undefined,
    author: {
      '@type': 'Person',
      name: authorName?.trim() || DEFAULT_AUTHOR,
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_LOGO,
      },
    },
    keywords: tags.length ? tags.join(', ') : undefined,
  };
}