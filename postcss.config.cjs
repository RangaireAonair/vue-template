const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');
module.exports = {
  plugins: [
    purgeCSSPlugin({
      content: ['**/*.html', '**/*.css', '**/*.scss', '**/*.vue', '**/*.jsx'],
      safelist: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /data-v-.*/,
        /el-.*/,
        /is-.*/,
        /css-module-.*/
      ],
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '');
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || [];
      },
      skippedContentGlobs: ['node_modules/**']
    })
  ]
};
