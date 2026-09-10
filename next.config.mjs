/** @type {import('next').NextConfig} */
const nextConfig = {
  // Plain static HTML out of `out/` — deploys anywhere the old site deployed.
  output: 'export',
  // Routes emit `book/index.html` rather than `book.html`, which leaves the
  // legacy `public/*.html` filenames free to act as redirect stubs.
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
