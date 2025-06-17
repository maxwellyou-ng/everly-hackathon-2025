/** @type {import('next').NextConfig} */
const repo = 'everly-hackathon-2025';
const nextConfig = {
  output: 'export',
  basePath: '/' + repo,
  assetPrefix: '/' + repo + '/',
};

export default nextConfig;
