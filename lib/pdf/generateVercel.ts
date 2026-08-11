import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

export interface GeneratePdfOptions {
  resumeId: string;
  baseUrl: string;
  cookieHeader: string;
}

function parseCookies(cookieHeader: string) {
  return cookieHeader.split(';').map((pair) => {
    const index = pair.indexOf('=');
    if (index <= 0) return null;
    const name = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();
    return name ? { name, value } : null;
  }).filter((cookie): cookie is { name: string; value: string } => Boolean(cookie));
}

async function chromiumPath(chromium: typeof import('@sparticuz/chromium').default) {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;
  const tracedBin = path.join(process.cwd(), 'node_modules', '@sparticuz', 'chromium', 'bin');
  if (fs.existsSync(tracedBin)) return chromium.executablePath(tracedBin);
  return chromium.executablePath();
}

export async function generateResumePdf({ resumeId, baseUrl, cookieHeader }: GeneratePdfOptions): Promise<Buffer> {
  const puppeteer = await import('puppeteer-core');
  const chromium = (await import('@sparticuz/chromium')).default;
  chromium.setGraphicsMode = false;

  const browser = await puppeteer.launch({
    args: await puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' }),
    defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 1 },
    executablePath: await chromiumPath(chromium),
    headless: 'shell',
  });

  try {
    const page = await browser.newPage();
    const url = new URL(`/resume/${encodeURIComponent(resumeId)}/print`, baseUrl);
    const cookies = parseCookies(cookieHeader).map(({ name, value }) => ({ name, value, domain: url.hostname, path: '/' }));
    if (cookies.length) await page.setCookie(...cookies);

    await page.goto(url.toString(), { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForSelector('#resume-document-root', { timeout: 15_000 });
    await page.evaluate(async () => { if (document.fonts?.ready) await document.fonts.ready; });
    await page.emulateMediaType('print');

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter: false,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    return Buffer.from(pdf);
  } finally {
    for (const page of await browser.pages()) await page.close().catch(() => undefined);
    await browser.close();
  }
}
