import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-auto'
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      // these are the aliases and paths to them
      '@components': path.resolve('./src/lib/components'),
      '@lib': path.resolve('./src/lib'),
      '@utils': path.resolve('./src/lib/utils'),
    },
  },

  preprocess: [
    preprocess({ 
      postcss: true,
    }),
  ],
}

export default config
