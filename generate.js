#!/usr/bin/env node
// Builds index.html from the company list + downloaded logos in assets/logos/.
// Ultra-minimal, Apple-style. Two tabs (Agents by vertical / Infrastructure),
// Soar featured up top, click-to-text where a public number exists.
const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(__dirname, 'assets', 'logos');

// Public numbers anyone can text directly (E.164). Filled from the research team.
// slug -> '+1XXXXXXXXXX'
const NUMBERS = {
  soar:         '+14242492855',
  orchid:       '+14152999916',
  caddy:        '+12064039093',
  tomo:         '+14157700508',
  sidekicks:    '+16282134346',
  miso:         '+16504054503',
  alfi:         '+13104609758',
  series:       '+14155057855',
  nudge:        '+16452438876',
  clera:        '+16505397073',
  linq:         '+14158707772', // Linq's public "text the demo agent" number
};

// Featured / lead-gen spotlight at the very top of the Agents tab.
const FEATURED = {
  slug: 'soar', name: 'Soar', url: 'https://www.joinsoar.co',
  tag: 'Your personal travel companion. It learns how you travel from your inbox, then plans, books, and manages every trip.',
};

const AGENTS = [
  { group: 'Assistants', items: [
    { slug: 'poke',         name: 'Poke',         tag: 'Texting-first personal assistant', url: 'https://poke.com' },
    { slug: 'lindy',        name: 'Lindy',        tag: 'AI executive assistant',           url: 'https://www.lindy.ai' },
    { slug: 'caddy',        name: 'Caddy',        tag: 'Handles your work, by text',        url: 'https://caddy.app' },
    { slug: 'orchid',       name: 'Orchid',       tag: 'Runs your day',                     url: 'https://orchid.ai' },
    { slug: 'tomo',         name: 'Tomo',         tag: 'AI that lives in your texts',       url: 'https://www.tomo.ai' },
    { slug: 'martin',       name: 'Martin',       tag: 'A Jarvis you can text',             url: 'https://www.trymartin.com' },
    { slug: 'sidekicks',    name: 'Sidekicks',    tag: 'Text an AI on any phone',           url: 'https://sidekicks.chat' },
  ]},
  { group: 'Travel', items: [
    { slug: 'soar', name: 'Soar', tag: 'Your AI travel companion',   url: 'https://www.joinsoar.co' },
    { slug: 'miso', name: 'Miso', tag: 'Books your travel by text', url: 'https://www.miso.com' },
  ]},
  { group: 'Dating & Social', items: [
    { slug: 'ditto',  name: 'Ditto',  tag: 'AI matchmaker on iMessage', url: 'https://ditto.ai' },
    { slug: 'series', name: 'Series', tag: 'Warm intros, by text',      url: 'https://series.so' },
    { slug: 'alfi',   name: 'Alfi',   tag: 'AI for the group chat',     url: 'https://www.text.ai' },
  ]},
  { group: 'Money', items: [
    { slug: 'flip', name: 'Flip', tag: 'Your money, by text', url: 'https://fliptexts.com' },
  ]},
  { group: 'Health', items: [
    { slug: 'bodybuddy', name: 'BodyBuddy', tag: 'AI health coach',        url: 'https://bodybuddy.app' },
    { slug: 'nudge',     name: 'Nudge',     tag: 'Daily fitness coaching', url: 'https://www.nudge.gs' },
  ]},
  { group: 'Careers', items: [
    { slug: 'clera', name: 'Clera', tag: 'Your AI talent agent', url: 'https://www.getclera.com' },
  ]},
];

