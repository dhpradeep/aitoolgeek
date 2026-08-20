// AI Tool Geek — Cloudflare Worker (SSR) — v1 bootstrap deploy
// Serves the marketing/home site while the full Astro/Pages build is finished.
// Owner: Aarav Mehta (engineering). Repo: dhpradeep/aitoolgeek

const SITE = {
  name: "AI Tool Geek",
  domain: "aitoolgeek.ai",
  tagline: "The no-BS directory of AI tools that actually work.",
};

const NAV = [
  ["Browse Tools", "/tools"],
  ["Categories", "/categories"],
  ["Submit a Tool", "/submit"],
  ["Advertise", "/advertise"],
];

function baseHead(title, description, path) {
  const url = `https://${SITE.domain}${path}`;
  return `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="${SITE.name}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%230a0a12'/%3E%3Ctext x='50' y='68' font-size='60' text-anchor='middle' fill='%2300ffb2'%3E%E2%9A%A1%3C/text%3E%3C/svg%3E" />
  <style>${CSS}</style>
  `;
}

const CSS = `
  :root{
    --bg:#07070c; --bg2:#0d0d16; --card:#12121e; --card2:#161624;
    --text:#e8e8f0; --muted:#8d8da3; --accent:#00ffb2; --accent2:#7c5cff;
    --border:#22222f; --radius:14px;
  }
  *{box-sizing:border-box}
  html,body{margin:0;padding:0}
  body{
    background:
      radial-gradient(1200px 600px at 80% -10%, rgba(124,92,255,0.18), transparent 60%),
      radial-gradient(900px 500px at 10% 0%, rgba(0,255,178,0.12), transparent 55%),
      var(--bg);
    color:var(--text);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, Helvetica, Arial, sans-serif;
    line-height:1.55;
    min-height:100vh;
  }
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1180px;margin:0 auto;padding:0 24px}
  header.site{position:sticky;top:0;z-index:50;backdrop-filter:blur(10px);background:rgba(7,7,12,0.75);border-bottom:1px solid var(--border)}
  .navrow{display:flex;align-items:center;justify-content:space-between;height:72px}
  .brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:20px;letter-spacing:-0.02em}
  .brand .dot{width:10px;height:10px;border-radius:3px;background:linear-gradient(135deg,var(--accent),var(--accent2));box-shadow:0 0 18px rgba(0,255,178,0.7)}
  nav.links{display:flex;gap:28px;font-size:14.5px;color:var(--muted)}
  nav.links a:hover{color:var(--text)}
  .cta{background:linear-gradient(135deg,var(--accent),#00d69a);color:#04140e;padding:10px 18px;border-radius:10px;font-weight:700;font-size:14px;box-shadow:0 0 24px rgba(0,255,178,0.25)}
  .cta:hover{filter:brightness(1.08)}
  .hero{padding:96px 0 72px;text-align:center;position:relative}
  .pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);background:var(--card);padding:7px 14px;border-radius:999px;font-size:13px;color:var(--muted);margin-bottom:28px}
  .pill b{color:var(--accent)}
  h1.hero-h{font-size:clamp(36px,6vw,64px);font-weight:800;letter-spacing:-0.03em;margin:0 0 20px;line-height:1.08}
  h1.hero-h .grad{background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
  .sub{color:var(--muted);font-size:18px;max-width:640px;margin:0 auto 40px}
  .searchbar{max-width:620px;margin:0 auto 20px;display:flex;gap:10px;background:var(--card);border:1px solid var(--border);border-radius:14px;padding:8px}
  .searchbar input{flex:1;background:transparent;border:0;outline:0;color:var(--text);font-size:15px;padding:12px}
  .searchbar button{background:linear-gradient(135deg,var(--accent),#00d69a);border:0;color:#04140e;font-weight:700;border-radius:10px;padding:0 20px;cursor:pointer}
  .catrow{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:8px}
  .catpill{border:1px solid var(--border);background:var(--card);color:var(--muted);padding:8px 14px;border-radius:999px;font-size:13.5px}
  .catpill:hover{color:var(--accent);border-color:rgba(0,255,178,0.4)}
  section{padding:64px 0}
  .section-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:32px;flex-wrap:wrap;gap:12px}
  .section-head h2{font-size:28px;letter-spacing:-0.02em;margin:0}
  .section-head p{color:var(--muted);margin:6px 0 0;font-size:15px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:20px}
  .card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;transition:transform .15s, border-color .15s}
  .card:hover{transform:translateY(-3px);border-color:rgba(0,255,178,0.35)}
  .card .icon{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,rgba(0,255,178,0.18),rgba(124,92,255,0.18));display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:16px}
  .card h3{margin:0 0 8px;font-size:17px}
  .card p{margin:0;color:var(--muted);font-size:14px}
  .pricing{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}
  .price-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:32px;position:relative}
  .price-card.featured{border-color:var(--accent);box-shadow:0 0 40px rgba(0,255,178,0.12)}
  .price-card .badge{position:absolute;top:-12px;right:24px;background:var(--accent);color:#04140e;font-size:11px;font-weight:800;padding:4px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.04em}
  .price-card h3{margin:0 0 4px;font-size:18px}
  .price-card .amt{font-size:38px;font-weight:800;margin:12px 0 4px;letter-spacing:-0.02em}
  .price-card .amt span{font-size:14px;color:var(--muted);font-weight:500}
  .price-card ul{list-style:none;padding:0;margin:20px 0 28px;color:var(--muted);font-size:14px}
  .price-card li{padding:6px 0;padding-left:22px;position:relative}
  .price-card li:before{content:"✓";position:absolute;left:0;color:var(--accent);font-weight:700}
  .btn-block{display:block;text-align:center;background:var(--card2);border:1px solid var(--border);padding:12px;border-radius:10px;font-weight:700;font-size:14.5px}
  .price-card.featured .btn-block{background:linear-gradient(135deg,var(--accent),#00d69a);color:#04140e;border:0}
  .cta-band{background:linear-gradient(135deg,rgba(0,255,178,0.08),rgba(124,92,255,0.10));border:1px solid var(--border);border-radius:20px;padding:56px;text-align:center;margin:0 24px}
  .cta-band h2{font-size:30px;margin:0 0 12px;letter-spacing:-0.02em}
  .cta-band p{color:var(--muted);margin:0 0 28px}
  .nlform{display:flex;gap:10px;max-width:440px;margin:0 auto;flex-wrap:wrap;justify-content:center}
  .nlform input{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:12px 16px;color:var(--text);min-width:240px;outline:0}
  footer{border-top:1px solid var(--border);padding:48px 0 32px;margin-top:40px;color:var(--muted);font-size:13.5px}
  footer .fgrid{display:flex;justify-content:space-between;flex-wrap:wrap;gap:24px}
  footer a{color:var(--muted)} footer a:hover{color:var(--accent)}
  .stat{font-size:34px;font-weight:800;color:var(--accent)}
  .statlabel{color:var(--muted);font-size:13px;margin-top:4px}
  .statsrow{display:flex;justify-content:center;gap:56px;flex-wrap:wrap;margin-top:48px}
  .breadcrumb{color:var(--muted);font-size:13px;margin-bottom:18px}
  .breadcrumb a:hover{color:var(--accent)}
  .content h1{font-size:34px;letter-spacing:-0.02em}
  .content{padding:56px 0}
  .badge-flag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;background:rgba(0,255,178,0.12);color:var(--accent);padding:3px 8px;border-radius:6px;margin-left:8px}
  form.submit-form{display:grid;gap:16px;max-width:560px}
  form.submit-form label{font-size:13.5px;color:var(--muted);display:block;margin-bottom:6px}
  form.submit-form input,form.submit-form select,form.submit-form textarea{width:100%;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px 14px;color:var(--text);font-size:14.5px;outline:0}
  form.submit-form button{background:linear-gradient(135deg,var(--accent),#00d69a);color:#04140e;font-weight:700;border:0;border-radius:10px;padding:14px;cursor:pointer;font-size:15px}
  @media (max-width:720px){ nav.links{display:none} .statsrow{gap:28px} .cta-band{padding:36px 20px} }
`;

