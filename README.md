# Hivey

[developer docs](./dev.md)

## Specification

- tab, space, indentation, etc: [editorconfig](https://editorconfig.org/)
- (Optional) git commit message: [Conventional - Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Requirement

Copy [.env.example](.env.example) to a file named `.env` at project root. Modify settings if you need.

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

You can preview the production build with `bun run preview`.

To manually do this, you can do the following steps.

To create a production version of the app:

```bash
bun run build
```

Then move the `build` directory in another random directory which doesn't have parent directories
that contains `node_modules` directories (to ensure we have no libraries installed at the
beginning of server run).

Finally you can run `bun ./index.js` in that build directory to server up.

## Unit Test

https://svelte.dev/docs/svelte/testing
