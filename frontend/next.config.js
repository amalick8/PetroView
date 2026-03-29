/** @type {import('next').NextConfig} */
const repoName = "PetroView";
const isGithubActions = process.env.GITHUB_ACTIONS === "true";
const isVercel = process.env.VERCEL === "1";

const nextConfig = {
  reactStrictMode: true,
  output: isGithubActions && !isVercel ? "export" : undefined,
  trailingSlash: isGithubActions && !isVercel,
  basePath: isGithubActions && !isVercel ? `/${repoName}` : "",
  assetPrefix: isGithubActions && !isVercel ? `/${repoName}/` : undefined,
  images: {
    unoptimized: isGithubActions && !isVercel,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

module.exports = nextConfig;
