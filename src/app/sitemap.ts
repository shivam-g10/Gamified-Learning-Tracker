import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Since we don't want search engines to index this site,
  // we return an empty sitemap
  return [];
}
