/**
 * Reference:
 * - https://svelte.dev/docs/svelte/stores#When-to-use-stores
 * - https://svelte.dev/docs/svelte/$state#Passing-state-across-modules
 * - https://joyofcode.xyz/how-to-share-state-in-svelte-5

 * I've written an simple application to test that Svelte `$effect`(or UI update) 
 * is only effected by smallest changed property.
 * For example if you have used fileState.file.id in `$effect`, if `id` is not changed,
 * but fileState.file.filename is changed, then this `$effect` won't run. Unless
 * we use `fileState.file` or `fileState.filename` in `$effect`.
 * Its behavior is smart.
 * 
 * https://svelte.dev/playground/63c3578909b04fee87ee7c189f2abfe5?version=5.27.0
 */

import { SvelteMap } from 'svelte/reactivity';
import type { File } from '$lib/types/file';

// TODO extract type
export const projectState = $state<{
    currentFileId?: string // undefined means user not viewing any file
}>({});

export const projectFiles = new SvelteMap<string, File>();



