<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    
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
        <div class="form-group form-check mt-4">
            <label class="cursor-pointer label">
                <input type="checkbox" name="remember" class="checkbox">
                <span class="label-text">Remember Me</span>
            </label>
        </div>
        <Button type="submit" variant="default" size="lg" class="mt-4 w-full font-semibold">
            Sign In
        </Button>
        <div class="mt-4 flex justify-center">
            <a href="/auth/signup" class="text-gray-200 hover:text-white underline">Need An Account? Sign Up</a>
        </div>
    </form>
</div>