const INFRA = [
  { group: 'APIs & Platforms', items: [
    { slug: 'linq',         name: 'Linq',         tag: 'Blue-bubble rails for agents', url: 'https://linqapp.com' },
    { slug: 'photon',       name: 'Photon',       tag: 'Deploy agents to iMessage',    url: 'https://photon.codes' },
    { slug: 'sendblue',     name: 'Sendblue',     tag: 'iMessage API, no Mac needed',  url: 'https://www.sendblue.com' },
    { slug: 'chert',        name: 'Chert',        tag: '“Twilio for iMessage”',        url: 'https://www.trychert.com' },
    { slug: 'loopmessage',  name: 'LoopMessage',  tag: 'iMessage API for business',    url: 'https://loopmessage.com' },
    { slug: 'blooio',       name: 'Blooio',       tag: 'Flat-rate iMessage API',       url: 'https://blooio.com' },
    { slug: 'tuco',         name: 'Tuco',         tag: 'iMessage on real iPhones',     url: 'https://tuco.ai' },
  ]},
  { group: 'Open source', items: [
    { slug: 'bluebubbles', name: 'BlueBubbles', tag: 'Open-source iMessage server', url: 'https://bluebubbles.app' },
  ]},
  { group: 'Apple official', items: [
    { slug: 'apple', name: 'Messages for Business', tag: 'Apple’s official agent lane', url: 'https://register.apple.com/resources/messages' },
  ]},
];

function logoFor(slug) {
  if (!fs.existsSync(LOGO_DIR)) return null;
  const f = fs.readdirSync(LOGO_DIR).find(n => n.replace(/\.[^.]+$/, '') === slug);
  return f ? 'assets/logos/' + f : null;
}
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function smsHref(slug) { return NUMBERS[slug] ? 'sms:' + NUMBERS[slug] : null; }

function card(it) {
  const logo = logoFor(it.slug);
  const icon = logo
    ? `<img src="${esc(logo)}" alt="${esc(it.name)} logo" loading="lazy" width="72" height="72">`
    : `<span class="letter">${esc(it.name[0])}</span>`;
  const sms = smsHref(it.slug);
  const msg = sms ? `\n        <a class="msg" href="${esc(sms)}">Text now</a>` : '';
  return `<div class="app">
        <a class="hit" href="${esc(it.url)}" target="_blank" rel="noopener">
          <span class="icon">${icon}</span>
          <span class="name">${esc(it.name)}</span>
          <span class="tag">${esc(it.tag)}</span>
        </a>${msg}
      </div>`;
}

function section(groups) {
  return groups.map(g => `
      <section class="vert">
        <h2>${esc(g.group)}</h2>
        <div class="grid">
          ${g.items.map(card).join('\n          ')}
        </div>
      </section>`).join('\n');
}

function featured(f) {
  const logo = logoFor(f.slug);
  const icon = logo ? `<img src="${esc(logo)}" alt="${esc(f.name)} logo" width="96" height="96">` : '';
  const sms = smsHref(f.slug);
  const cta = sms
    ? `<a class="btn primary" href="${esc(sms)}">Text Soar Now</a>\n          <a class="btn ghost" href="${esc(f.url)}" target="_blank" rel="noopener">Learn more</a>`
    : `<a class="btn primary" href="${esc(f.url)}" target="_blank" rel="noopener">Try Soar</a>`;
  return `
      <section class="spotlight">
        <div class="feat">
          <div class="feat-icon">${icon}</div>
          <div class="feat-body">
            <span class="feat-label">Featured</span>
            <h3 class="feat-name">${esc(f.name)}</h3>
            <p class="feat-tag">${esc(f.tag)}</p>
          </div>
          <div class="feat-cta">
          ${cta}
          </div>
        </div>
      </section>`;
}

