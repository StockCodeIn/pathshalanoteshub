'use client';

import { useState } from 'react';

export interface PDFViewerProps {
  url: string;
  title: string;
}

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Cloudinary Watermark URL Generator
  const getWatermarkedUrl = (originalUrl: string) => {
    if (!originalUrl || !originalUrl.includes('cloudinary.com')) return originalUrl;
    // Aapka transformation pattern
    const watermarkConfig = 'l_watermark_g1sgt6,a_45,o_30,w_0.4,fl_relative,fl_layer_apply/';
    return originalUrl.replace('/upload/', `/upload/${watermarkConfig}`);
  };

  const finalUrl = getWatermarkedUrl(url);
  const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(finalUrl)}&embedded=true`;

  return (
    <div className="pdf-wrapper">
      {!isLoaded && (
        <div className="pdf-skeleton">
          <div className="spinner"></div>
          <p>Loading Sharp PDF Notes...</p>
        </div>
      )}

      <iframe
        src={googleViewerUrl}
        onLoad={() => setIsLoaded(true)}
        className={`pdf-iframe ${isLoaded ? 'visible' : 'hidden'}`}
        title={title}
      />

      <style jsx>{`
        .pdf-wrapper {
          position: relative;
          width: 100%;
          height: 85vh;
          min-height: 550px;
          background: #f3f4f6;
          border-radius: 8px;
          overflow: hidden;
          margin: 20px 0;
        }
        .pdf-skeleton {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .pdf-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .hidden { visibility: hidden; opacity: 0; }
        .visible { visibility: visible; opacity: 1; transition: opacity 0.5s ease; }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #ddd;
          border-top: 4px solid #0070f3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}