import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from "path";
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default ({ mode }: { mode: string; }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  console.log(process.env.VITE_redirect_uri);
  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      port: 80,
      allowedHosts: [process.env.VITE_redirect_uri ?? ''],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });

}




