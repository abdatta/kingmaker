// Record a screen capture walking through the first two README features:
//   1. Dashboard — what needs your attention right now
//   2. Discovery Agent — what was filtered out, and why
//
// Playwright's video recorder captures the page surface only — the real OS
// cursor isn't in it. So we inject a fake cursor (an SVG that mirrors the
// macOS pointer) and animate it along eased Bezier curves between targets to
// fake human-feeling motion. The OS pointer is also moved in lockstep so
// :hover states fire.
//
// Usage: dev server must be running (npm run dev), then
//   node scripts/record-demo.mjs
//
// Output:
//   media/01-dashboard-discovery-agent.webm  (Playwright native)
//   media/01-dashboard-discovery-agent.mp4   (if ffmpeg is on PATH)

import { chromium } from 'playwright';
import { mkdir, readdir, rename, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const BASE = process.env.RECORD_BASE || 'http://localhost:5173';
const OUT_DIR = path.resolve('media');
const RAW_DIR = path.join(OUT_DIR, '.raw');
const NAME = '01-dashboard-discovery-agent';

const VIEWPORT = { width: 1440, height: 900 };
const TRIM_LEADIN_SECONDS = 3.5;

// ── Cursor injection ────────────────────────────────────────────────────────

const CURSOR_INIT_JS = `
  (() => {
    if (window.__demoCursor) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', () => __installCursor());
      return;
    }
    __installCursor();
    function __installCursor() {
    const NS = 'http://www.w3.org/2000/svg';
    const wrap = document.createElement('div');
    wrap.id = '__demo_cursor';
    Object.assign(wrap.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '24px',
      height: '24px',
      pointerEvents: 'none',
      zIndex: '2147483647',
      transform: 'translate(720px, 450px)',
      filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))',
      willChange: 'transform',
    });
    wrap.innerHTML = \`
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="\${NS}">
        <path d="M5.5 3.21V20.79l4.7-4.7 2.27 5.48 2.54-1.05-2.26-5.45L19 14.78z"
              fill="#ffffff" stroke="#0f172a" stroke-width="1.4"
              stroke-linejoin="round" stroke-linecap="round"/>
      </svg>\`;
    document.body.appendChild(wrap);
    let curX = 720, curY = 450;
    window.__demoCursor = {
      set(x, y) {
        curX = x; curY = y;
        wrap.style.transform = \`translate(\${x}px, \${y}px)\`;
      },
      get() { return { x: curX, y: curY }; },
      ripple(x, y) {
        const r = document.createElement('div');
        Object.assign(r.style, {
          position: 'fixed',
          left: (x - 14) + 'px',
          top: (y - 14) + 'px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '2px solid rgba(34,211,238,0.95)',
          background: 'rgba(34,211,238,0.15)',
          pointerEvents: 'none',
          zIndex: '2147483646',
          transform: 'scale(0.4)',
          opacity: '1',
        });
        document.body.appendChild(r);
        r.animate(
          [
            { transform: 'scale(0.4)', opacity: 1 },
            { transform: 'scale(1.6)', opacity: 0 },
          ],
          { duration: 450, easing: 'ease-out' }
        ).onfinish = () => r.remove();
      },
    };
    }
  })();
`;

async function injectCursor(page) {
  // Re-inject on every navigation so the cursor survives page changes.
  await page.addInitScript(CURSOR_INIT_JS);
  // Also inject into the already-loaded page if it exists.
  if (page.url() !== 'about:blank') {
    await page.evaluate(CURSOR_INIT_JS).catch(() => {});
  }
}

// ── Human-feeling movement ──────────────────────────────────────────────────
//
// Move both the injected DOM cursor and Playwright's mouse along a quadratic
// Bezier with a perpendicular control offset and easeInOutCubic timing.

const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

async function moveTo(page, x, y, { duration = 700, curveStrength = 0.18 } = {}) {
  const start = await page.evaluate(() => window.__demoCursor.get());
  const dx = x - start.x;
  const dy = y - start.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return;

  // Control point perpendicular to the straight path, with a tiny
  // randomized offset so repeats don't look mechanical.
  const sign = (Math.abs(start.x - x) > Math.abs(start.y - y) ? 1 : -1) *
    (Math.random() > 0.5 ? 1 : -1);
  const off = dist * curveStrength * sign;
  const perpX = (-dy / dist) * off;
  const perpY = (dx / dist) * off;
  const ctrlX = (start.x + x) / 2 + perpX;
  const ctrlY = (start.y + y) / 2 + perpY;

  const steps = Math.max(18, Math.floor(dist / 9));
  const stepMs = Math.max(8, duration / steps);

  for (let i = 1; i <= steps; i++) {
    const t = easeInOutCubic(i / steps);
    const bx = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * ctrlX + t * t * x;
    const by = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * ctrlY + t * t * y;
    await page.evaluate(([bx, by]) => window.__demoCursor.set(bx, by), [bx, by]);
    await page.mouse.move(bx, by);
    await page.waitForTimeout(stepMs);
  }
}

async function moveToLocator(page, locator, opts = {}) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  const box = await locator.boundingBox();
  if (!box) return;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await moveTo(page, x, y, opts);
  return { x, y };
}

