// SEE: https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/defaultConfig.stub.js#L5
// SEE: https://tailwindcss.com/docs/theme#extending-the-default-theme

const defaultTheme = require('tailwindcss/defaultTheme')

const dev = process.env.NODE_ENV !== 'production'

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },

  purge: {
    enabled: !dev,
    content: ['./src/**/*.js'],
  },

  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans JP"',
          '"ヒラギノ角ゴ Pro W3"',
          '"Hiragino Kaku Gothic Pro"',
          'メイリオ',
          'Meiryo',
          'Osaka',
          '"ＭＳ Ｐゴシック"',
          '"MS PGothic"',
          '"Roboto"',
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
}
