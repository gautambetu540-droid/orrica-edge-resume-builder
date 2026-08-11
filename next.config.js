/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep native/server-only packages outside the webpack bundle.
  // @sparticuz/chromium must remain in node_modules so its bin directory
  // can be resolved correctly at runtime on Vercel.
  serverExternalPackages: [
    '@sparticuz/chromium',
    'puppeteer-core',
    'pdf-parse',
    'openai',
    '@google-cloud/documentai',
  ],

  // Explicitly copy Chromium's executable payload into the traced server
  // function. The API route pattern covers both the direct route and any
  // route-handler nesting Next may produce during output-file tracing.
  outputFileTracingIncludes: {
    '/*': [
      './node_modules/@sparticuz/chromium/bin/**/*',
    ],
    '/api/resume/*/pdf': [
      './node_modules/@sparticuz/chromium/bin/**/*',
    ],
  },
};

module.exports = nextConfig;