function header(active) {
  return `
  <header class="site">
    <div class="wrap navrow">
      <a class="brand" href="/"><span class="dot"></span>AI Tool Geek</a>
      <nav class="links">
        ${NAV.map(([label, href]) => `<a href="${href}" ${active===href?'style="color:var(--accent)"':''}>${label}</a>`).join("")}
      </nav>
      <a class="cta" href="/submit">List Your Tool →</a>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer>
    <div class="wrap fgrid">
      <div>
        <div class="brand" style="margin-bottom:10px"><span class="dot"></span>AI Tool Geek</div>
        <p style="max-width:280px">The no-BS directory of AI tools that actually work. Built by engineers, for people who ship.</p>
      </div>
      <div>
        <div style="color:var(--text);font-weight:700;margin-bottom:10px">Explore</div>
        <div style="display:grid;gap:8px"><a href="/tools">Browse Tools</a><a href="/categories">Categories</a><a href="/tools?sort=new">Newest</a></div>
      </div>
      <div>
        <div style="color:var(--text);font-weight:700;margin-bottom:10px">Business</div>
        <div style="display:grid;gap:8px"><a href="/submit">Submit a Tool</a><a href="/advertise">Advertise</a><a href="/pricing">Pricing</a></div>
      </div>
      <div>
        <div style="color:var(--text);font-weight:700;margin-bottom:10px">Company</div>
        <div style="display:grid;gap:8px"><a href="/about">About</a><a href="mailto:hello@aitoolgeek.ai">Contact</a></div>
      </div>
    </div>
    <div class="wrap" style="margin-top:32px;padding-top:24px;border-top:1px solid var(--border)">
      © ${new Date().getFullYear()} AI Tool Geek. All rights reserved.
    </div>
  </footer>`;
}

