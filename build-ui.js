const fs = require('fs');
fs.writeFileSync('public/css/base.css', \@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');
:root {
  --bg-base: #ffffff;
  --card-bg: #f8f9fa;
  --input-bg: #f1f3f4;
  --border-default: #e9ecef;
  --border-subdued: rgba(0, 0, 0, 0.08);
  --text-main: #111827;
  --text-subdued: #6b7280;
  --fs-orange: #FF9933;
  --fs-pink: #FF3366;
  --fs-yellow: #FFD633;
  --fs-button-bg: #FFA000;
  --fs-button-hover: #FFB300;
  --brand-gradient: linear-gradient(90deg, var(--fs-yellow), var(--fs-orange), var(--fs-pink));
}
[data-theme='dark'] {
  --bg-base: #000000;
  --card-bg: #0A0A0A;
  --input-bg: #121212;
  --border-default: #2A2A2A;
  --border-subdued: rgba(255, 255, 255, 0.08);
  --text-main: #FFFFFF;
  --text-subdued: #A1A1AA;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: var(--bg-base);
  color: var(--text-main);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  display: flex;
  flex-direction: column;
}
h1, h2, h3, h4, h5, h6 { font-family: 'Google Sans', sans-serif; }
a { color: inherit; text-decoration: none; }
\);
fs.writeFileSync('public/css/layout.css', \.site-header { padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subdued); z-index: 10; position: relative; }
.brand-group { display: flex; align-items: center; gap: 1rem; }
.brand-group img { height: 28px; }
.header-nav { display: flex; align-items: center; gap: 1.5rem; }
.nav-link { font-size: 0.95rem; font-weight: 500; color: var(--text-subdued); transition: color 0.2s; }
.nav-link:hover { color: var(--text-main); }
.theme-toggle-btn { background: transparent; border: none; cursor: pointer; color: var(--text-subdued); display: flex; align-items: center; padding: 0.25rem; }
.theme-toggle-btn:hover { color: var(--text-main); }
.site-footer { padding: 2rem; border-top: 1px solid var(--border-subdued); display: flex; justify-content: space-between; align-items: center; margin-top: auto; font-size: 0.85rem; color: var(--text-subdued); }
.footer-links { display: flex; gap: 1rem; }
.footer-links a:hover { color: var(--text-main); }
.ambient-glow { position: fixed; top: 50%; left: 50%; width: 100vw; height: 100vh; transform: translate(-50%, -50%); background: radial-gradient(circle at 80% 70%, rgba(255, 153, 51, 0.06) 0%, transparent 40%); filter: blur(80px); z-index: 0; pointer-events: none; }\);
fs.writeFileSync('public/css/landing.css', \.landing-main { flex: 1; display: flex; flex-direction: column; align-items: center; padding: 6rem 2rem; text-align: center; z-index: 1; position: relative; }
.hero { max-width: 800px; margin-bottom: 4rem; }
.hero-title { font-size: 3.5rem; font-weight: 700; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.5rem; }
.hero-title .highlight { background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-subtitle { font-size: 1.25rem; color: var(--text-subdued); margin-bottom: 2.5rem; line-height: 1.6; }
.cta-button { background: var(--brand-gradient); color: #fff; padding: 0.8rem 2rem; border-radius: 99px; font-size: 1.1rem; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.2s, transform 0.2s; display: inline-block; }
.cta-button:hover { opacity: 0.9; transform: translateY(-1px); }
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1000px; width: 100%; }
.feature-card { background: var(--card-bg); padding: 2rem; border-radius: 12px; border: 1px solid var(--border-subdued); text-align: left; }
.feature-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; color: var(--text-main); }
.feature-card p { color: var(--text-subdued); font-size: 0.95rem; line-height: 1.5; }
\);
fs.writeFileSync('public/css/auth.css', \.auth-main { flex: 1; display: flex; justify-content: center; align-items: center; padding: 2rem; z-index: 1; position: relative; }
.auth-column { width: 100%; max-width: 400px; display: flex; flex-direction: column; }
.auth-brand { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.brand-separator { color: var(--text-subdued); font-size: 0.85rem; }
.auth-title { font-size: 2rem; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 0.5rem; font-family: 'Google Sans', sans-serif;}
.auth-subtitle { font-size: 1rem; color: var(--text-subdued); margin-bottom: 2rem; }
.auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
.input-group { display: flex; flex-direction: column; gap: 0.5rem; }
.input-wrapper { position: relative; background: var(--input-bg); border-radius: 8px; border: 1px solid var(--border-subdued); padding: 0.75rem 1rem; display: flex; align-items: center; transition: border-color 0.2s, box-shadow 0.2s; }
.input-wrapper:focus-within { border-color: var(--fs-orange); box-shadow: 0 0 0 1px var(--fs-orange); }
.input-wrapper input { background: transparent; border: none; color: var(--text-main); font-family: inherit; font-size: 0.95rem; outline: none; width: 100%; }
.auth-actions { display: flex; justify-content: flex-end; align-items: center; margin-top: -0.5rem; }
.forgot-link { font-size: 0.85rem; color: var(--text-subdued); }
.forgot-link:hover { color: var(--text-main); }
.submit-btn { background: var(--text-main); color: var(--bg-base); border: none; border-radius: 8px; padding: 0.85rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; margin-top: 0.5rem; }
.submit-btn:hover { opacity: 0.9; }
.google-btn { background: transparent; color: var(--text-main); border: 1px solid var(--border-subdued); border-radius: 8px; padding: 0.85rem; font-size: 1rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: background 0.2s; margin-top: 1rem; }
.google-btn:hover { background: var(--input-bg); }
.divider { display: flex; align-items: center; text-align: center; color: var(--text-subdued); font-size: 0.85rem; margin: 1.5rem 0; }
.divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid var(--border-subdued); }
.divider::before { margin-right: .5em; }
.divider::after { margin-left: .5em; }
.auth-footer-text { text-align: center; font-size: 0.85rem; color: var(--text-subdued); margin-top: 1.5rem; }
.auth-footer-text a { color: var(--text-main); font-weight: 500; }\);

