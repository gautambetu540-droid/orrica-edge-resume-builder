import 'server-only';

import { generateResumePdf as generateResumePdfWithChromium } from './generate';

export interface GeneratePdfOptions {
  resumeId: string;
  baseUrl: string;
  cookieHeader: string;
}

/**
 * Compatibility wrapper for the Vercel PDF route.
 * Keeps the public import stable while the PDF implementation lives in the
 * shared lightweight module.
 */
export async function generateResumePdf(options: GeneratePdfOptions): Promise<Buffer> {
  return generateResumePdfWithChromium(options);
}
