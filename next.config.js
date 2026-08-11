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
  ],

  // Explicitly copy Chromium's executable payload into traced server
  // functions so the binary is available at runtime on Vercel.
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
