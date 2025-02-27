<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    
</script>

<div class="container mx-auto p-6 w-full text-primary-foreground">
    <h2 class="text-4xl font-bold text-center">{ m.sign_in() }</h2>
    <form class="mt-6">
        <div>
            <label for="email" class="block mb-2">{ m.email() }</label>
            <input type="email" name="email" id="email" autocomplete="email"
                class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="mt-4">
            <label for="password" class="block mb-2">{ m.password() }</label>
            <input type="password" name="password" id="password" autocomplete="current-password" 
                class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="form-group form-check mt-4">
            <label class="cursor-pointer label">
                <input type="checkbox" name="remember" class="checkbox bg-secondary">
                <span class="label-text">{ m.remember_me() }</span>
            </label>
        </div>
        <Button type="submit" variant="default" size="lg" class="mt-4 w-full font-semibold">
            { m.sign_in() }
        </Button>
        <div class="mt-4 flex justify-center">
            <a href="/auth/signup" class="text-primary-foreground/60 hover:text-primary-foreground underline">{ m.to_sign_up() }</a>
        </div>
    </form>
</div>