async function clickAt(page, x, y) {
  await page.evaluate(([x, y]) => window.__demoCursor.ripple(x, y), [x, y]);
  await page.mouse.down();
  await page.waitForTimeout(60);
  await page.mouse.up();
}

async function clickLocator(page, locator, opts = {}) {
  const pos = await moveToLocator(page, locator, opts);
  if (!pos) return;
  await clickAt(page, pos.x, pos.y);
}

// ── FFmpeg helpers ──────────────────────────────────────────────────────────

async function ffmpegRun(args) {
  // shell:true lets Windows resolve `ffmpeg` via PATHEXT (.exe/.cmd shims)
  // without us needing to know the binary's exact filename.
  return new Promise((resolve) => {
    const proc = spawn('ffmpeg', args, { stdio: 'ignore', shell: true });
    proc.on('exit', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}

async function ffmpegConvert(srcWebm, dstMp4, { trimStart = 0 } = {}) {
  const args = ['-y'];
  if (trimStart > 0) args.push('-ss', String(trimStart));
  args.push(
    '-i', srcWebm,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-crf', '23',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    dstMp4
  );
  return ffmpegRun(args);
}

async function ffmpegTrimWebm(srcWebm, dstWebm, { trimStart = 0 } = {}) {
  const args = ['-y'];
  if (trimStart > 0) args.push('-ss', String(trimStart));
  args.push('-i', srcWebm, '-c:v', 'copy', dstWebm);
  return ffmpegRun(args);
}

// ── Recording ───────────────────────────────────────────────────────────────

(async () => {
  await mkdir(RAW_DIR, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    recordVideo: { dir: RAW_DIR, size: VIEWPORT },
  });
  const page = await ctx.newPage();
  await injectCursor(page);

  // ── Beat 1: dashboard cold open ───────────────────────────────────────────
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForSelector('text=Good morning, Ryan');
  // Ensure the cursor is in the page even if the init-script raced the body.
  await page.evaluate(CURSOR_INIT_JS);
  await page.waitForFunction(() => !!window.__demoCursor);
  await page.waitForTimeout(900);

  // Drift the cursor over to the headline as if reading
  await moveTo(page, 420, 120, { duration: 800 });
  await page.waitForTimeout(500);

  // ── Beat 2: Needs your attention ──────────────────────────────────────────
  await moveToLocator(page, page.locator('text=Needs your attention').first(), {
    duration: 700,
  });
  await page.waitForTimeout(600);

  const topItem = page.locator('text=Q&A questions + Tier 1 city LOI').first();
  await moveToLocator(page, topItem, { duration: 650 });
  await page.waitForTimeout(700);

  // ── Beat 3: Discovery Agent panel ─────────────────────────────────────────
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(700);

  await moveToLocator(
    page,
    page.locator('text=Discovery agent · last 24 hours').first(),
    { duration: 700 }
  );
  await page.waitForTimeout(550);

  for (const stat of ['47', '3', '44']) {
    await moveToLocator(page, page.locator(`text=${stat}`).first(), {
      duration: 500,
    });
    await page.waitForTimeout(450);
  }

  // ── Beat 4: expand the filter log ─────────────────────────────────────────
  const expandBtn = page.locator('text=View filter log').first();
  await clickLocator(page, expandBtn, { duration: 600 });
  await page.waitForTimeout(1100);

  // Walk down the filter log entries one at a time
  const logRows = [
    'USDOT 26-FR1',
    'USDOT 26-PH2',
    'USDOT 26-FT1',
    'SAM.gov',
    'DOD SBIR AF254-D012',
  ];
  for (const text of logRows) {
    const row = page.locator(`text=/${text}/i`).first();
    if ((await row.count()) === 0) continue;
    await moveToLocator(page, row, { duration: 520 });
    await page.waitForTimeout(450);
  }

  await page.waitForTimeout(900);

  // ── Beat 5: clean closing frame ───────────────────────────────────────────
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await moveTo(page, 720, 400, { duration: 700 });
  await page.waitForTimeout(900);

  await ctx.close();
  await browser.close();

  // ── Post-process: trim + transcode ────────────────────────────────────────
  const entries = await readdir(RAW_DIR);
  const raw = entries.find((f) => f.endsWith('.webm'));
  if (!raw) throw new Error('No .webm produced');
  const rawPath = path.join(RAW_DIR, raw);

  const webmPath = path.join(OUT_DIR, `${NAME}.webm`);
  const mp4Path = path.join(OUT_DIR, `${NAME}.mp4`);

  const webmOk = await ffmpegTrimWebm(rawPath, webmPath, {
    trimStart: TRIM_LEADIN_SECONDS,
  });
  if (webmOk) console.log(`✓ ${webmPath}`);
  else {
    await rename(rawPath, webmPath);
    console.log(`✓ ${webmPath} (untrimmed — ffmpeg unavailable)`);
  }

  const mp4Ok = await ffmpegConvert(rawPath, mp4Path, {
    trimStart: TRIM_LEADIN_SECONDS,
  });
  if (mp4Ok) console.log(`✓ ${mp4Path}`);
  else console.log('(ffmpeg not found — skipped mp4 transcode)');

  await rm(RAW_DIR, { recursive: true, force: true });
})();
