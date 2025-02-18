// This file makes `/expr` URL development phase only
// Reference:
// - https://svelte.dev/docs/kit/advanced-routing
// - https://stackoverflow.com/questions/78171154/sveltekit-routes-for-development-mode-only

import { dev } from '$app/environment';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
  return dev && param === "expr";
};

