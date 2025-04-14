import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// vite.config.js
// export default {
//   server: {
//     middlewareMode: true,
//     configureServer(server) {
//       server.middlewares.use((req, res, next) => {
//         console.log('Incoming request:', req.url);
//         next();
//       });
//     }
//   }
// }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})