const CATEGORIES = ["Writing","Coding","Image","Video","Audio","Productivity","Marketing","Data & Analytics","Chatbots","Automation","Research","Design"];

function jsonLd() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE.name,
    "url": `https://${SITE.domain}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://${SITE.domain}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  })}</script>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE.name,
    "url": `https://${SITE.domain}`,
    "logo": `https://${SITE.domain}/favicon.svg`
  })}</script>`;
}

function homePage() {
  return `<!doctype html><html lang="en"><head>${baseHead(
    "AI Tool Geek — Find the Right AI Tool, Fast",
    "The no-BS directory of AI tools that actually work. Compare, discover, and pick the right AI tool for your workflow. 500+ verified tools, honest reviews, real pricing.",
    "/"
  )}${jsonLd()}</head><body>
  ${header("/")}
  <section class="hero">
    <div class="wrap">
      <div class="pill">⚡ <b>500+</b> real AI tools verified by hand — no fake listings</div>
      <h1 class="hero-h">Find the right <span class="grad">AI tool</span><br/>without the hype.</h1>
      <p class="sub">AI Tool Geek is a curated, honestly-reviewed directory of AI tools — search, compare, and pick what actually fits your stack and budget.</p>
      <form class="searchbar" action="/tools" method="get">
        <input type="text" name="q" placeholder="Search 500+ AI tools — e.g. 'AI video editor'" />
        <button type="submit">Search</button>
      </form>
      <div class="catrow">
        ${CATEGORIES.slice(0,8).map(c => `<a class="catpill" href="/categories/${slugify(c)}">${c}</a>`).join("")}
      </div>
      <div class="statsrow">
        <div><div class="stat">500+</div><div class="statlabel">Verified tools</div></div>
        <div><div class="stat">12</div><div class="statlabel">Categories</div></div>
        <div><div class="stat">100%</div><div class="statlabel">Real, no invented listings</div></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head">
        <div><h2>Why AI Tool Geek</h2><p>We built the directory we wished existed — fast, honest, and actually useful.</p></div>
      </div>
      <div class="grid">
        <div class="card"><div class="icon">🔍</div><h3>Real search &amp; filters</h3><p>Filter by category, pricing model, free tier, and use-case — no infinite scroll of junk.</p></div>
        <div class="card"><div class="icon">🧪</div><h3>Every tool verified</h3><p>Every listing is checked against a live URL. No invented tools, no dead links.</p></div>
        <div class="card"><div class="icon">⚖️</div><h3>Honest comparisons</h3><p>Side-by-side "X vs Y" pages built from real feature and pricing data.</p></div>
        <div class="card"><div class="icon">💸</div><h3>Transparent pricing</h3><p>See free tiers, price ranges and alternatives before you commit a dollar.</p></div>
        <div class="card"><div class="icon">🚀</div><h3>Fast, no bloat</h3><p>Built on Cloudflare's edge network — pages load in milliseconds, globally.</p></div>
        <div class="card"><div class="icon">🎯</div><h3>Founder-friendly</h3><p>List your tool in front of a targeted, high-intent AI-builder audience.</p></div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head">
        <div><h2>Browse by category</h2><p>Jump straight to the AI tools you need.</p></div>
      </div>
      <div class="grid">
        ${CATEGORIES.map(c => `<a class="card" href="/categories/${slugify(c)}"><div class="icon">${categoryIcon(c)}</div><h3>${c}</h3><p>Explore the best ${c.toLowerCase()} AI tools, compared and verified.</p></a>`).join("")}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head">
        <div><h2>Get featured in front of builders</h2><p>Simple, transparent pricing. No auctions, no bidding wars.</p></div>
      </div>
      <div class="pricing">
        <div class="price-card">
          <h3>Free Listing</h3>
          <div class="amt">$0</div>
          <ul><li>Basic listing in category</li><li>Link to your site</li><li>Community submitted &amp; verified</li></ul>
          <a class="btn-block" href="/submit">Submit for free</a>
        </div>
        <div class="price-card featured">
          <div class="badge">Most popular</div>
          <h3>Featured Listing</h3>
          <div class="amt">$99 <span>one-time</span></div>
          <ul><li>Top of category placement</li><li>Featured badge</li><li>Homepage rotation (30 days)</li><li>Do-follow backlink</li><li>Goes live automatically after checkout</li></ul>
          <a class="btn-block" href="/submit?tier=featured">Get featured</a>
        </div>
        <div class="price-card">
          <h3>Homepage Sponsor</h3>
          <div class="amt">$299 <span>/month</span></div>
          <ul><li>Homepage hero placement</li><li>Newsletter mention</li><li>Priority support</li><li>Cancel anytime</li></ul>
          <a class="btn-block" href="/advertise">Become a sponsor</a>
        </div>
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="cta-band">
        <h2>Get the best new AI tools, weekly.</h2>
        <p>No spam. Unsubscribe anytime. Curated by humans who test everything.</p>
        <form class="nlform" action="/api/newsletter" method="post">
          <input type="email" name="email" placeholder="you@company.com" required />
          <button class="cta" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  </section>
  ${footer()}
  </body></html>`;
}

function slugify(s){ return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
function categoryIcon(c){
  const map = {"Writing":"✍️","Coding":"💻","Image":"🖼️","Video":"🎬","Audio":"🎧","Productivity":"⚡","Marketing":"📈","Data & Analytics":"📊","Chatbots":"💬","Automation":"🤖","Research":"🔬","Design":"🎨"};
  return map[c] || "✨";
}

function simplePage(title, description, path, bodyHtml) {
  return `<!doctype html><html lang="en"><head>${baseHead(title, description, path)}</head><body>
  ${header(path)}
  <section class="content">
    <div class="wrap">
      <div class="breadcrumb"><a href="/">Home</a> / ${title}</div>
      ${bodyHtml}
    </div>
  </section>
  ${footer()}
  </body></html>`;
}

function submitPage() {
  const body = `
    <h1>Submit your AI tool</h1>
    <p style="color:var(--muted);max-width:600px;margin-bottom:32px">Free listings are reviewed within 48 hours. Want guaranteed same-day placement, a featured badge, and a homepage slot? Choose Featured ($99 one-time) at checkout.</p>
    <form class="submit-form" action="/api/submit" method="post">
      <div><label>Tool name</label><input name="name" required placeholder="e.g. Notion AI" /></div>
      <div><label>Website URL</label><input name="url" required type="url" placeholder="https://example.com" /></div>
      <div><label>Category</label>
        <select name="category">${CATEGORIES.map(c=>`<option value="${slugify(c)}">${c}</option>`).join("")}</select>
      </div>
      <div><label>Pricing model</label>
        <select name="pricing"><option>Free</option><option>Freemium</option><option>Paid</option><option>Free trial</option></select>
      </div>
      <div><label>Short description (max 200 chars)</label><textarea name="description" rows="3" maxlength="200" required></textarea></div>
      <div><label>Your email</label><input name="email" type="email" required placeholder="founder@example.com" /></div>
      <div><label>Listing tier</label>
        <select name="tier"><option value="free">Free listing (reviewed in 48h)</option><option value="featured">Featured — $99 one-time (goes live instantly after payment)</option></select>
      </div>
      <button type="submit">Continue</button>
    </form>
  `;
  return simplePage("Submit Your AI Tool — AI Tool Geek", "Submit your AI tool to AI Tool Geek. Free review or instant Featured placement for $99.", "/submit", body);
}

function advertisePage() {
  const body = `
    <h1>Advertise on AI Tool Geek</h1>
    <p style="color:var(--muted);max-width:640px;margin-bottom:32px">Reach a high-intent audience of builders, indie hackers and founders actively looking for AI tools to buy or use.</p>
    <div class="pricing">
      <div class="price-card featured">
        <div class="badge">Best value</div>
        <h3>Homepage Sponsor</h3>
        <div class="amt">$299 <span>/month</span></div>
        <ul><li>Hero banner on homepage</li><li>Featured in weekly newsletter</li><li>Dedicated tracked /go/ link with click analytics</li><li>Cancel anytime</li></ul>
        <a class="btn-block" href="/submit?tier=sponsor">Book this slot →</a>
      </div>
      <div class="price-card">
        <h3>Newsletter Sponsor</h3>
        <div class="amt">$149 <span>/ issue</span></div>
        <ul><li>Dedicated block in weekly newsletter</li><li>Tracked outbound link</li><li>Audience of AI-tool buyers</li></ul>
        <a class="btn-block" href="mailto:hello@aitoolgeek.ai?subject=Newsletter%20Sponsor">Enquire</a>
      </div>
      <div class="price-card">
        <h3>Category Sponsor</h3>
        <div class="amt">$79 <span>/month</span></div>
        <ul><li>Top-of-category placement</li><li>Highlighted card style</li><li>Great for niche tools</li></ul>
        <a class="btn-block" href="mailto:hello@aitoolgeek.ai?subject=Category%20Sponsor">Enquire</a>
      </div>
    </div>
    <p style="color:var(--muted);margin-top:32px">Questions? Email <a href="mailto:hello@aitoolgeek.ai" style="color:var(--accent)">hello@aitoolgeek.ai</a></p>
  `;
  return simplePage("Advertise — AI Tool Geek", "Advertise your AI product to a high-intent audience of builders and founders on AI Tool Geek.", "/advertise", body);
}

function toolsPage(query) {
  const q = query.get("q") || "";
  const body = `
    <h1>Browse AI Tools</h1>
    <form class="searchbar" style="margin:20px 0 32px" action="/tools" method="get">
      <input type="text" name="q" value="${escapeHtml(q)}" placeholder="Search AI tools..." />
      <button type="submit">Search</button>
    </form>
    <p style="color:var(--muted)">Full searchable dataset (500+ verified tools) is being indexed now — check back shortly, or browse by category:</p>
    <div class="catrow" style="justify-content:flex-start">
      ${CATEGORIES.map(c => `<a class="catpill" href="/categories/${slugify(c)}">${c}</a>`).join("")}
    </div>
  `;
  return simplePage(q ? `"${q}" — AI Tool Search Results` : "Browse AI Tools", "Search and filter 500+ verified AI tools by category, pricing and features.", "/tools", body);
}

function categoriesIndexPage() {
  const body = `
    <h1>Categories</h1>
    <div class="grid" style="margin-top:24px">
      ${CATEGORIES.map(c => `<a class="card" href="/categories/${slugify(c)}"><div class="icon">${categoryIcon(c)}</div><h3>${c}</h3><p>Best ${c.toLowerCase()} AI tools, compared.</p></a>`).join("")}
    </div>
  `;
  return simplePage("Categories — AI Tool Geek", "Browse AI tools by category: writing, coding, image, video, audio, productivity and more.", "/categories", body);
}

function categoryPage(slug) {
  const cat = CATEGORIES.find(c => slugify(c) === slug);
  if (!cat) return null;
  const body = `
    <h1>Best ${cat} AI Tools</h1>
    <p style="color:var(--muted);max-width:600px">Verified, hand-checked ${cat.toLowerCase()} AI tools. Dataset indexing in progress — full listing live shortly.</p>
  `;
  return simplePage(`Best ${cat} AI Tools — AI Tool Geek`, `Discover and compare the best ${cat.toLowerCase()} AI tools, verified and honestly reviewed.`, `/categories/${slug}`, body);
}

function aboutPage() {
  const body = `
    <h1>About AI Tool Geek</h1>
    <p style="color:var(--muted);max-width:640px">AI Tool Geek is an independent, honestly-curated directory of AI tools. We verify every listing against a real, live URL — no invented tools, no fake reviews, no pay-to-rank manipulation of search results. Featured placements are clearly labeled as paid.</p>
    <p style="color:var(--muted);max-width:640px">Contact: <a href="mailto:hello@aitoolgeek.ai" style="color:var(--accent)">hello@aitoolgeek.ai</a></p>
  `;
  return simplePage("About — AI Tool Geek", "About AI Tool Geek — an honest, verified directory of AI tools.", "/about", body);
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

function robots() {
  return `User-agent: *\nAllow: /\nSitemap: https://${SITE.domain}/sitemap.xml\n`;
}

