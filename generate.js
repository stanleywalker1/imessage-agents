#!/usr/bin/env node
// Builds index.html from the company list + downloaded logos in assets/logos/.
// Ultra-minimal, Apple-style, 2 tabs (Agents by vertical / Infrastructure).
const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(__dirname, 'assets', 'logos');

// slug, name, tag (short, consumer-facing), url, and grouping
const AGENTS = [
  { group: 'Assistants', items: [
    { slug: 'poke',         name: 'Poke',         tag: 'Texting-first personal assistant', url: 'https://poke.com' },
    { slug: 'lindy',        name: 'Lindy',        tag: 'AI executive assistant',           url: 'https://www.lindy.ai' },
    { slug: 'caddy',        name: 'Caddy',        tag: 'Handles your work, by text',        url: 'https://caddy.app' },
    { slug: 'orchid',       name: 'Orchid',       tag: 'Runs your day',                     url: 'https://orchid.ai' },
    { slug: 'tomo',         name: 'Tomo',         tag: 'AI that lives in your texts',       url: 'https://www.tomo.ai' },
    { slug: 'martin',       name: 'Martin',       tag: 'A Jarvis you can text',             url: 'https://www.trymartin.com' },
    { slug: 'sidekicks',    name: 'Sidekicks',    tag: 'Text an AI on any phone',           url: 'https://sidekicks.chat' },
    { slug: 'ichatwithgpt', name: 'iChatWithGPT', tag: 'AI in iMessage, via Siri',          url: 'https://ichatwithgpt.com' },
  ]},
  { group: 'Travel', items: [
    { slug: 'soar', name: 'Soar', tag: 'Your AI travel advisor',  url: 'https://www.joinsoar.co' },
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
    { slug: 'agentmessage', name: 'AgentMessage', tag: 'Messaging built for agents',   url: 'https://agentmessage.io' },
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

function card(it) {
  const logo = logoFor(it.slug);
  const icon = logo
    ? `<span class="icon"><img src="${esc(logo)}" alt="${esc(it.name)} logo" loading="lazy" width="72" height="72"></span>`
    : `<span class="icon letter">${esc(it.name[0])}</span>`;
  return `<a class="app" href="${esc(it.url)}" target="_blank" rel="noopener">
        ${icon}
        <span class="name">${esc(it.name)}</span>
        <span class="tag">${esc(it.tag)}</span>
      </a>`;
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

const agentCount = AGENTS.reduce((n, g) => n + g.items.length, 0);
const infraCount = INFRA.reduce((n, g) => n + g.items.length, 0);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>iMessage Agents</title>
<meta name="description" content="The AI agents you can text, and the infrastructure behind them.">
<meta property="og:title" content="iMessage Agents">
<meta property="og:description" content="The AI agents you can text, and the infrastructure behind them.">
<style>
  :root{
    --bg:#fff; --text:#1d1d1f; --sec:#6e6e73; --line:#d2d2d7; --fill:#f5f5f7;
  }
  *{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{margin:0;background:var(--bg);color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;line-height:1.4}
  a{color:inherit;text-decoration:none}
  .wrap{max-width:1000px;margin:0 auto;padding:0 22px}
  header{text-align:center;padding:72px 0 0}
  h1{font-size:clamp(30px,5.4vw,46px);font-weight:600;letter-spacing:-0.025em;margin:0 0 12px}
  .sub{font-size:clamp(15px,2.4vw,19px);color:var(--sec);margin:0 auto;max-width:34ch}
  .segwrap{text-align:center}
  .seg{display:inline-flex;background:var(--fill);border-radius:980px;padding:3px;margin:36px auto 0;gap:2px}
  .seg button{appearance:none;border:0;background:transparent;color:var(--text);font:inherit;
    font-size:14px;font-weight:500;padding:8px 22px;border-radius:980px;cursor:pointer;transition:background .2s,box-shadow .2s}
  .seg button[aria-selected="true"]{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12);font-weight:600}
  main{padding:8px 0 70px}
  .view{display:none}
  .view.active{display:block;animation:fade .35s ease}
  @keyframes fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
  .vert{padding-top:40px}
  .vert h2{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--sec);margin:0 0 20px}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:34px 18px}
  .app{display:flex;flex-direction:column;align-items:center;text-align:center;gap:11px;padding:4px;border-radius:18px;transition:transform .15s ease}
  .app:hover{transform:translateY(-4px)}
  .icon{width:72px;height:72px;border-radius:16px;overflow:hidden;background:#fff;
    box-shadow:0 1px 5px rgba(0,0,0,.10);border:1px solid rgba(0,0,0,.06);display:flex;align-items:center;justify-content:center;flex:none}
  .icon img{width:100%;height:100%;object-fit:cover;display:block}
  .icon.letter{font-size:30px;font-weight:600;color:var(--sec);background:var(--fill)}
  .name{font-size:15px;font-weight:600;letter-spacing:-0.01em}
  .tag{font-size:12.5px;color:var(--sec);line-height:1.3;max-width:19ch}
  footer{text-align:center;padding:26px 0 70px;color:var(--sec);font-size:12px}
  footer .hr{height:1px;background:var(--line);max-width:1000px;margin:0 auto 26px}
  @media(max-width:600px){
    header{padding:46px 0 0}
    .grid{grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:26px 10px}
    .icon{width:60px;height:60px;border-radius:14px}
    .name{font-size:14px}
    .tag{font-size:11.5px}
  }
</style>
</head>
<body>
  <header class="wrap">
    <h1>iMessage Agents</h1>
    <p class="sub">The AI agents you can text, and the rails behind them.</p>
    <div class="segwrap">
      <div class="seg" role="tablist" aria-label="View">
        <button role="tab" data-tab="agents" aria-selected="true">Agents</button>
        <button role="tab" data-tab="infra" aria-selected="false">Infrastructure</button>
      </div>
    </div>
  </header>

  <main class="wrap">
    <div class="view" id="agents" role="tabpanel">
${section(AGENTS)}
    </div>
    <div class="view" id="infra" role="tabpanel">
${section(INFRA)}
    </div>
  </main>

  <footer>
    <div class="hr"></div>
    <p>${agentCount} agents · ${infraCount} infrastructure providers · snapshot June 2026</p>
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
const missing = [...AGENTS, ...INFRA].flatMap(g => g.items).filter(i => !logoFor(i.slug)).map(i => i.slug);
console.log('Wrote index.html — ' + agentCount + ' agents, ' + infraCount + ' infra.');
console.log(missing.length ? 'MISSING LOGOS: ' + missing.join(', ') : 'All logos present.');
