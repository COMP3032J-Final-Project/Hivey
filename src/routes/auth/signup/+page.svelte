<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    
</script>

<div class="container mx-auto p-6 w-full text-primary-foreground">
    <h2 class="text-4xl font-bold text-center">{ m.sign_up() }</h2>
    <form class="mt-6">
        <div>
            <label for="name" class="block mb-2">{ m.name() }</label>
            <input type="text" name="name" id="name" autocomplete="name"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="mt-4">
            <label for="email" class="block mb-2">{ m.email() }</label>
            <input type="email" name="email" id="email" autocomplete="email"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="mt-4">
            <label for="password" class="block mb-2">{ m.password() }</label>
            <input type="password" name="password" id="password" autocomplete="new-password"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <div class="mt-4">
            <label for="confirm-password" class="block mb-2">{ m.confirm_password() }</label>
            <input type="password" name="confirm-password" id="confirm-password" autocomplete="new-password"
                   class="w-full rounded-md bg-secondary px-3 py-1.5">
        </div>
        <Button type="submit" size="lg" class="mt-4 w-full font-semibold">
            { m.sign_up() }
        </Button>
        <div class="mt-4 flex justify-center">
            <a href="/auth/signin" class="text-primary-foreground/60 hover:text-primary-foreground underline">{ m.to_sign_in() }</a>
        </div>
    </form>
</div>


