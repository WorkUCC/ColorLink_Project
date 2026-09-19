import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Carga .env / .env.local además de las variables del sistema.
  const env = loadEnv(mode, process.cwd(), '');

  // Helper to remove any accidental enclosing quotes (e.g. from secrets or .env)
  const clean = (val?: string) => (val || '').trim().replace(/^["']+|["']+$/g, '').trim();

  const supabaseUrl = clean(env.VITE_SUPABASE_URL || env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL);
  const supabaseAnonKey = clean(env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);

  return {
    plugins: [react(), tailwindcss()],
    // Respaldo para entornos (como AI Studio) donde los secretos llegan
    // por process.env y no por un archivo .env con prefijo VITE_.
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
