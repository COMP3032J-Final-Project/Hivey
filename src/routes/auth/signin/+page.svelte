<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    
</script>

<div class="container mx-auto p-6 w-full text-gray-100">
    <h2 class="text-4xl font-bold text-center">Sign In</h2>
    <form class="mt-6">
        <div>
            <label for="email" class="block mb-2">Email</label>
            <input type="email" name="email" id="email" autocomplete="email"
                   class="w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900">
        </div>
        <div class="mt-4">
            <label for="password" class="block mb-2">Password</label>
            <input type="password" name="password" id="password" autocomplete="current-password"
                   class="w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900">
        </div>
        <button type="submit" class="mt-6 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 font-semibold text-gray-100 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Sign In
        </button>
        <div class="mt-4 flex justify-center">
            <a href="/auth/signup" class="text-gray-200 hover:text-white underline">Need An Account? Sign Up</a>
        </div>
    </form>
</div>

