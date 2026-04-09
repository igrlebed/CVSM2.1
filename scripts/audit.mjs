import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL || 'http://localhost:3001';

function url(path) {
  return `${baseURL}${path}`;
}

async function waitForAppReady(page) {
  await page.waitForLoadState('domcontentloaded');
  // Give client components a beat to hydrate.
  await page.waitForTimeout(250);
}

async function collectPageProblems(page, contextLabel) {
  const problems = [];

  // Next.js dev tooling uses `nextjs-portal` even when healthy, so we look for
  // explicit runtime error UI instead of the portal container.
  const nextRuntimeError = page.getByText(/unhandled runtime error/i);
  if (await nextRuntimeError.count()) {
    problems.push(`${contextLabel}: Unhandled runtime error visible`);
  }

  const applicationErrorText = page.getByText(/application error/i);
  if (await applicationErrorText.count()) {
    problems.push(`${contextLabel}: "Application error" visible`);
  }

  const nextNotFound = page.getByText(/404|this page could not be found|not found/i);
  if (await nextNotFound.count()) {
    problems.push(`${contextLabel}: 404/Not Found visible`);
  }

  return problems;
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err?.message || String(err));
  });

  const results = [];
  const record = (name, status, details = {}) => {
    results.push({ name, status, ...details });
  };

  async function clickIfExists(locator, opts) {
    try {
      if (await locator.count()) {
        await locator.first().click(opts);
        return true;
      }
    } catch {
      // Ignore best-effort click failures; route checks will still catch hard breaks.
    }
    return false;
  }

  async function exerciseHeader() {
    // Right-side actions
    await clickIfExists(page.getByRole('button', { name: /поиск/i }));
    await clickIfExists(page.getByRole('button', { name: /экспорт/i }));

    // Role dropdown (toggle Analyst and back to LPR if possible)
    const roleButton = page.getByRole('button', { name: /лпр|аналитик/i });
    if (await clickIfExists(roleButton)) {
      await clickIfExists(page.getByRole('menuitem', { name: /аналитик/i }));
      await page.waitForTimeout(150);
      await clickIfExists(roleButton);
      await clickIfExists(page.getByRole('menuitem', { name: /лпр/i }));
    }
  }

  async function clickHeaderNav() {
    const items = ['Обзор сети', 'Карта сети', 'Проекты', 'Конструктор', 'Архив', 'Экспорт'];
    for (const name of items) {
      await clickIfExists(page.getByRole('link', { name: new RegExp(`^${name}$`, 'i') }));
      await waitForAppReady(page);
      await exerciseHeader();
    }
  }

  async function recordRouteHealth(routeName) {
    const problems = await collectPageProblems(page, routeName);
    return problems;
  }

  // ROUTE: /
  try {
    await page.goto(url('/'), { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    await exerciseHeader();

    // Click a route in "Ключевые маршруты" to open drawer.
    const firstRouteButton = page.locator('button', { hasText: /км/ }).first();
    await firstRouteButton.click();
    await page.waitForTimeout(250);

    // Click "Открыть проект" (should navigate to /projects/:id).
    const openProject = page.getByRole('link', { name: /открыть проект/i }).first();
    await openProject.click();
    await waitForAppReady(page);
    await exerciseHeader();
    await clickHeaderNav();

    const currentUrl = page.url();
    const is404 = await page.getByText(/404|not found/i).count();
    record('/', 'checked', { navigatedTo: currentUrl, is404: Boolean(is404), problems: await recordRouteHealth('/') });
  } catch (e) {
    record('/', 'fail', { error: e?.message || String(e) });
  }

  // ROUTE: /map
  try {
    await page.goto(url('/map'), { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);

    // Click a visible route path on the SVG if possible by clicking the first path with cursor-pointer.
    const routePath = page.locator('path.cursor-pointer').first();
    if (await routePath.count()) {
      await routePath.click({ position: { x: 5, y: 5 } }).catch(() => routePath.click());
      await page.waitForTimeout(250);
    }

    // Try clicking "Открыть проект" in right panel if present.
    const openProjectBtn = page.getByRole('link', { name: /открыть проект/i });
    if (await openProjectBtn.count()) {
      await openProjectBtn.first().click();
      await waitForAppReady(page);
    }
    record('/map', 'checked', { navigatedTo: page.url(), problems: await recordRouteHealth('/map') });
  } catch (e) {
    record('/map', 'fail', { error: e?.message || String(e) });
  }

  // ROUTE: /projects
  try {
    await page.goto(url('/projects'), { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);

    // Switch to Compare and Ranking tabs (if present).
    const compareTab = page.getByRole('button', { name: /сравнение/i });
    if (await compareTab.count()) await compareTab.first().click();
    await page.waitForTimeout(150);
    const rankingTab = page.getByRole('button', { name: /ранжирование/i });
    if (await rankingTab.count()) await rankingTab.first().click();
    await page.waitForTimeout(150);

    record('/projects', 'checked', { problems: await recordRouteHealth('/projects') });
  } catch (e) {
    record('/projects', 'fail', { error: e?.message || String(e) });
  }

  // ROUTE: /constructor
  try {
    await page.goto(url('/constructor'), { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    record('/constructor', 'checked', { problems: await recordRouteHealth('/constructor') });
  } catch (e) {
    record('/constructor', 'fail', { error: e?.message || String(e) });
  }

  // ROUTE: /archive
  try {
    await page.goto(url('/archive'), { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    record('/archive', 'checked', { problems: await recordRouteHealth('/archive') });
  } catch (e) {
    record('/archive', 'fail', { error: e?.message || String(e) });
  }

  // ROUTE: /export
  try {
    await page.goto(url('/export'), { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);
    record('/export', 'checked', { problems: await recordRouteHealth('/export') });
  } catch (e) {
    record('/export', 'fail', { error: e?.message || String(e) });
  }

  // Summarize problems
  const overlayProblems = await collectPageProblems(page, 'final');
  const summary = {
    baseURL,
    results,
    consoleErrors,
    pageErrors,
    overlayProblems,
  };

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(summary, null, 2));

  await browser.close();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

