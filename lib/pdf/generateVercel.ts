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

    const args = await puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' });

    browser = await puppeteer.launch({
      args,
      defaultViewport: { width: 794, height: 1123, deviceScaleFactor: 1 },
      executablePath,
      headless: 'shell',
      timeout: 30_000,
    });

    stage = 'page-create';
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(35_000);
    page.setDefaultTimeout(20_000);
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    const url = new URL(`/resume/${encodeURIComponent(resumeId)}/print`, baseUrl);
    if (cookieHeader) await page.setExtraHTTPHeaders({ Cookie: cookieHeader });

    stage = 'page-load';
    const response = await page.goto(url.toString(), { waitUntil: 'networkidle0', timeout: 35_000 });
    if (!response) throw new Error('The print page did not return a response.');

    const status = response.status();
    if (status < 200 || status >= 300) throw new Error(`Print page returned HTTP ${status}.`);

    const finalUrl = page.url();
    const expectedPath = `/resume/${encodeURIComponent(resumeId)}/print`;
    if (new URL(finalUrl).pathname !== expectedPath) {
      throw new Error(`Print page redirected to ${new URL(finalUrl).pathname}.`);
    }

    stage = 'resume-render';
    await page.waitForSelector('#resume-document-root', { timeout: 15_000 });
    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
      await Promise.all(
        Array.from(document.images).map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.addEventListener('load', () => resolve(), { once: true });
                image.addEventListener('error', () => resolve(), { once: true });
              }),
        ),
      );

      const root = document.getElementById('resume-document-root');
      if (!root) throw new Error('Resume document root was not found.');

      root.style.setProperty('width', '210mm', 'important');
      root.style.setProperty('max-width', '210mm', 'important');
      root.style.setProperty('min-width', '210mm', 'important');
      root.style.setProperty('box-sizing', 'border-box', 'important');
      root.style.setProperty('background', '#ffffff', 'important');

      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.background = '#ffffff';

      const style = document.createElement('style');
      style.id = 'orrica-pdf-pagination-fix';
      style.textContent = `
        @page { size: A4; margin: 0; }
        html, body {
          width: 210mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          overflow: visible !important;
        }
        #resume-document-root {
          position: relative !important;
          width: 210mm !important;
          min-width: 210mm !important;
          max-width: 210mm !important;
          min-height: 0 !important;
          height: auto !important;
          margin: 0 !important;
          overflow: visible !important;
          break-before: auto !important;
          break-after: auto !important;
          break-inside: auto !important;
          page-break-before: auto !important;
          page-break-after: auto !important;
          page-break-inside: auto !important;
        }
        #resume-document-root .resume-print-header {
          position: static !important;
          top: auto !important;
          right: auto !important;
          bottom: auto !important;
          left: auto !important;
          float: none !important;
          transform: none !important;
          break-before: auto !important;
          break-after: avoid-page !important;
          page-break-before: auto !important;
          page-break-after: avoid !important;
        }
        #resume-document-root .resume-sections-stack {
          display: block !important;
        }
        #resume-document-root .resume-sections-stack > [data-resume-section] {
          display: block !important;
          break-inside: auto !important;
          page-break-inside: auto !important;
        }
        #resume-document-root [data-resume-entry],
        #resume-document-root .break-inside-avoid,
        #resume-document-root .break-inside-avoid-page,
        #resume-document-root .avoid-page-break {
          break-inside: avoid !important;
          page-break-inside: avoid !important;
        }
        #resume-document-root [data-resume-section] > h1,
        #resume-document-root [data-resume-section] > h2,
        #resume-document-root [data-resume-section] > h3,
        #resume-document-root [data-resume-section] .section-heading {
          break-after: avoid-page !important;
          page-break-after: avoid !important;
        }
        #resume-document-root h1,
        #resume-document-root h2,
        #resume-document-root h3,
        #resume-document-root p,
        #resume-document-root li {
          orphans: 3 !important;
          widows: 3 !important;
        }
        #resume-document-root * {
          max-height: none !important;
        }
      `;
      document.head.appendChild(style);

      void root.offsetHeight;
      await new Promise((resolve) => window.setTimeout(resolve, 350));
    });

    stage = 'pdf-generation';
    await page.emulateMediaType('print');

    // Let Chromium perform the actual A4 pagination. If it would leave a very
    // sparse final page, compact the print-only layout and measure again.
    // This avoids the old approach of moving an entire section with a forced
    // page break, which produced large blank areas on page 2.
    await page.evaluate(async () => {
      const root = document.getElementById('resume-document-root') as HTMLElement | null;
      if (!root) return;

      const A4_HEIGHT_PX = 1122.52;
      const sections = Array.from(
        root.querySelectorAll<HTMLElement>('.resume-sections-stack > [data-resume-section]'),
      );

      const getPagination = () => {
        const rootRect = root.getBoundingClientRect();
        const contentBottom = Math.max(
          root.scrollHeight,
          ...sections.map((section) => section.getBoundingClientRect().bottom - rootRect.top),
        );
        const pageCount = Math.max(1, Math.ceil(contentBottom / A4_HEIGHT_PX));
        if (pageCount < 2) return { pageCount, lastPageFill: 1 };

        const lastPageStart = (pageCount - 1) * A4_HEIGHT_PX;
        const lastPageBottom = Math.max(
          ...sections
            .filter((section) => section.getBoundingClientRect().bottom - rootRect.top > lastPageStart)
            .map((section) => section.getBoundingClientRect().bottom - rootRect.top),
          lastPageStart,
        );

        return {
          pageCount,
          lastPageFill: Math.max(0, Math.min(1, (lastPageBottom - lastPageStart) / A4_HEIGHT_PX)),
        };
      };

      const compactLevels = [0.94, 0.90];
      for (const factor of compactLevels) {
        const current = getPagination();
        if (current.pageCount < 2 || current.lastPageFill >= 0.48) break;

        const computed = getComputedStyle(root);
        const fontSize = parseFloat(computed.fontSize) || 12;
        const lineHeight = parseFloat(computed.lineHeight) || fontSize * 1.35;
        const sectionGap = parseFloat(computed.getPropertyValue('--section-gap')) || 16;
        const entryGap = parseFloat(computed.getPropertyValue('--entry-gap')) || 8;
        const headingScale = parseFloat(computed.getPropertyValue('--heading-scale')) || 1.15;
        const paddingTop = parseFloat(computed.paddingTop) || 0;
        const paddingBottom = parseFloat(computed.paddingBottom) || 0;

        root.style.setProperty('font-size', `${Math.max(9, fontSize * factor)}px`, 'important');
        root.style.setProperty('line-height', `${Math.max(1.15, lineHeight * factor)}px`, 'important');
        root.style.setProperty('--section-gap', `${Math.max(8, sectionGap * factor)}px`, 'important');
        root.style.setProperty('--entry-gap', `${Math.max(5, entryGap * factor)}px`, 'important');
        root.style.setProperty('--heading-scale', String(Math.max(1, headingScale * factor)), 'important');
        root.style.setProperty('padding-top', `${Math.max(20, paddingTop * factor)}px`, 'important');
        root.style.setProperty('padding-bottom', `${Math.max(20, paddingBottom * factor)}px`, 'important');

        void root.offsetHeight;
        await new Promise((resolve) => window.setTimeout(resolve, 50));
      }
    });

    const pdf = Buffer.from(
      await page.pdf({
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
        scale: 1,
        tagged: true,
        outline: true,
      }),
    );

    if (pdf.length < 5) throw new Error('Generated PDF is empty.');
    if (pdf.subarray(0, 5).toString() !== '%PDF-') {
      throw new Error('Generated PDF failed signature validation.');
    }

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
