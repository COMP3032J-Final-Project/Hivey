This project uses [sveltekit](https://svelte.dev/docs/kit/introduction)

# NOTE

Every thing inside `/src/routes/[page=expr]/` (experiment) is development phase only.
This behavior is defined in `/src/params/expr.ts`.

# Used Libraries:

- [shadcn-svelte](https://next.shadcn-svelte.com/docs/components/button)
- [tailwindcss](https://v3.tailwindcss.com/) NOTE we use tailwindcss v3 since
  shadcn-svelte haven't support it yet.
- [paraglide-sveltekit](https://inlang.com/m/dxnzrydw/paraglide-sveltekit-i18n/getting-started)
  i18n/translation


## Quick Start Guide for Used Libraries

### Shadcn-Svelte

[how to add a button](https://next.shadcn-svelte.com/docs/components/button)

Make sure you commit before adding a new component since there is no `uninstall`
command of `shadcn-svelte` CLI.

Configuration is at `components.json`, where you can find the defined location of
installed components.

### paraglide-sveltekit

Translation files are in `/messages` directory.

When you start dev server, it will automatically compile translation file into
`/src/lib/paraglide` directory, which is not included in git repository/index.

The demo of how to use it can be found in `/src/routes/[page=expr]/paraglide`

Reference:   
[official docs](https://inlang.com/m/dxnzrydw/paraglide-sveltekit-i18n/getting-started)  
[tutorial](https://lokalise.com/blog/svelte-i18n/)