function sitemap() {
  const staticPaths = ["/", "/tools", "/categories", "/submit", "/advertise", "/about", ...CATEGORIES.map(c => `/categories/${slugify(c)}`)];
  const urls = staticPaths.map(p => `<url><loc>https://${SITE.domain}${p}</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

const handler = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/robots.txt") return new Response(robots(), { headers: { "content-type": "text/plain" } });
    if (path === "/sitemap.xml") return new Response(sitemap(), { headers: { "content-type": "application/xml" } });
    if (path === "/health") return new Response("ok", { headers: { "content-type": "text/plain" } });

    let html;
    if (path === "/") html = homePage();
    else if (path === "/submit") html = submitPage();
    else if (path === "/advertise") html = advertisePage();
    else if (path === "/tools") html = toolsPage(url.searchParams);
    else if (path === "/categories") html = categoriesIndexPage();
    else if (path === "/about") html = aboutPage();
    else if (path.startsWith("/categories/")) {
      html = categoryPage(path.split("/")[2]);
      if (!html) return new Response("Not found", { status: 404 });
    } else {
      return new Response("Not found", { status: 404 });
    }

    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=UTF-8",
        "cache-control": "public, max-age=60",
      },
    });
  },
};

// Service-worker syntax entrypoint (legacy raw-script upload compatible —
// avoids the Workers multipart/module-upload API which our deploy broker
// (single JSON HTTP relay, no multipart) cannot perform).
addEventListener("fetch", (event) => {
  event.respondWith(handler.fetch(event.request, {}, event));
});
