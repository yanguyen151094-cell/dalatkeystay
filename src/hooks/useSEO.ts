import { useEffect } from 'react';

const BASE_URL = 'https://www.dalatkeystay.vn';
const DEFAULT_IMAGE = 'https://readdy.ai/api/search-image?query=Dalat%20Vietnam%20aerial%20mountain%20pine%20forest%20city%20landscape%20beautiful&width=1200&height=630&seq=og1&orientation=landscape';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object | object[];
  noindex?: boolean;
}

function setMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  structuredData,
  noindex = false,
}: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    // Basic meta
    if (description) setMetaByName('description', description);
    if (keywords) setMetaByName('keywords', keywords);
    setMetaByName('robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
    setLinkCanonical(canonicalUrl);

    // Open Graph
    setMetaByProperty('og:title', title);
    setMetaByProperty('og:type', ogType);
    setMetaByProperty('og:url', canonicalUrl);
    if (description) setMetaByProperty('og:description', description);
    setMetaByProperty('og:image', ogImage || DEFAULT_IMAGE);
    setMetaByProperty('og:locale', 'vi_VN');
    setMetaByProperty('og:site_name', 'Key Stay Đà Lạt');

    // Twitter Card
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', title);
    if (description) setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', ogImage || DEFAULT_IMAGE);

    // Last modified
    const today = new Date().toISOString().split('T')[0];
    setMetaByName('last-modified', today);

    // Structured data (page-level, separate from index.html global)
    let scriptEl: HTMLScriptElement | null = null;
    if (structuredData) {
      const id = 'page-structured-data';
      scriptEl = document.getElementById(id) as HTMLScriptElement | null;
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = id;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
      scriptEl.textContent = JSON.stringify(
        dataArray.length === 1 ? dataArray[0] : dataArray
      );
    }

    return () => {
      document.title = prevTitle;
      const el = document.getElementById('page-structured-data');
      if (el) el.remove();
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, structuredData]);
}
