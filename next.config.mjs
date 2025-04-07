import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.js",
  swDest: "public/sw.js",
  disable: process.env.NEXT_PUBLIC_ENV === "development", // Disable PWA in development
});

export default withSerwist({
  // Other Next.js settings here
});
