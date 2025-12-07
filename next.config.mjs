import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.js",
  swDest: "public/sw.js",
  // Disable PWA in development
  disable: process.env.NODE_ENV !== "production",
});

export default withSerwist({
  // Turbopack config to silence errors
  turbopack: {},
  reactStrictMode: true,
});
