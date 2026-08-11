import 'server-only';

// Vercel/serverless PDF generation using the native Sparticuz Chromium binary.
// @sparticuz/chromium is externalized in next.config.js so its bin payload
// remains in node_modules and is available at runtime.

export interface GeneratePdfOptions {
  resumeId: string;
  baseUrl: string;
  cookieHeader: string;
}

export async function generateResumePdf({ resumeId, baseUrl, cookieHeader }: GeneratePdfOptions): Promise<Buffer> {
  const puppeteer = await import('puppeteer-core');
  const chromium = (await import('@sparticuz/chromium')).default;

  // Vercel: use Sparticuz's packaged executable. Local/dev: allow an explicit
  // Chrome path so developers do not need the bundled Chromium binary.
  const executablePath = process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath();

  if (!executablePath) {
    throw new Error('Chromium executable path could not be resolved. Check @sparticuz/chromium packaging and CHROME_EXECUTABLE_PATH.');
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1240, height: 1754 },
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Forward Supabase auth cookies so the protected print page renders the
    // requested resume.
    const url = new URL(`/resume/${resumeId}/print`, baseUrl);
    if (cookieHeader) {
      const cookies = cookieHeader
        .split(';')
        .map((pair) => pair.trim())
        .filter(Boolean)
        .map((pair) => {
          const idx = pair.indexOf('=');
          if (idx < 1) return null;
          return {
            name: pair.slice(0, idx).trim(),
            value: pair.slice(idx + 1).trim(),
            domain: url.hostname,
            path: '/',
          };
        })
        .filter((cookie): cookie is { name: string; value: string; domain: string; path: string } => Boolean(cookie));

      if (cookies.length > 0) {
        await page.setCookie(...cookies);
      }
    }

    await page.goto(url.toString(), { waitUntil: 'networkidle0', timeout: 30_000 });
    await page.waitForSelector('#resume-document-root', { timeout: 10_000 });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
