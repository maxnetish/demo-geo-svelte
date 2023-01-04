import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const hereSecret = require('./.HERE-api-secret.json');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      '/autocomplete.search.hereapi.com': {
        target: 'https://autocomplete.search.hereapi.com',
        // pathRewrite: {'^/autocomplete.search.hereapi.com' : ''},
        rewrite: function (path) {
          const token = path.includes('?') ? '&' : '?';
          const rewrited = path.replace('/autocomplete.search.hereapi.com', 'https://autocomplete.search.hereapi.com') + token + 'apiKey=' + hereSecret.apiKey;
          console.log(`REWRITE: ${path} -> ${rewrited}`);
          return rewrited;
        },
        secure: false,
      },
      '/lookup.search.hereapi.com': {
        target: 'https://lookup.search.hereapi.com',
        rewrite: function (path) {
          const token = path.includes('?') ? '&' : '?';
          const rewrited = path.replace('/lookup.search.hereapi.com', '') + token + 'apiKey=' + hereSecret.apiKey;
          console.log(`REWRITE: ${path} -> ${rewrited}`);
          return rewrited;
        },
        secure: false,
      },
      '/autosuggest.search.hereapi.com': {
        target: 'https://autosuggest.search.hereapi.com',
        rewrite: function(path) {
          const token = path.includes('?') ? '&' : '?';
          const rewrited = path.replace('/autosuggest.search.hereapi.com', '') + token + 'apiKey=' + hereSecret.apiKey;
          console.log(`REWRITE: ${path} -> ${rewrited}`);
          return rewrited;
        },
        secure: false,
      },
    },
  },
})
