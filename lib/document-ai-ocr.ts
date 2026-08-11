import 'server-only';

import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

function getClient() {
  const projectId = process.env.GOOGLE_DOCUMENT_AI_PROJECT_ID || process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_DOCUMENT_AI_LOCATION || 'us';
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Document AI OCR is not configured. Add GOOGLE_DOCUMENT_AI_PROJECT_ID, GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY to Vercel.');
  }

  return new DocumentProcessorServiceClient({
    apiEndpoint: `${location}-documentai.googleapis.com`,
    credentials: { client_email: clientEmail, private_key: privateKey },
  });
}

export async function extractPdfWithDocumentAI(buffer: Buffer) {
  const projectId = process.env.GOOGLE_DOCUMENT_AI_PROJECT_ID || process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_DOCUMENT_AI_LOCATION || 'us';
  const processorId = process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID;

  if (!processorId) {
    throw new Error('Document AI OCR is not configured. Add GOOGLE_DOCUMENT_AI_PROCESSOR_ID to Vercel.');
  }

  const client = getClient();
  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;
  const [result] = await client.processDocument({
    name,
    rawDocument: {
      content: buffer,
      mimeType: 'application/pdf',
    },
  });

  return result.document?.text?.trim() || '';
}
