# SyncE

[developer docs](./dev.md)

## Specification

- tab, space, indentation, etc: [editorconfig](https://editorconfig.org/)
- (Optional) git commit message: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Developing

Install
[npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm?ref=meilisearch-blog)
or [bun](https://bun.sh/) (recommend), the nodejs package managers

Install dependencies:

``` bash
bun install # or `npm install`
```

To start a development server:

``` bash
bun run dev --open
```

Run other commands:

first check the `scripts` entry in `package.json`, then run command like `bun run test`

## Building

To create a production version of the app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.

TODO

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.


## Unit Test

https://svelte.dev/docs/svelte/testing


