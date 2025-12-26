export const runtime = 'edge'
export const dynamic = 'force-static'
export const revalidate = false

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://manajntuhresults.vercel.app/</loc></url>
<url><loc>https://manajntuhresults.vercel.app/academicresult</loc></url>
<url><loc>https://manajntuhresults.vercel.app/academicallresult</loc></url>
<url><loc>https://manajntuhresults.vercel.app/classresult</loc></url>
<url><loc>https://manajntuhresults.vercel.app/backlogreport</loc></url>
<url><loc>https://manajntuhresults.vercel.app/creditchecker</loc></url>
<url><loc>https://manajntuhresults.vercel.app/resultcontrast</loc></url>
<url><loc>https://manajntuhresults.vercel.app/notifications</loc></url>
<url><loc>https://manajntuhresults.vercel.app/syllabus</loc></url>
<url><loc>https://manajntuhresults.vercel.app/calendars</loc></url>
<url><loc>https://manajntuhresults.vercel.app/carrers</loc></url>
<url><loc>https://manajntuhresults.vercel.app/faq</loc></url>
<url><loc>https://manajntuhresults.vercel.app/helpcenter</loc></url>
<url><loc>https://manajntuhresults.vercel.app/privacy</loc></url>
</urlset>`

  return new Response(xml.trim(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

