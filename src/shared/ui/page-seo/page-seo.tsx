import { useEffect } from "react";

import type { IPageSEOProps } from "./types";

const DEFAULT_PAGE_SEO: IPageSEOProps = {
  title: "Test Task Wargaming - World of Warships: Legends Commander Skins",
  description:
    "Interactive showcase of commander skins for World of Warships: Legends created for the Test Task Wargaming challenge.",
  keywords:
    "world of warships legends, commander skins, test task wargaming, react showcase",
  author: "Test Task Wargaming",
  type: "website" as const,
  twitterCard: "summary_large_image" as const,
  ogLocale: "en_US",
};

function PageSEO({
  title,
  description,
  keywords,
  author,
  image,
  url,
  type = DEFAULT_PAGE_SEO.type,
  twitterCard = DEFAULT_PAGE_SEO.twitterCard,
  noIndex = false,
  noFollow = false,
  canonical,
  ogLocale = DEFAULT_PAGE_SEO.ogLocale,
  twitterCreator,
  twitterSite,
}: IPageSEOProps) {
  const finalTitle = title
    ? `${title} | ${DEFAULT_PAGE_SEO.title}`
    : DEFAULT_PAGE_SEO.title || "";

  const finalDescription = description || DEFAULT_PAGE_SEO.description || "";
  const finalKeywords = keywords || DEFAULT_PAGE_SEO.keywords || "";
  const finalAuthor = author || DEFAULT_PAGE_SEO.author || "";
  const finalUrl = url || window.location.href;
  const finalImage = image || "/og-image.png";

  useEffect(() => {
    document.title = finalTitle;

    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(
        `meta[name="${name}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(
        `meta[property="${property}"]`
      ) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMetaTag("description", finalDescription);
    updateMetaTag("keywords", finalKeywords);
    updateMetaTag("author", finalAuthor);

    const robotsContent = [];

    if (noIndex) robotsContent.push("noindex");
    if (noFollow) robotsContent.push("nofollow");
    if (robotsContent.length === 0) robotsContent.push("index", "follow");

    updateMetaTag("robots", robotsContent.join(", "));

    updatePropertyTag("og:title", finalTitle);
    updatePropertyTag("og:description", finalDescription);
    updatePropertyTag("og:type", type || "");
    updatePropertyTag("og:url", finalUrl);
    updatePropertyTag("og:image", finalImage);
    updatePropertyTag("og:locale", ogLocale || "");
    updatePropertyTag("og:site_name", DEFAULT_PAGE_SEO.title || "");

    updateMetaTag("twitter:card", twitterCard || "");
    updateMetaTag("twitter:title", finalTitle);
    updateMetaTag("twitter:description", finalDescription);
    updateMetaTag("twitter:image", finalImage);

    if (twitterCreator) updateMetaTag("twitter:creator", twitterCreator);
    if (twitterSite) updateMetaTag("twitter:site", twitterSite);

    if (canonical) {
      let link = document.querySelector(
        'link[rel="canonical"]'
      ) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: finalTitle,
      description: finalDescription,
      url: finalUrl,
      author: {
        "@type": "Organization",
        name: finalAuthor,
      },
      applicationCategory: "GameApplication",
      operatingSystem: "Web Browser",
    };

    const existingScript = document.querySelector(
      'script[type="application/ld+json"]'
    );

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");

    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);

    document.head.appendChild(script);
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalAuthor,
    finalUrl,
    finalImage,
    type,
    twitterCard,
    noIndex,
    noFollow,
    canonical,
    ogLocale,
    twitterCreator,
    twitterSite,
  ]);

  return null;
}

export interface IHelmetProps extends IPageSEOProps {
  children?: React.ReactNode;
}

function Helmet({ children, ...seoProps }: IHelmetProps) {
  return (
    <>
      <PageSEO {...seoProps} />
      {children}
    </>
  );
}

PageSEO.Helmet = Helmet;

export default PageSEO;
