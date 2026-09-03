import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icon.svg',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'admin-icon-192x192.png',
        ],
        manifest: {
          id: '/',
          name: 'STUDIO X | অল-ইন-ওয়ান এআই স্টুডিও',
          short_name: 'STUDIO X',
          description: 'STUDIO X - বাংলা ভয়েস, এআই চ্যাট, ওয়েবসাইট, অ্যাপ, ভিডিও ও এজেন্ট ওয়ার্কস্পেস সমন্বিত অল-ইন-ওয়ান এআই স্টুডিও।',
          theme_color: '#059669',
          background_color: '#09090b',
          display: 'standalone',
          orientation: 'portrait-primary',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'STUDIO X Admin App',
              short_name: 'Admin App',
              description: 'STUDIO X অ্যাডমিন মাস্টার কন্ট্রোল প্যানেল',
              url: '/?app=admin',
              icons: [{src: '/admin-icon-192x192.png', sizes: '192x192', type: 'image/png'}],
            },
            {
              name: 'বাংলা ভয়েস স্টুডিও',
              short_name: 'ভয়েস স্টুডিও',
              description: 'বাংলা নিউরাল টেক্সট-টু-স্পিচ ইঞ্জিন',
              url: '/?studio=audio',
              icons: [{src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png'}],
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
