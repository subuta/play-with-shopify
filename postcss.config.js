module.exports = {
  plugins: {
    'postcss-nested': {
      preserveEmpty: true,
      bubble: [
        // For tailwind.
        'screen',
      ],
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
