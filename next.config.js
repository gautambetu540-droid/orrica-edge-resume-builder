/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core', 'pdf-parse'],
  outputFileTracingIncludes: {
    '/api/resume/*/pdf': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
};

module.exports = nextConfig;
