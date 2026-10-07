import React, { useEffect } from 'react';
import { SeoMetadata } from '../../types';

interface SeoHeadProps {
  seo: SeoMetadata;
}

const SOCIAL_OG_IMAGE =
  'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/mimaricam-sosyal-medya-og-gorseli.png?alt=media&token=c0bf265b-49f1-4b82-9831-9c58a6af4d54';

export const SeoHead: React.FC<SeoHeadProps> = ({ seo }) => {
  useEffect(() => {
    // 1. Title
    document.title = `${seo.title} | MimariCam`;

    // 2. Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seo.description);

    // Robots indexing: index, follow or noindex, nofollow
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', seo.noindex ? 'noindex, nofollow' : 'index, follow');

    // Remove any leftover googlebot noindex meta tag
    const googlebotMeta = document.querySelector('meta[name="googlebot"]');
    if (googlebotMeta) {
      googlebotMeta.remove();
    }

    // 3. Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seo.canonical);

    // 4. OpenGraph
    const setOgTag = (property: string, content: string) => {
      let og = document.querySelector(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.setAttribute('content', content);
    };

    setOgTag('og:title', seo.title);
    setOgTag('og:description', seo.description);
    setOgTag('og:url', seo.canonical);

    const imageToUse = seo.ogImage || SOCIAL_OG_IMAGE;
    setOgTag('og:image', imageToUse);

    let twImg = document.querySelector('meta[name="twitter:image"]');
    if (!twImg) {
      twImg = document.createElement('meta');
      twImg.setAttribute('name', 'twitter:image');
      document.head.appendChild(twImg);
    }
    twImg.setAttribute('content', imageToUse);

    // 5. Schema.org JSON-LD
    let scriptTag = document.getElementById('mimaricam-schema-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'mimaricam-schema-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const graphItems: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        '@id': 'https://mimaricam.com/#organization',
        name: 'MimariCam',
        url: 'https://mimaricam.com',
        logo: 'https://mimaricam.com/logo.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+90-542-145-25-25',
          contactType: 'customer service',
          areaServed: 'TR',
          availableLanguage: ['Turkish', 'English'],
        },
        sameAs: ['https://mimaricam.com.tr'],
      },
    ];

    if (seo.schemaJson) {
      if (Array.isArray(seo.schemaJson)) {
        graphItems.push(...seo.schemaJson);
      } else {
        graphItems.push(seo.schemaJson);
      }
    } else {
      graphItems.push({
        '@type': 'WebPage',
        '@id': `${seo.canonical}#webpage`,
        url: seo.canonical,
        name: seo.title,
        description: seo.description,
      });
    }

    if (seo.imageObject) {
      graphItems.push(seo.imageObject);
    }

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@graph': graphItems,
    };

    scriptTag.textContent = JSON.stringify(defaultSchema);
  }, [seo]);

  return null;
};
