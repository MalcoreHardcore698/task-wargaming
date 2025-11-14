export interface IPageSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile" | "book";
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  ogLocale?: string;
  twitterCreator?: string;
  twitterSite?: string;
}
