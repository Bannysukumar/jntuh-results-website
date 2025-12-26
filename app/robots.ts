import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://manajntuhresults.vercel.app'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/result/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

