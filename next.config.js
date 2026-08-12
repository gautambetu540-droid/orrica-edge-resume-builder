/** @type {import('next').NextConfig} */
const nextConfig = {
  // Chromium and Puppeteer must stay external so @sparticuz/chromium
  // can resolve its bundled Brotli payload at runtime instead of from a
  // webpack-generated path.
  serverExternalPackages: [
    '@sparticuz/chromium',
    'puppeteer-core',
    'pdf-parse',
    'openai',
  ],

  // Explicitly include the complete Chromium package in the traced
  // serverless function. This is intentionally broader than only `bin/`
  // because the Chromium resolver can need package metadata/helpers too.
  outputFileTracingIncludes: {
    '/*': [
      './node_modules/@sparticuz/chromium/**/*',
    ],
    '/api/resume/*/pdf': [
      './node_modules/@sparticuz/chromium/**/*',
    ],
  },
};

module.exports = nextConfig;
