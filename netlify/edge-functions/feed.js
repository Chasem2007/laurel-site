// netlify/edge-functions/feed.js
// Serves a live RSS 2.0 feed from Supabase.
// Only the <title> field is populated per item - perfect for ticker displays.

export default async (request, context) => {
  const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")  || "";
  const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON") || "";

  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return new Response("Supabase not configured.", { status: 500 });
  }

  const apiUrl = `${SUPABASE_URL}/rest/v1/posts?select=id,title,created_at&order=created_at.desc&limit=50`;
  const res = await fetch(apiUrl, {
    headers: {
      "apikey": SUPABASE_ANON,
      "Authorization": `Bearer ${SUPABASE_ANON}`,
    }
  });

  if (!res.ok) {
    return new Response("Error fetching posts from database.", { status: 502 });
  }

  const posts = await res.json();
  const siteUrl = new URL(request.url).origin;

  // Only title + pubDate + guid per item - body is intentionally excluded for ticker use
  const items = posts.map(p => `
    <item>
      <title><![CDATA[${xmlEsc(p.title)}]]></title>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
      <guid isPermaLink="false">${p.id}</guid>
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Laurel High School Announcements</title>
    <link>${siteUrl}</link>
    <description>Laurel High School ticker feed - Go Locomotives!</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=UTF-8",
      "Cache-Control": "public, max-age=30",
      "Access-Control-Allow-Origin": "*",
    }
  });
};

function xmlEsc(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const config = { path: "/feed.xml" };
