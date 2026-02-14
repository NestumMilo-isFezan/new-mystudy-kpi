// @ts-check
import { defineConfig } from 'astro/config';

import alpinejs from '@astrojs/alpinejs';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  integrations: [alpinejs()],
  server: {
    host: true
  },
  vite: {
    server: {
      allowedHosts: ['mystudykpi.test']
    }
  },

  adapter: node({
    mode: 'standalone'
  })
});
