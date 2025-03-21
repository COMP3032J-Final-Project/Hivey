This project uses [sveltekit](https://svelte.dev/docs/kit/introduction)

# NOTE

- Please click `watch` button on the top-right corner to subscribe notifications.
- Every thing inside `/src/routes/[page=expr]/` (experiment) is development phase only.
This behavior is defined in `/src/params/expr.ts`.

# Some Used Libraries:

- [lucide-svelte](https://lucide.dev/) the same icon library that shadcn-svelte uses.
- [shadcn-svelte](https://next.shadcn-svelte.com/docs/components/button)
- [shadcn-svelte-extras](https://github.com/ieedan/shadcn-svelte-extras)
- [tailwindcss](https://v3.tailwindcss.com/) NOTE we use tailwindcss v3 since
  shadcn-svelte haven't support v4 yet.
- [paraglide-sveltekit](https://inlang.com/m/dxnzrydw/paraglide-sveltekit-i18n/getting-started)
  i18n/translation
- [valibot](https://valibot.dev/) type validation

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

### Shadcn Svelte Extras

NOTE: I recommend to clone the repo, manually copy the component source code to our Repo
and modify it if necessary since its parent shadcn-svelte is not exactly the same as the
official shadcn-svelte (e.g. It uses utility functions at location `$lib/utils/utils.js`
instead of `$lib/utils.js`)

To add a component, instead of using command like

``` sh
jsrepo add ui/chat
```

You should run

``` sh
bunx jsrepo add ui/chat  # if you installed bun
# or `npx jsrepo add ui/chat`
```


### paraglide-sveltekit

Translation files are in `/messages` directory.

Specification:

- page starts with a single underscore, e.g. `_page0`
- other category starts with two or more underscore, e.g. `__error`

To use translation, you should import specific constant from
[/src/lib/trans.ts](./src/lib/trans.ts)

When you start dev server, it will automatically compile translation file into
`/src/lib/paraglide` directory, which is not included in git repository/index.

For link, we shouldn't write code like this:

```svelte
<a href="/auth/signin">
```

instead, we should  write code like this:

```ts
import { localizeHref } from '$lib/paraglide/runtime';
```

```svelte
<a href={localizeHref("/auth/signup")}>
```


Reference:   
[Translation file format](https://inlang.com/m/reootnfj/plugin-inlang-messageFormat)
[official docs](https://inlang.com/m/gerre34r/library-inlang-paraglideJs/sveltekit)  
[tutorial](https://lokalise.com/blog/svelte-i18n/)

## Valibot

See [Introduction](https://valibot.dev/guides/introduction/) and [QuickStart](https://valibot.dev/guides/quick-start/)

# Tips

## Which directory should I add my new components

- `/src/lib/components` if your component is universal.
  - `/src/lib/components/ui` if your component is UI specific, doesn't contain much logic
  - `/src/lib/components` if your component is logic target.
  (We do this style since `shadcn-svelte` do this style and affects our repo.)
- `components` directory under the same directory of your page if your component is
  specific to that page.  


## How to Control User Authorization

Hivey uses a JWT-based authentication system to manage user access permissions. A series of functions are provided in `src/lib/api/auth.ts` to help control the user's authentication status and access permissions:

### Main Functions

1. **User Registration and Login**
   - `postUserRegister(form: RegisterForm)`: Register a new user
   - `postUserLogin(form: LoginForm)`: User login and obtain JWT access and refresh tokens
   - `postLogoutUserAuth()`: User logout, simultaneously deregistering user authentication information in localStorage and the backend server

2. **Token Management**
   - `saveUserAuth(userAuth: UserAuth)`: Store user authentication information in localStorage
   - `getUserAuth()`: Retrieve stored user authentication information from localStorage
   - `removeUserAuth()`: Remove user authentication information from localStorage
   - `isUserAuthExpired()`: Check if the access token has expired
   - `postRefreshUserAuth(form: RefreshUserAuthForm)`: Use the refresh token to obtain a new access token

3. **User Information Management**
   - `getUserInfo()`: Get detailed information about the currently logged-in user
   - `putUserInfo(form: User)`: Update user information

### How to Use

#### 1. Route Protection

In SvelteKit, route protection can be implemented in the `load` function of `+layout.ts` or `+page.ts` files:

```typescript
import { getUserAuth, isUserAuthExpired } from '$lib/api/auth';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
  // Check if the user is logged in
  const userAuth = getUserAuth();
  
  // Redirect to the login page if not logged in or token has expired
  if (!userAuth || isUserAuthExpired()) {
    throw redirect(302, '/auth/signin');
  }
  
  return {};
};
```

#### 2. Conditional Rendering in Components

In components, content can be conditionally rendered based on the user's login status or permission level:

```svelte
<script>
  import { getUserAuth, getUserInfo } from '$lib/api/auth';
  import { onMount } from 'svelte';
  
  let userAuth = getUserAuth();
  let userInfo;
  let isAdmin = false;
  
  onMount(async () => {
    if (userAuth) {
      userInfo = await getUserInfo();
      isAdmin = userInfo.is_superuser;
    }
  });
</script>

{#if userAuth}
  <!-- Content visible to logged-in users -->
  <p>Welcome back, {userInfo?.username}</p>
  
  {#if isAdmin}
    <!-- Content visible to administrators -->
    <AdminPanel />
  {/if}
{:else}
  <!-- Content visible to non-logged-in users -->
  <p>Please <a href="/auth/signin">log in</a> to access more features</p>
{/if}
```

#### 3. Authentication in API Requests
All API requests that require authentication will automatically have authentication headers added by the `axiosClient` interceptor, handling token refresh and expiration situations. Frontend developers do not need to manually manage these details when using `axiosClient` to request backend APIs.

### Notes
1. The JWT access token is considered expired 5 minutes before its actual expiration to ensure there is enough time to refresh it.
2. If both the JWT access token and refresh token expire, the user will be automatically redirected to the login page.
3. All protected routes should implement appropriate permission checks.
