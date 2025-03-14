import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
	  plugins: [
        enhancedImages(),
		    sveltekit(),
		    paraglide({
			      project: './project.inlang',
			      outdir: './src/lib/paraglide'
		    }),
        wasm(),
        topLevelAwait()
	  ],

	  test: {
		    include: ['src/**/*.{test,spec}.{js,ts}']
	  }
});
