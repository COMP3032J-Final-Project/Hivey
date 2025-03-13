<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    
    const today = new Date().toLocaleDateString();
</script>

<svelte:head>
    <title>{m.privacy_terms()} | {m.app_name()}</title>
    <meta name="description" content={`${m.privacy_terms()} for ${m.app_name()}`} />
</svelte:head>

<div class="py-10">
    <h2 class="text-3xl md:text-4xl font-bold mb-6">{m.privacy_terms()}</h2>
    
    <div class="mb-8">
        <p class="text-lg text-muted-foreground mb-2">
            {m.last_modified()}: {today}
        </p>
        <p class="text-lg text-muted-foreground mb-2">
            {m.thank_you_for_using()} {m.app_name()}! 
        </p>
        <p class="text-lg text-muted-foreground mb-6">
            {m.below()}<a href="/contact" class="underline">{m.get_in_touch_with_us()}</a>.
        </p>
    </div>

    <!-- Privacy Policy Section -->
    <section class="mb-10">
        <h3 class="text-2xl font-bold mb-6 border-b pb-2">{m.privacy_policy()}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- First h4 subsection - Left column -->
            <div>
                <h4 class="text-xl font-bold mb-3">{m.what_information_do_we_collect()}</h4>
                <div class="space-y-2">
                    <p class="text-lg text-muted-foreground">
                        {m.what_information_do_we_collect_description1()}
                    </p>
                    <p class="text-lg text-muted-foreground">
                        {m.what_information_do_we_collect_description2()}
                    </p>
                    <p class="text-lg text-muted-foreground">
                        {m.what_information_do_we_collect_description3()}
                    </p>
                </div>
            </div>
            
            <!-- Second h4 subsection - Right column -->
            <div>
                <h4 class="text-xl font-bold mb-3">{m.how_do_we_use_your_information()}</h4>
                <div class="space-y-2">
                    <p class="text-lg text-muted-foreground">
                        {m.how_do_we_use_your_information_description1()}
                    </p>
                    <p class="text-lg text-muted-foreground">
                        {m.how_do_we_use_your_information_description2()}
                    </p>
                    <p class="text-lg text-muted-foreground">
                        {m.how_do_we_use_your_information_description3()}
                    </p>
                    <p class="text-lg text-muted-foreground">
                        {m.how_do_we_use_your_information_description4()}
                    </p>
                </div>
            </div>
            
            <!-- Third h4 subsection - Full width or back to Left column in next row -->
            <div class="md:col-span-2">
                <h4 class="text-xl font-bold mb-3">{m.what_are_your_rights()}</h4>
                <p class="text-lg text-muted-foreground mb-3">{m.what_are_your_rights_description()}</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul class="list-disc list-inside text-lg text-muted-foreground">
                        <li class="mb-1">{m.access()}</li>
                        <li class="mb-1">{m.rectification()}</li>
                        <li class="mb-1">{m.deletion()}</li>
                        <li>{m.restriction_of_processing()}</li>
                    </ul>
                    <ul class="list-disc list-inside text-lg text-muted-foreground">
                        <li class="mb-1">{m.data_portability()}</li>
                        <li class="mb-1">{m.objection()}</li>
                        <li>{m.withdrawal_of_consent()}</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Terms of Service Section -->
    <section>
        <h3 class="text-2xl font-bold mb-6 border-b pb-2">{m.terms_of_service()}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- First h4 subsection - Left column -->
            <div>
                <h4 class="text-xl font-bold mb-3">{m.acceptable_use()}</h4>
                <p class="text-lg text-muted-foreground">
                    {m.acceptable_use_description()}
                </p>
            </div>
            
            <!-- Second h4 subsection - Right column -->
            <div>
                <h4 class="text-xl font-bold mb-3">{m.account_registration_and_security()}</h4>
                <p class="text-lg text-muted-foreground">
                    {m.account_registration_and_security_description()}
                </p>
            </div>
            
            <!-- Third h4 subsection - Full width or back to Left column in next row -->
            <div class="md:col-span-2">
                <h4 class="text-xl font-bold mb-3">{m.service_availability()}</h4>
                <p class="text-lg text-muted-foreground">
                    {m.service_availability_description()}
                </p>
            </div>
        </div>
    </section>
</div>