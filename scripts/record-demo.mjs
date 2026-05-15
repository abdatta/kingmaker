// Record a screen capture walking through the first two README features:
//   1. Dashboard — what needs your attention right now
//   2. Discovery Agent — what was filtered out, and why
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

// Tunables — bigger feels closer to a screencast, smaller is snappier.
const STEP = 700; // ms between beats
const REVEAL = 1400; // ms to linger on a freshly-shown surface

async function ffmpegConvert(webmPath, mp4Path, { trimStart = 0 } = {}) {
  // Playwright video recorder has a ~3s ramp before the rendered surface
  // hits the file; trimStart skips that blank lead-in.
  return new Promise((resolve) => {
    const args = ['-y'];
    if (trimStart > 0) args.push('-ss', String(trimStart));
    args.push(
      '-i', webmPath,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '23',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      mp4Path
    );
    const proc = spawn('ffmpeg', args, { stdio: 'ignore' });
    proc.on('exit', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}

async function ffmpegTrimWebm(srcWebm, dstWebm, { trimStart = 0 } = {}) {
  return new Promise((resolve) => {
    const args = ['-y'];
    if (trimStart > 0) args.push('-ss', String(trimStart));
    args.push('-i', srcWebm, '-c:v', 'copy', dstWebm);
    const proc = spawn('ffmpeg', args, { stdio: 'ignore' });
    proc.on('exit', (code) => resolve(code === 0));
    proc.on('error', () => resolve(false));
  });
}

const TRIM_LEADIN_SECONDS = 3.5;

(async () => {
  await mkdir(RAW_DIR, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1, // 1× keeps the video file small; Playwright doesn't HiDPI video anyway
    recordVideo: { dir: RAW_DIR, size: VIEWPORT },
  });
  const page = await ctx.newPage();

  // ── Beat 1: dashboard cold-open ──────────────────────────────────────────
  await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(REVEAL);

  // Hover the "Needs your attention" header to draw the eye there
  await page.locator('text=Needs your attention').first().hover();
  await page.waitForTimeout(STEP);

  // Hover the top approval-queue row (DARPA budget item)
  const topItem = page.locator('text=Q&A questions + Tier 1 city LOI').first();
  await topItem.scrollIntoViewIfNeeded();
  await topItem.hover();
  await page.waitForTimeout(STEP);

  // ── Beat 2: KPI strip + Discovery Agent panel ────────────────────────────
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(STEP);

  await page.locator('text=Discovery agent · last 24 hours').first().hover();
  await page.waitForTimeout(STEP);

  // Highlight the three stat numbers in turn
  for (const stat of ['47', '3', '44']) {
    await page.locator(`text=${stat}`).first().hover();
    await page.waitForTimeout(500);
  }

  // ── Beat 3: expand the filter log ───────────────────────────────────────
  const expandBtn = page.locator('text=View filter log').first();
  await expandBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(STEP);
  await expandBtn.click();
  await page.waitForTimeout(REVEAL);

  // Walk down the filter log entries
  const logRows = [
    'USDOT 26-FR1',
    'USDOT 26-PH2',
    'USDOT 26-FT1',
    'SAM.gov',
    'DOD SBIR AF254-D012',
  ];
  for (const text of logRows) {
    const row = page.locator(`text=/${text}/i`).first();
    if (await row.count()) {
      await row.scrollIntoViewIfNeeded();
      await row.hover();
      await page.waitForTimeout(550);
    }
  }

  await page.waitForTimeout(REVEAL);

  // ── Beat 4: scroll back up for a clean closing frame ─────────────────────
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await page.waitForTimeout(REVEAL);

  // Finalize — Playwright writes the video on context close.
  await ctx.close();
  await browser.close();

  // Identify the auto-named webm Playwright produced.
  const entries = await readdir(RAW_DIR);
  const raw = entries.find((f) => f.endsWith('.webm'));
  if (!raw) throw new Error('No .webm produced');
  const rawPath = path.join(RAW_DIR, raw);

  const webmPath = path.join(OUT_DIR, `${NAME}.webm`);
  const mp4Path = path.join(OUT_DIR, `${NAME}.mp4`);

  // Trim the blank ramp-in for both outputs.
  const webmOk = await ffmpegTrimWebm(rawPath, webmPath, { trimStart: TRIM_LEADIN_SECONDS });
  if (webmOk) console.log(`✓ ${webmPath}`);
  else {
    // Fall back to the untrimmed raw if ffmpeg lacks the codec for stream copy.
    await rename(rawPath, webmPath);
    console.log(`✓ ${webmPath} (untrimmed — ffmpeg unavailable)`);
  }

  const mp4Ok = await ffmpegConvert(rawPath, mp4Path, { trimStart: TRIM_LEADIN_SECONDS });
  if (mp4Ok) console.log(`✓ ${mp4Path}`);
  else console.log('(ffmpeg not found — skipped mp4 transcode)');

  await rm(RAW_DIR, { recursive: true, force: true });
})();
