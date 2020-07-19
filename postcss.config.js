/* eslint-disable global-require */
const dev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    require('autoprefixer')(),
    require('postcss-import')(),
    require('tailwindcss')(),
    require('postcss-preset-env')({
      features: {
        'nesting-rules': true,
      },
    }),
    !dev &&
      require('@fullhuman/postcss-purgecss')({
        content: ['./src/**/*.svelte', './src/**/*.html'],
        defaultExtractor: (content) => {
          return [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
            ([_match, group, ..._rest]) => group,
          );
        },
      }),

    !dev &&
      require('cssnano')({
        preset: ['default', { discardComments: { removeAll: true } }],
      }),
  ],
};
