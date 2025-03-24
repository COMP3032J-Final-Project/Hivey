<script lang="ts">
  import { m, mpm, mpmt }  from '$lib/trans';
  import { localizeHref } from '$lib/paraglide/runtime';
  const today = new Date().toLocaleDateString();
</script>

<svelte:head>
  <title>{mpmt.privacy_terms()} | {m.app_name()}</title>
  <meta name="description" content={`${mpmt.privacy_terms()} for ${m.app_name()}`} />
</svelte:head>

<div class="py-10">
  <h2 class="text-3xl md:text-4xl font-bold mb-6">{mpmt.privacy_terms()}</h2>
    
  <div class="mb-8">
    <p class="text-lg text-muted-foreground mb-2">
      {mpmt.last_modified()}: {today}
    </p>
    <p class="text-lg text-muted-foreground mb-2">
      {mpmt.thank_you_for_using()} {m.app_name()}! 
    </p>
    <p class="text-lg text-muted-foreground mb-6">
      {mpmt.below()}<a href={localizeHref("/contact")} class="underline">{mpmt.get_in_touch_with_us()}</a>.
    </p>
  </div>

  <!-- Privacy Policy Section -->
  <section class="mb-10">
    <h3 class="text-2xl font-bold mb-6 border-b pb-2">{mpmt.privacy_policy()}</h3>
        
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- First h4 subsection - Left column -->
      <div>
        <h4 class="text-xl font-bold mb-3">{mpmt.what_information_do_we_collect()}</h4>
        <div class="space-y-2">
          <p class="text-lg text-muted-foreground">
            {mpmt.what_information_do_we_collect_description1()}
          </p>
          <p class="text-lg text-muted-foreground">
            {mpmt.what_information_do_we_collect_description2()}
          </p>
          <p class="text-lg text-muted-foreground">
            {mpmt.what_information_do_we_collect_description3()}
          </p>
        </div>
      </div>
            
      <!-- Second h4 subsection - Right column -->
      <div>
        <h4 class="text-xl font-bold mb-3">{mpmt.how_do_we_use_your_information()}</h4>
        <div class="space-y-2">
          <p class="text-lg text-muted-foreground">
            {mpmt.how_do_we_use_your_information_description1()}
          </p>
          <p class="text-lg text-muted-foreground">
            {mpmt.how_do_we_use_your_information_description2()}
          </p>
          <p class="text-lg text-muted-foreground">
            {mpmt.how_do_we_use_your_information_description3()}
          </p>
          <p class="text-lg text-muted-foreground">
            {mpmt.how_do_we_use_your_information_description4()}
          </p>
        </div>
      </div>
            
      <!-- Third h4 subsection - Full width or back to Left column in next row -->
      <div class="md:col-span-2">
        <h4 class="text-xl font-bold mb-3">{mpmt.what_are_your_rights()}</h4>
        <p class="text-lg text-muted-foreground mb-3">{mpmt.what_are_your_rights_description()}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul class="list-disc list-inside text-lg text-muted-foreground">
            <li class="mb-1">{mpmt.access()}</li>
            <li class="mb-1">{mpmt.rectification()}</li>
            <li class="mb-1">{mpmt.deletion()}</li>
            <li>{mpmt.restriction_of_processing()}</li>
          </ul>
          <ul class="list-disc list-inside text-lg text-muted-foreground">
            <li class="mb-1">{mpmt.data_portability()}</li>
            <li class="mb-1">{mpmt.objection()}</li>
            <li>{mpmt.withdrawal_of_consent()}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Terms of Service Section -->
  <section>
    <h3 class="text-2xl font-bold mb-6 border-b pb-2">{mpmt.terms_of_service()}</h3>
        
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- First h4 subsection - Left column -->
      <div>
        <h4 class="text-xl font-bold mb-3">{mpmt.acceptable_use()}</h4>
        <p class="text-lg text-muted-foreground">
          {mpmt.acceptable_use_description()}
        </p>
      </div>
            
      <!-- Second h4 subsection - Right column -->
      <div>
        <h4 class="text-xl font-bold mb-3">{mpmt.account_registration_and_security()}</h4>
        <p class="text-lg text-muted-foreground">
          {mpmt.account_registration_and_security_description()}
        </p>
      </div>
            
      <!-- Third h4 subsection - Full width or back to Left column in next row -->
      <div class="md:col-span-2">
        <h4 class="text-xl font-bold mb-3">{mpmt.service_availability()}</h4>
        <p class="text-lg text-muted-foreground">
          {mpmt.service_availability_description()}
        </p>
      </div>
    </div>
  </section>
</div>
