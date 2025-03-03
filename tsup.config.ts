import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    middleware: 'src/middlewares/index.ts',
    // storage: 'src/storage/index.ts',
  },
  format: ['esm', 'cjs'],
  // dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: ['ioredis', '@cloudflare/workers-types', '@nestjs/common'],
  esbuildOptions(options) {
    options.target = 'es2020';
  },
});