import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL || 'http://localhost:3001';

const targets = [
  { path: '/', name: 'overview' },
  { path: '/map', name: 'map' },
];

const viewports = [
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

async function run() {
  const browser = await chromium.launch();

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: vp });
    const page = await context.newPage();

    const consoleErrors = [];
    page.on('console', (m) => {
      if (m.type() === 'error') consoleErrors.push(m.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(err?.message || String(err)));

    for (const t of targets) {
      await page.goto(`${baseURL}${t.path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      const file = `layout-${t.name}-${vp.width}x${vp.height}.png`;
      await page.screenshot({ path: file, fullPage: true });

      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify(
          {
            viewport: vp,
            path: t.path,
            screenshot: file,
            consoleErrors,
          },
          null,
          2,
        ),
      );
    }

    await context.close();
  }

  await browser.close();
}

run().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

