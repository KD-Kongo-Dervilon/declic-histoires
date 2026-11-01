import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      id: '/', name: 'DÉCLIC — Histoires à vivre', short_name: 'DÉCLIC', lang:'fr',
      description:'Des histoires interactives pour ressentir, comprendre et choisir.',
      theme_color:'#0b131b', background_color:'#0b131b', display:'standalone', start_url:'/',
      icons: [
        {src:'/assets/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},
        {src:'/assets/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}
      ]
    },
    workbox: {globPatterns:['**/*.{js,css,html,svg,png,webp,mp3}'], globIgnores:['**/assets/icon-*.png'], navigateFallback: '/index.html', cleanupOutdatedCaches:true}
  })],
  build: {target:'es2022'},
  server: {host:true}
});
