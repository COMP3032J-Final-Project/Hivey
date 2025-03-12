<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { fade } from 'svelte/transition';
    import Header from '../components/Header.svelte';
    import Footer from '../components/Footer.svelte';
    let { children } = $props();
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    const today = new Date().toLocaleDateString();
</script>

<div class="bg-primary/10">
    <Header />

    <div class="max-w-5xl mx-auto px-6 md:px-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">{m.privacy_terms()}</h2>
        <p class="text-lg text-muted-foreground mb-2">
            {m.last_modified()}: {today}
        </p>
        <p class="text-lg text-muted-foreground mb-2">
            {m.thank_you_for_using()} {m.app_name()}! 
        </p>
        <p class="text-lg text-muted-foreground mb-6">
            {m.below()}<a href="/contact" class="underline">{m.get_in_touch_with_us()}</a>.
        </p>

        <h3 class="text-2xl font-bold mb-4">{m.privacy_policy()}</h3>
        <h4 class="text-xl font-bold mb-2">{m.what_information_do_we_collect()}</h4>
        <p class="text-lg text-muted-foreground mb-2">
            {m.what_information_do_we_collect_description1()}
        </p>
        <p class="text-lg text-muted-foreground mb-2">
            {m.what_information_do_we_collect_description2()}
        </p>
        <p class="text-lg text-muted-foreground mb-4">
            {m.what_information_do_we_collect_description3()}
        </p>

        <h4 class="text-xl font-bold mb-2">{m.how_do_we_use_your_information()}</h4>
        <p class="text-lg text-muted-foreground mb-2">
            {m.how_do_we_use_your_information_description1()}
        </p>
        <p class="text-lg text-muted-foreground mb-2">
            {m.how_do_we_use_your_information_description2()}
        </p>
        <p class="text-lg text-muted-foreground mb-2">
            {m.how_do_we_use_your_information_description3()}
        </p>
        <p class="text-lg text-muted-foreground mb-4">
            {m.how_do_we_use_your_information_description4()}
        </p>

        <h4 class="text-xl font-bold mb-2">{m.what_are_your_rights()}</h4>
        <p class="text-lg text-muted-foreground mb-2">{m.what_are_your_rights_description()}</p>
        <ul class="list-disc list-inside text-lg text-muted-foreground mb-6">
            <li>{m.access()}</li>
            <li>{m.rectification()}</li>
            <li>{m.deletion()}</li>
            <li>{m.restriction_of_processing()}</li>
            <li>{m.data_portability()}</li>
            <li>{m.objection()}</li>
            <li>{m.withdrawal_of_consent()}</li>
        </ul>

        <h3 class="text-2xl font-bold mb-4">{m.terms_of_service()}</h3>
        <h4 class="text-xl font-bold mb-2">{m.acceptable_use()}</h4>
        <p class="text-lg text-muted-foreground mb-4">{m.acceptable_use_description()}</p>
        <h4 class="text-xl font-bold mb-2">{m.account_registration_and_security()}</h4>
        <p class="text-lg text-muted-foreground mb-4">{m.account_registration_and_security_description()}</p>
        <h4 class="text-xl font-bold mb-2">{m.service_availability()}</h4>
        <p class="text-lg text-muted-foreground mb-10">{m.service_availability_description()}</p>
    </div>

</div>
