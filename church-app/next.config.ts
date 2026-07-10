import type { NextConfig } from "next";

const SUPABASE_HOST = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "nmqctnkfqzqhdgaxneet.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOST,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com",
      "font-src 'self' https://fonts.gstatic.com",
      `img-src 'self' data: blob: https://${SUPABASE_HOST}`,
      `media-src 'self' blob: https://${SUPABASE_HOST}`,
      "frame-src 'self' https://www.youtube.com https://youtube.com",
      `connect-src 'self' https://${SUPABASE_HOST} wss://${SUPABASE_HOST}`,
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

export default nextConfig;
