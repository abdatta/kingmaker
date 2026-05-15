// Capture README screenshots of each major view.
// Usage: dev server must be running (npm run dev), then `node scripts/screenshots.mjs`.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.env.SCREENSHOT_BASE || 'http://localhost:5173';
const OUT = path.resolve('screenshots');

const shots = [
  { name: '01-dashboard', path: '/' },
  { name: '02-budget-before', path: '/opp/alias-tx/budget' },
  {
    name: '03-budget-after-trim',
    path: '/opp/alias-tx/budget',
    interact: async (page) => {
      // Click the "Accept · trim 2%" button inside the inline budget banner.
      await page.getByRole('button', { name: /Accept · trim 2%/i }).click();
      await page.waitForTimeout(400);
    },
  },
  { name: '04-assembly', path: '/opp/alias-tx/assembly' },
  { name: '05-compliance', path: '/opp/alias-tx/submission' },
  { name: '06-presol-triage', path: '/opp/usdot-os2/triage' },
  { name: '07-pipeline', path: '/pipeline' },
];

(async () => {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  for (const s of shots) {
    const url = `${BASE}${s.path}`;
    process.stdout.write(`→ ${s.name}: ${url}\n`);
    await page.goto(url, { waitUntil: 'networkidle' });
    // Give fonts + recharts a beat to settle.
    await page.waitForTimeout(800);
    if (s.interact) await s.interact(page);
    await page.screenshot({
      path: path.join(OUT, `${s.name}.png`),
      fullPage: false,
    });
  }

  await browser.close();
  console.log(`Done. ${shots.length} screenshots → ${OUT}`);
})();
