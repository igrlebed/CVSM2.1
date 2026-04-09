import { chromium } from 'playwright';

const baseURL = process.env.BASE_URL || 'http://localhost:3001';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleMessages = [];
  const pageErrors = [];
  const requestFailures = [];
  const badResponses = [];
  page.on('console', (msg) => consoleMessages.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', (err) =>
    pageErrors.push({
      message: err?.message || String(err),
      stack: err?.stack || null,
    }),
  );
  page.on('requestfailed', (req) => {
    requestFailures.push({
      url: req.url(),
      method: req.method(),
      failure: req.failure()?.errorText || null,
    });
  });
  page.on('response', async (res) => {
    try {
      const status = res.status();
      if (status >= 400) {
        const u = res.url();
        badResponses.push({ url: u, status });
      }
    } catch {
      // ignore
    }
  });

  const resp = await page.goto(`${baseURL}/constructor`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  const before = {
    url: page.url(),
    httpStatus: resp?.status?.() ?? null,
    hasChoosePrompt: await page.getByText('Выберите сценарий').count(),
    hasSidebarTitle: await page.getByText('Сценарии').first().count(),
    hasConstructorTitle: await page.getByRole('heading', { name: 'Конструктор' }).count(),
    bodyInnerTextSample: await page.evaluate(() => document.body?.innerText?.slice(0, 600) || ''),
  };

  // Click the first scenario card by clicking the first card-like element.
  // We target the first card containing any of the known scenario names.
  // Prefer the scenario name inside the card (rendered as <span>), not the section header label.
  const scenarioName = page.locator('span', { hasText: /Базовый|Альтернатива 1|Альтернатива 2|Архивный сценарий|Черновик/ }).first();
  const clickAttempt = { found: await scenarioName.count(), clicked: false, error: null };
  if (clickAttempt.found) {
    try {
      await scenarioName.click({ timeout: 5000, force: true });
      clickAttempt.clicked = true;
      await page.waitForTimeout(300);
    } catch (e) {
      clickAttempt.error = e?.message || String(e);
    }
  }

  const after = {
    url: page.url(),
    hasChoosePrompt: await page.getByText('Выберите сценарий').count(),
    // Editor contains an <input> with value = scenario.name; easiest signal is the heading h1 showing scenario name.
    toolbarTitleText: (await page.locator('h1').first().textContent())?.trim() || null,
    editorNameInputCount: await page.locator('input[value]').count(),
    hasActionsPanel: await page.getByText('Действия').count(),
    clickAttempt,
  };

  // Basic action sanity: open History and go back.
  const historyAttempt = { opened: false, backToEdit: false, error: null };
  try {
    const historyBtn = page.getByRole('button', { name: /история/i });
    if (await historyBtn.count()) {
      await historyBtn.first().click({ timeout: 5000 });
      await page.waitForTimeout(200);
      historyAttempt.opened = (await page.getByRole('heading', { name: /история версий/i }).count()) > 0;
      const backBtn = page.locator('button').filter({ has: page.locator('svg.lucide-arrow-left') }).first();
      if (await backBtn.count()) {
        await backBtn.click({ timeout: 5000 });
        await page.waitForTimeout(200);
        historyAttempt.backToEdit = ((await page.locator('h1').first().textContent())?.trim() || '') === after.toolbarTitleText;
      }
    }
  } catch (e) {
    historyAttempt.error = e?.message || String(e);
  }

  // Screenshot for manual inspection if needed
  const screenshotPath = 'constructor-debug.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        baseURL,
        before,
        after,
        historyAttempt,
        pageErrors,
        requestFailures,
        badResponses,
        consoleErrors: consoleMessages.filter((m) => m.type === 'error'),
        screenshotPath,
      },
      null,
      2,
    ),
  );

  await browser.close();
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

