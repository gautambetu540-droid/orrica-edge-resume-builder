import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

export interface GeneratePdfOptions {
  resumeId: string;
  baseUrl: string;
  cookieHeader: string;
}

function parseCookies(cookieHeader: string) {
  return cookieHeader
    .split(';')
    .map((pair) => {
      const index = pair.indexOf('=');
      if (index <= 0) return null;
      const name = pair.slice(0, index).trim();
      const value = pair.slice(index + 1).trim();
      return name ? { name, value } : null;
    })
    .filter((cookie): cookie is { name: string; value: string } => Boolean(cookie));
}

async function chromiumPath(chromium: typeof import('@sparticuz/chromium').default) {
  if (process.env.CHROME_EXECUTABLE_PATH) return process.env.CHROME_EXECUTABLE_PATH;
  const tracedBin = path.join(process.cwd(), 'node_modules', '@sparticuz', 'chromium', 'bin');
  if (fs.existsSync(tracedBin)) return chromium.executablePath(tracedBin);
  return chromium.executablePath();
}

export async function generateResumePdf({ resumeId, baseUrl, cookieHeader }: GeneratePdfOptions): Promise<Buffer> {
  const requestId = `pdf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = Date.now();
  let stage = 'initializing';
  console.info('[PDF]', requestId, 'generation started', { resumeId });

  const puppeteer = await import('puppeteer-core');
  const chromium = (await import('@sparticuz/chromium')).default;
  chromium.setGraphicsMode = false;

  stage = 'browser-launch';
  console.info('[PDF]', requestId, 'launching Chromium');
  const executablePath = await chromiumPath(chromium);
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 1 },
    executablePath,
    headless: true,
    timeout: 30_000,
  });

  try {
    stage = 'page-create';
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30_000);
    page.setDefaultTimeout(20_000);
    console.info('[PDF]', requestId, 'page created');

    const url = new URL(`/resume/${encodeURIComponent(resumeId)}/print`, baseUrl);
    const cookies = parseCookies(cookieHeader).map(({ name, value }) => ({
      name,
      value,
      url: url.origin,
      path: '/',
      secure: url.protocol === 'https:',
    }));
    if (cookies.length) await page.setCookie(...cookies);

    stage = 'page-load';
    // Do not wait for networkidle0: analytics, preloads and other long-lived
    // requests can keep a Vercel print page open indefinitely. The dedicated
    // print page is server-rendered, so DOMContentLoaded is the reliable gate.
    await page.goto(url.toString(), {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });
    console.info('[PDF]', requestId, 'URL loaded', { finalUrl: page.url() });

    stage = 'resume-render';
    await page.waitForSelector('#resume-document-root', { timeout: 15_000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await Promise.all(Array.from(document.images).map((image) => (
        image.complete
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true });
              image.addEventListener('error', () => resolve(), { once: true });
            })
      )));
      await new Promise((resolve) => window.setTimeout(resolve, 150));
    });
    console.info('[PDF]', requestId, 'fonts and images ready');

    stage = 'pdf-generation';
    await page.emulateMediaType('print');
    const pdf = Buffer.from(await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      scale: 1,
    }));

    if (pdf.length === 0) throw new Error('Generated PDF is empty.');
    if (pdf.subarray(0, 4).toString() !== '%PDF') throw new Error('Generated PDF failed signature validation.');

    console.info('[PDF]', requestId, 'generation completed', { bytes: pdf.length, durationMs: Date.now() - startedAt });
    return pdf;
  } catch (error) {
    console.error('[PDF]', requestId, 'generation failed', {
      resumeId,
      stage,
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  } finally {
    for (const openPage of await browser.pages()) await openPage.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
  }
}
