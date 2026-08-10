import 'server-only';

// Renders the /resume/[id]/print page in a headless browser and returns a
// print-ready A4 PDF buffer. Uses @sparticuz/chromium (a serverless-friendly
// Chromium build) with puppeteer-core so this works on Vercel/Lambda-style
// deployments as well as a normal Node server.
//
// For local development, if CHROME_EXECUTABLE_PATH is set, that local
// Chrome/Chromium binary is used instead of downloading the serverless build.

export interface GeneratePdfOptions {
  resumeId: string;
  baseUrl: string;
  cookieHeader: string; // forwarded from the incoming request so the print page can authenticate
}

export async function generateResumePdf({ resumeId, baseUrl, cookieHeader }: GeneratePdfOptions): Promise<Buffer> {
  const puppeteer = await import('puppeteer-core');
  const chromium = (await import('@sparticuz/chromium')).default;

  const executablePath = process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath());

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 1240, height: 1754 },
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Forward the caller's Supabase auth cookies so the print page (which
    // requires a logged-in session) renders the real resume, not a 404.
    const url = new URL(`${baseUrl}/resume/${resumeId}/print`);
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map((pair) => {
        const idx = pair.indexOf('=');
        const name = pair.slice(0, idx).trim();
        const value = pair.slice(idx + 1).trim();
        return { name, value, domain: url.hostname, path: '/' };
      });
      await page.setCookie(...cookies);
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
