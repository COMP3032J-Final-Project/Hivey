<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    
</script>

<div class="container mx-auto p-6 w-full text-gray-100">
    <h2 class="text-4xl font-bold text-center">Sign Up</h2>
    <form class="mt-6">
        <div>
            <label for="name" class="block mb-2">Name</label>
            <input type="text" name="name" id="name" autocomplete="name"
                   class="w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900">
        </div>
        <div class="mt-4">
            <label for="email" class="block mb-2">Email</label>
            <input type="email" name="email" id="email" autocomplete="email"
                   class="w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900">
        </div>
        <div class="mt-4">
            <label for="password" class="block mb-2">Password</label>
            <input type="password" name="password" id="password" autocomplete="new-password"
                   class="w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900">
        </div>
        <div class="mt-4">
            <label for="confirm-password" class="block mb-2">Confirm Password</label>
            <input type="password" name="confirm-password" id="confirm-password" autocomplete="new-password"
                   class="w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900">
        </div>
        <!-- <button type="submit" class="mt-6 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 font-semibold text-gray-100 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Sign Up
        </button> -->
        <Button type="submit" variant="default" size="lg" class="mt-6 w-full font-semibold">
            Sign Up
        </Button>
        <div class="mt-4 flex justify-center">
            <a href="/auth/signin" class="text-gray-200 hover:text-white underline">Already Have An Account? Sign In</a>
        </div>
    </form>
</div>


