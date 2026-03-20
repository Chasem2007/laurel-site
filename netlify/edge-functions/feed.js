// netlify/edge-functions/feed.js
// This runs on Netlify's edge network and returns a live RSS feed
// built from your Supabase posts table.
//
// It reads SUPABASE_URL and SUPABASE_ANON from Netlify environment
// variables (set these in Netlify → Site Settings → Environment Variables).

export default async (request, context) => {
  const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")  || "";
  const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON") || "";

  if (!SUPABASE_URL || !SUPABASE_ANON) {
    return new Response("Supabase not configured.", { status: 500 });
  }

  // Fetch latest 50 posts from Supabase REST API
  const apiUrl = `${SUPABASE_URL}/rest/v1/posts?select=*&order=created_at.desc&limit=50`;
  const res = await fetch(apiUrl, {
    headers: {
      "apikey": SUPABASE_ANON,
      "Authorization": `Bearer ${SUPABASE_ANON}`,
    }
  });

  if (!res.ok) {
    return new Response("Error fetching posts.", { status: 502 });
  }

  const posts = await res.json();

  const siteUrl = new URL(request.url).origin;

  const items = posts.map(p => `
    <item>
      <title><![CDATA[${escape(p.title)}]]></title>
      <description><![CDATA[${escape(p.body)}]]></description>
      <author>${escape(p.author)}</author>
      ${p.category ? `<category>${escape(p.category)}</category>` : ""}
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
      <guid isPermaLink="false">${p.id}</guid>
    </item>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Laurel High School Announcements</title>
    <link>${siteUrl}</link>
    <description>Official announcements from Laurel High School — Go Locomotives!</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=UTF-8",
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    }
  });
};

function escape(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const config = { path: "/feed.xml" };
