import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteImagemin from "vite-plugin-imagemin";
import compression from "vite-plugin-compression2";
import { resolve } from "path";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/task-wargaming/" : "/",
  plugins: [
    react(),
    viteImagemin({
      verbose: true,
      gifsicle: {
        interlaced: true,
        optimizationLevel: 3,
      },
      mozjpeg: {
        progressive: true,
        quality: 75,
      },
      optipng: {
        optimizationLevel: 7,
      },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 3,
      },
      svgo: {
        plugins: [
          {
            name: "removeViewBox",
            active: false,
          },
          {
            name: "cleanupIDs",
            active: true,
          },
        ],
      },
      webp: {
        quality: 75,
      },
    }),
    compression({
      include: [
        /\.(js|mjs|cjs|json|css|html|svg|png|jpe?g|gif|webp|ttf|otf|woff2?)$/i,
      ],
      threshold: 1024,
      skipIfLargerOrEqual: true,
      algorithms: ["brotliCompress", "gzip"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@styles": resolve(__dirname, "src/shared/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
        },
      },
    },
  },
});