const agentSlugs = new Set([FEATURED.slug, ...AGENTS.flatMap(g => g.items.map(i => i.slug))]);
const agentCount = agentSlugs.size; // distinct agents (Soar counted once across featured + Travel)
const infraCount = INFRA.reduce((n, g) => n + g.items.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>iMessage Agent Store</title>
<meta name="description" content="A map of the agents you can text on iOS and the rails behind them.">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<meta name="theme-color" content="#ffffff">
<meta property="og:type" content="website">
<meta property="og:url" content="https://textagent.store/">
<meta property="og:site_name" content="iMessage Agent Store">
<meta property="og:title" content="iMessage Agent Store">
<meta property="og:description" content="A map of the agents you can text on iOS and the rails behind them.">
<meta property="og:image" content="https://textagent.store/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="iMessage Agent Store">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="iMessage Agent Store">
<meta name="twitter:description" content="A map of the agents you can text on iOS and the rails behind them.">
<meta name="twitter:image" content="https://textagent.store/assets/og.png">
<style>
  :root{ --bg:#fff; --text:#1d1d1f; --sec:#6e6e73; --line:#d2d2d7; --fill:#f5f5f7; }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{margin:0;background:var(--bg);color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;line-height:1.45}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1000px;margin:0 auto;padding:0 22px}
  header{text-align:center;max-width:1000px;margin:0 auto;padding:104px 22px 0}
  .hero-msg{display:flex;justify-content:center;margin:0 0 34px}
  .bubble{display:inline-block;max-width:90%;
    background:#0a84ff;color:#fff;font-size:clamp(15px,2.2vw,17px);font-weight:500;line-height:1.25;
    padding:11px 19px;border-radius:22px;box-shadow:0 8px 22px rgba(10,132,255,.30);
    animation:pop .55s cubic-bezier(.22,1,.36,1) both}
  @keyframes pop{from{opacity:0;transform:translateY(9px) scale(.97)}to{opacity:1;transform:none}}
  h1{font-size:clamp(32px,6vw,52px);font-weight:600;letter-spacing:-0.03em;margin:0 0 14px;line-height:1.05}
  .sub{font-size:clamp(15px,2.4vw,19px);color:var(--sec);margin:0 auto;max-width:44ch}
  .sublink{color:var(--text);font-weight:600;text-decoration:underline;text-underline-offset:2px}
  .sublink:hover{opacity:.7}
  .segwrap{text-align:center}
  .seg{display:inline-flex;background:var(--fill);border-radius:980px;padding:3px;margin:38px auto 0;gap:2px}
  .seg button{appearance:none;border:0;background:transparent;color:var(--text);font:inherit;
    font-size:14px;font-weight:500;padding:8px 22px;border-radius:980px;cursor:pointer;transition:background .2s,box-shadow .2s}
  .seg button[aria-selected="true"]{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12);font-weight:600}
  main{padding:8px 0 60px}
  .view{display:none}
  .view.active{display:block;animation:fade .35s ease}
  @keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

  /* Featured spotlight */
  .spotlight{padding-top:40px}
  .feat{display:flex;align-items:center;gap:24px;background:var(--fill);border-radius:24px;padding:26px 28px}
  .feat-icon img{width:96px;height:96px;border-radius:22px;object-fit:cover;box-shadow:0 1px 6px rgba(0,0,0,.12);background:#fff;display:block}
  .feat-body{flex:1;min-width:0}
  .feat-label{font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--sec)}
  .feat-name{font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:5px 0 6px}
  .feat-tag{font-size:15px;color:var(--sec);margin:0;max-width:52ch}
  .feat-cta{display:flex;flex-direction:column;gap:9px;flex:none}
  .btn{display:inline-block;text-align:center;font-size:14px;font-weight:600;padding:11px 22px;border-radius:980px;white-space:nowrap;transition:opacity .2s,background .2s}
  .btn.primary{background:var(--text);color:#fff}
  .btn.primary:hover{opacity:.85}
  .btn.ghost{background:transparent;color:var(--text);border:1px solid var(--line)}
  .btn.ghost:hover{background:#fff}

  /* Grid + cards */
  .vert{padding-top:42px}
  .vert h2{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--sec);margin:0 0 20px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:34px 18px;align-items:start}
  .app{display:flex;flex-direction:column;align-items:center;gap:9px}
  .hit{display:flex;flex-direction:column;align-items:center;text-align:center;gap:11px;border-radius:18px;transition:transform .15s ease}
  .hit:hover{transform:translateY(-4px)}
  .icon{width:72px;height:72px;border-radius:16px;overflow:hidden;background:#fff;
    box-shadow:0 1px 5px rgba(0,0,0,.10);border:1px solid rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;flex:none}
  .icon img{width:100%;height:100%;object-fit:cover;display:block}
  .icon .letter{font-size:30px;font-weight:600;color:var(--sec)}
  .name{font-size:15px;font-weight:600;letter-spacing:-0.01em}
  .tag{font-size:12.5px;color:var(--sec);line-height:1.3;max-width:19ch;min-height:2.6em}
  .msg{font-size:11px;font-weight:600;color:#fff;background:var(--text);border-radius:980px;padding:5px 13px;letter-spacing:.01em;transition:opacity .2s}
  .msg:hover{opacity:.82}

  footer{text-align:center;padding:30px 0 64px;color:var(--sec);font-size:13px}
  footer .hr{height:1px;background:var(--line);max-width:1000px;margin:0 auto 28px}
  footer a{color:var(--text);font-weight:600}
  footer a:hover{opacity:.7}
  footer .muted{font-size:12px;margin-top:8px;color:var(--sec)}

  @media(max-width:600px){
    header{padding:68px 22px 0}
    .hero-msg{margin:0 0 26px}
    .feat{flex-direction:column;text-align:center;gap:16px;padding:24px 20px;border-radius:22px}
    .feat-tag{margin-left:auto;margin-right:auto}
    .feat-cta{width:100%}
    .btn{width:100%}
    .grid{grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:26px 10px}
    .icon{width:60px;height:60px;border-radius:14px}
    .name{font-size:14px}
    .tag{font-size:11.5px}
  }
</style>
</head>
<body>
  <header>
    <div class="hero-msg"><span class="bubble">Did you see the agent app store?</span></div>
    <h1>iMessage Agent Store</h1>
    <p class="sub">A map of the agents you can text on iOS and the rails behind them. Submit your agent <a class="sublink" href="https://docs.google.com/forms/d/e/1FAIpQLSc1O44cbRx6TxPGcqmDrTiEwnACY1mY4sGWcmPnNfIM9dMm3w/viewform?usp=dialog" target="_blank" rel="noopener">here</a>.</p>
    <div class="segwrap">
      <div class="seg" role="tablist" aria-label="View">
        <button role="tab" data-tab="agents" aria-selected="true">Agents</button>
        <button role="tab" data-tab="infra" aria-selected="false">Infrastructure</button>
      </div>
    </div>
  </header>

  <main class="wrap">
    <div class="view" id="agents" role="tabpanel">
${featured(FEATURED)}
${section(AGENTS)}
    </div>
    <div class="view" id="infra" role="tabpanel">
${section(INFRA)}
    </div>
  </main>

  <footer>
    <div class="hr"></div>
    <p>Made by <a href="https://x.com/stannostudio" target="_blank" rel="noopener">Stanley</a></p>
    <p class="muted">${agentCount} agents · ${infraCount} infrastructure providers · snapshot June 2026</p>
  </footer>

<script>
  var tabs = document.querySelectorAll('.seg button');
  var views = { agents: document.getElementById('agents'), infra: document.getElementById('infra') };
  function show(tab){
    tabs.forEach(function(x){ x.setAttribute('aria-selected', x.dataset.tab === tab); });
    Object.keys(views).forEach(function(k){ views[k].classList.toggle('active', k === tab); });
  }
  tabs.forEach(function(t){
    t.addEventListener('click', function(){ show(t.dataset.tab); history.replaceState(null, '', '#' + t.dataset.tab); });
  });
  var init = (location.hash || '#agents').slice(1);
  show(views[init] ? init : 'agents');
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
const all = [FEATURED, ...AGENTS.flatMap(g => g.items), ...INFRA.flatMap(g => g.items)];
const missing = all.filter(i => !logoFor(i.slug)).map(i => i.slug);
const texts = Object.keys(NUMBERS);
console.log('Wrote index.html — ' + agentCount + ' agents, ' + infraCount + ' infra.');
console.log(missing.length ? 'MISSING LOGOS: ' + missing.join(', ') : 'All logos present.');
console.log('Click-to-text enabled for: ' + (texts.length ? texts.join(', ') : 'none yet'));
