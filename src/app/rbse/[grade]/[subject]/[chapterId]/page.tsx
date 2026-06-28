//sec/app/rbse/[grade]/[subject]/[chapterId]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import Image from "next/image";
import { getChapterInfo } from "@/lib/chapterMetadata";
import ChapterNavigation from "@/components/ChapterNavigation";
import connectDB from "@/lib/mongodb";
import { Chapter } from "@/models/chapter";
import Breadcrumbs from "@/components/Breadcrumbs";

import styles from "@/styles/Home.module.css";

import CloudinaryPDFViewer from "@/components/CloudinaryPDFViewer";
import AdsenseAd from "@/components/AdsenseAd";

interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
    chapterId: string;
  }>;
}

/* =========================
   ✅ SEO Metadata
========================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { grade, subject, chapterId } = await params;
  const chapterInfo = getChapterInfo(
  grade,
  subject,
  chapterId
);

const chapterTitle =
  chapterInfo?.chapterTitle ?? `Chapter ${chapterId}`;

const subjectName =
  chapterInfo?.subjectName ?? subject;

  return {
    title: `${chapterTitle} Notes PDF | RBSE Class ${grade} ${subjectName} | Pathshala Notes Hub`,

    description: `Download free RBSE Class ${grade} ${subjectName} "${chapterTitle}" notes PDF, chapter-wise study material, important concepts and exam preparation resources.`,

    keywords: [
      `${chapterTitle} Notes`,
      `${chapterTitle} PDF`,
      `RBSE Class ${grade} ${subjectName}`,
      `${subjectName} Chapter ${chapterId}`,
      "RBSE Notes",
      "NCERT Notes",
      "RBSE study material",
      "Rajasthan Board Notes",
    ],

    alternates: {
      canonical: `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}/${chapterId}`,
    },

    openGraph: {
      title: `${chapterTitle} Notes PDF`,
      description: `Free notes for ${chapterTitle}.`,
      url: `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}/${chapterId}`,
      siteName: "Pathshala Notes Hub",
      type: "article",

      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "RBSE Notes",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${chapterTitle} Notes PDF`,
      description: `Download ${chapterTitle} Notes PDF.`,
      images: ["/og-image.png"],
    },
  };
}

/* =========================
   ✅ Static Params
========================= */

export async function generateStaticParams() {
  await connectDB();

  const chapters = await Chapter.find(
    { board: "RBSE" },
    { grade: 1, subject: 1, name: 1 }
  ).lean();

  return chapters.map((ch: any) => ({
    grade: ch.grade,
    subject: ch.subject,
    chapterId: ch.name,
  }));
}

export const revalidate = 604800; // 7 days

/* =========================
   ✅ Runtime Cache
========================= */

const chapterCache = new Map<string, any>();

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

function getCacheKey(
  board: string,
  grade: string,
  subject: string,
  name: string
) {
  return `${board}:${grade}:${subject}:${name}`;
}

function getCachedChapter(key: string) {
  const cached = chapterCache.get(key);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  chapterCache.delete(key);

  return null;
}

