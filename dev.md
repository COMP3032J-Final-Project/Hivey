This project uses [sveltekit](https://svelte.dev/docs/kit/introduction)

# NOTE

- Please click `watch` button on the top-right corner to subscribe notifications.
- Every thing inside `/src/routes/[page=expr]/` (experiment) is development phase only.
This behavior is defined in `/src/params/expr.ts`.

# Some Used Libraries:

- [lucide-svelte](https://lucide.dev/) the same icon library that shadcn-svelte uses.
- [shadcn-svelte](https://next.shadcn-svelte.com/docs/components/button)
- [tailwindcss](https://v3.tailwindcss.com/) NOTE we use tailwindcss v3 since
  shadcn-svelte haven't support v4 yet.
- [paraglide-sveltekit](https://inlang.com/m/dxnzrydw/paraglide-sveltekit-i18n/getting-started)
  i18n/translation

# Image Assets

Please put them inside `src/lib/images` directory. Then you can write HTML code like
this:

``` html
<enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
```

More information about `enhanced:img` tag: [SvelteKit - best practice - Images - @sveltejs/enhanced-img](https://svelte.dev/docs/kit/images#sveltejs-enhanced-img)

Note that there is also `/static` directory, where the file is directly put into
out website's root directory. See [SvelteKit - Project structure](https://svelte.dev/docs/kit/project-structure)


## Quick Start Guide for some Used Libraries

### lucide-svelte

Browse https://lucide.dev/

### Shadcn-Svelte

[how to add a button](https://next.shadcn-svelte.com/docs/components/button)

Make sure you commit before adding a new component since there is no `uninstall`
command of `shadcn-svelte` CLI.

You can modify the component to suit your need (e.g. add more control properties)
`shadcn` advocate this style.


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


# Tips

## Which directory should I add my new components

- `/src/lib/components` if your component is universal.
  - `/src/lib/components/ui` if your component is UI specific, doesn't contain much logic
  - `/src/lib/components` if your component is logic target.
  (We do this style since `shadcn-svelte` do this style and affects our repo.)
- `components` directory under the same directory of your page if your component is
  specific to that page.  
