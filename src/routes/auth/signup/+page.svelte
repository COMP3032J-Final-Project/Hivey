<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    
</script>

<!--
TODO use message to enable translate text
-->

<div class="container mx-auto p-6 w-full text-primary-foreground">
    <h2 class="text-4xl font-bold text-center">Sign Up</h2>
    <form class="mt-6">
        <div>
            <label for="name" class="block mb-2">Name</label>
            <input type="text" name="name" id="name" autocomplete="name"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="mt-4">
            <label for="email" class="block mb-2">Email</label>
            <input type="email" name="email" id="email" autocomplete="email"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="mt-4">
            <label for="password" class="block mb-2">Password</label>
            <input type="password" name="password" id="password" autocomplete="new-password"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="mt-4">
            <label for="confirm-password" class="block mb-2">Confirm Password</label>
            <input type="password" name="confirm-password" id="confirm-password" autocomplete="new-password"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <Button type="submit" size="lg" class="mt-4 w-full font-semibold">
            Sign Up
        </Button>
        <div class="mt-4 flex justify-center">
            <a href="/auth/signin" class="text-primary-foreground/60 hover:text-primary-foreground underline">Already Have An Account? Sign In</a>
        </div>
    </form>
</div>


