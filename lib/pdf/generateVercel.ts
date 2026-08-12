import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

export interface GeneratePdfOptions {
  resumeId: string;
  baseUrl: string;
  cookieHeader: string;
}

async function chromiumPath(chromium: typeof import('@sparticuz/chromium').default) {
  const configured = process.env.CHROME_EXECUTABLE_PATH;
  if (configured && fs.existsSync(configured)) return configured;

  const tracedBin = path.join(process.cwd(), 'node_modules', '@sparticuz', 'chromium', 'bin');
  if (fs.existsSync(tracedBin)) {
    try {
      return await chromium.executablePath(tracedBin);
    } catch (error) {
      console.warn('[PDF] traced Chromium path failed; using package resolver', error);
    }
  }

  return await chromium.executablePath();
}

export async function generateResumePdf({ resumeId, baseUrl, cookieHeader }: GeneratePdfOptions): Promise<Buffer> {
  const requestId = `pdf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const startedAt = Date.now();
  let stage = 'initializing';
  let browser: import('puppeteer-core').Browser | null = null;

  console.info('[PDF]', requestId, 'generation started', { resumeId });

  try {
    const puppeteer = (await import('puppeteer-core')).default;
    const chromium = (await import('@sparticuz/chromium')).default;
    chromium.setGraphicsMode = false;

    stage = 'browser-launch';
    const executablePath = await chromiumPath(chromium);
    if (!executablePath || !fs.existsSync(executablePath)) {
      throw new Error(`Chromium executable was not found: ${executablePath || 'empty path'}`);
    }

    const args = await puppeteer.defaultArgs({
      args: chromium.args,
      headless: 'shell',
    });

    browser = await puppeteer.launch({
      args,
      defaultViewport: { width: 1240, height: 1754, deviceScaleFactor: 1 },
      executablePath,
      headless: 'shell',
      timeout: 30_000,
    });

    stage = 'page-create';
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(35_000);
    page.setDefaultTimeout(20_000);

    const url = new URL(`/resume/${encodeURIComponent(resumeId)}/print`, baseUrl);

    // Keep the exact browser session cookie header. This is more reliable for
    // Supabase SSR cookies than reconstructing individual cookies by hand.
    if (cookieHeader) {
      await page.setExtraHTTPHeaders({ Cookie: cookieHeader });
    }

    stage = 'page-load';
    const response = await page.goto(url.toString(), {
      waitUntil: 'domcontentloaded',
      timeout: 35_000,
    });

    if (!response) {
      throw new Error('The print page did not return a response.');
    }

    const status = response.status();
    if (status < 200 || status >= 300) {
      throw new Error(`Print page returned HTTP ${status}.`);
    }

    const finalUrl = page.url();
    const expectedPath = `/resume/${encodeURIComponent(resumeId)}/print`;
    if (new URL(finalUrl).pathname !== expectedPath) {
      throw new Error(`Print page redirected to ${new URL(finalUrl).pathname}.`);
    }

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

    if (pdf.length < 5) throw new Error('Generated PDF is empty.');
    if (pdf.subarray(0, 5).toString() !== '%PDF-') throw new Error('Generated PDF failed signature validation.');

    console.info('[PDF]', requestId, 'generation completed', {
      bytes: pdf.length,
      durationMs: Date.now() - startedAt,
    });
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
    if (browser) {
      for (const openPage of await browser.pages()) {
        await openPage.close().catch(() => undefined);
      }
      await browser.close().catch(() => undefined);
    }
  }
}
