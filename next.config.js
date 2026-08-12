/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 14 uses the experimental name for server-side external packages.
  experimental: {
    serverComponentsExternalPackages: [
      '@sparticuz/chromium',
      'puppeteer-core',
      'pdf-parse',
      'openai',
    ],
    outputFileTracingIncludes: {
      '/*': ['./node_modules/@sparticuz/chromium/**/*'],
      '/api/resume/*/pdf': ['./node_modules/@sparticuz/chromium/**/*'],
    },
  },
};

module.exports = nextConfig;