function setCachedChapter(key: string, data: any) {
  chapterCache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/* =========================
   ✅ Main Page
========================= */

export default async function RBSEChapterPage({
  params,
}: PageProps) {
  const { grade, subject, chapterId } = await params;

  const chapterInfo = getChapterInfo(
  grade,
  subject,
  chapterId
);

if (!chapterInfo) {
  notFound();
}

const chapterTitle = chapterInfo.chapterTitle;
const subjectName = chapterInfo.subjectName;

  const cacheKey = getCacheKey(
    "RBSE",
    grade,
    subject,
    chapterId
  );

  let chapterData = getCachedChapter(cacheKey);

  if (!chapterData) {
    await connectDB();

    chapterData = await Chapter.findOne({
      board: "RBSE",
      grade,
      subject,
      name: chapterId,
    })
      .lean()
      .maxTimeMS(8000);

    if (chapterData) {
      setCachedChapter(cacheKey, chapterData);
    }
  }

  if (!chapterData) {
    notFound();
  }

  const firstPage: string | undefined =
    chapterData.pageImages?.[0];

  const restPages: string[] =
    chapterData.pageImages?.slice(1) || [];

  return (
    <main>
      {/* =========================
          ✅ HERO SECTION
      ========================= */}

      <section
        className={styles.hero}
        style={{
          containIntrinsicSize: "500px",
        }}
        aria-labelledby="chapter-title"
      >
        <div className={styles.heroContent}>
          <h1 id="chapter-title">
            {chapterTitle} Notes PDF (RBSE Class {grade} {subjectName})
          </h1>

          <p>
            Download free RBSE Class {grade} {subjectName}
            {" "}notes for <strong>{chapterTitle}</strong>.
            Chapter-wise study material, important concepts,
            exam preparation resources and PDF notes.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingTop: "1rem",}}>
        <Breadcrumbs
         items={[
           { href: "/", label: "Home" },
           { href: "/rbse", label: "RBSE Notes" },
           { href: `/rbse/${grade}`, label: `Class ${grade}` },
           { href: `/rbse/${grade}/${subject}`, label: subjectName, },
           {
             href: `/rbse/${grade}/${subject}/${chapterId}`,
             label: chapterTitle,
           },
         ]}
        />
      </div> 

      

      {/* =========================
          ✅ CONTENT SECTION
      ========================= */}

      <div
        className="container pdf-section"
        style={{
          position: "relative",
          contain: "layout style paint",
        }}
      >
        {/* ✅ HTML CONTENT */}

        {chapterData.extractedHtml ? (
          <>  
          <article
            className="prose"
            dangerouslySetInnerHTML={{
              __html: chapterData.extractedHtml,
            }}
          />
          <AdsenseAd slot="8403374554" variant="display" />
        </>
        ) : (
          /* ✅ PDF VIEWER */
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto",
              contain: "layout style paint",
            }}
          >
            <article
              itemScope
              itemType="https://schema.org/Article"
            >
              {/* ✅ FIRST IMAGE */}

              {firstPage && (
                
                <Image
                    src={firstPage}
                    alt={`RBSE Class ${grade} ${subject} Chapter ${chapterData.name} Page 1`}
                    width={900}
                    height={1200}
                    priority
                    sizes="(max-width:768px) 100vw,900px"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      marginBottom: "1rem",
                    }}
                />
              )}
              {/* =========================
                        ✅ TOP AD
                 ========================= */}

             <AdsenseAd slot="8403374554" variant="display" />

              {/* ✅ REMAINING PAGES */}

              <CloudinaryPDFViewer
                title={chapterData.name}
                pageImages={restPages}
              />
            </article>
          </div>
        )}
      </div>

      {/* =========================
          ✅ TRUST SECTION
      ========================= */}

      <section className={styles.trust}>
        <h2>Why Use These Notes?</h2>

        <ul>
          <li>
            ✔ Based on official RBSE syllabus
          </li>

          <li>
            ✔ Free PDF study material
          </li>

          <li>
            ✔ Helpful for board exam preparation
          </li>
        </ul>

        <p>
          📌 Chapter-wise RBSE notes for Class{" "}
          {grade} {subject}.
        </p>
      </section>

        <ChapterNavigation
          board="RBSE"
          grade={grade}
          subject={subject}
          currentChapter={chapterId}
          chapterInfo={chapterInfo}
        />

      {/* =========================
          ✅ ARTICLE SCHEMA
      ========================= */}

      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type": "Article",

            headline: `${chapterTitle} Notes PDF (RBSE Class ${grade} ${subjectName})`,

            description: `Download free RBSE Class ${grade} ${subjectName} ${chapterTitle} notes PDF and study material.`,

            image:
              firstPage ||
              "https://www.pathshalanoteshub.in/og-image.png",

            author: {
              "@type": "Organization",
              name: "Pathshala Notes Hub",
            },

            publisher: {
              "@type": "Organization",
              name: "Pathshala Notes Hub",
            },

            mainEntityOfPage: {
             "@type": "WebPage",
             "@id": `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}/${chapterId}`,
            },
          }),
        }}
      />

      {/* =========================
          ✅ BREADCRUMB SCHEMA
      ========================= */}

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type": "BreadcrumbList",

            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.pathshalanoteshub.in",
              },

              {
                "@type": "ListItem",
                position: 2,
                name: "RBSE",
                item: "https://www.pathshalanoteshub.in/rbse",
              },

              {
                "@type": "ListItem",
                position: 3,
                name: `Class ${grade}`,
                item: `https://www.pathshalanoteshub.in/rbse/${grade}`,
              },

              {
                "@type": "ListItem",
                position: 4,
                name: subjectName,
                item: `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}`,
              },

             {
                "@type": "ListItem",
                position: 5,
                name: chapterTitle,
                item: `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}/${chapterId}`,
              },
            ],
          }),
        }}
      />
    </main>
  );
}