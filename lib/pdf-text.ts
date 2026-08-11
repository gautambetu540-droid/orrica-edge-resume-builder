import 'server-only';

import pdfParse from 'pdf-parse';

export async function extractPdfText(buffer: Buffer) {
  const result = await pdfParse(buffer);
  return {
    text: result.text?.trim() || '',
    pages: result.numpages || 0,
  };
}
