/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // No ESLint config exists in this repo yet; kept ignored until one is
    // set up deliberately (next lint would prompt interactively otherwise).
    ignoreDuringBuilds: true,
  },
  // `tsc --noEmit` passes clean as of 2026-08-31, so type errors block the
  // build again instead of being silently shipped.
  images: {
    // Vercel's built-in image optimization (resize + AVIF/WebP re-encoding
    // per device) was previously disabled here, which meant every visitor —
    // including mobile users on the testimonial-heavy homepage — downloaded
    // full-resolution source PNGs regardless of the rendered size. Removing
    // this lets next/image (already used correctly in
    // testimonials-carousel.tsx with sizes/quality props) actually optimize.
    formats: ["image/avif", "image/webp"],
  },
}

export default nextConfig
