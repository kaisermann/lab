const sveltePreprocess = require("svelte-preprocess");

module.exports = {
  preprocess: sveltePreprocess({
    defaults: {
      css: "postcss",
    },
    postcss: true,
  }),
};
