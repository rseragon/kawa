/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export only when building in GitHub Actions
  // output: process.env.GITHUB_ACTION ? 'export' : undefined,
  output: 'export'
}

module.exports = nextConfig
