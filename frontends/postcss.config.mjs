/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    // autoprefixer removed — Tailwind CSS v4 includes autoprefixing built-in
  },
};

export default config;
