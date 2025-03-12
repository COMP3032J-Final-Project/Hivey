<script lang="ts">
	  import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
    import { languageTag } from '$lib/paraglide/runtime';
	  import { i18n } from '$lib/i18n';
	  import { page } from '$app/state';
	  import { goto } from '$app/navigation';
    import { Languages } from 'lucide-svelte';

    let currentLanguage = languageTag();

	  function switchToLanguage() {
        const newLanguage = currentLanguage === 'en' ? 'zh-cn' : 'en';
		    currentLanguage = newLanguage;

		    const canonicalPath = i18n.route(page.url.pathname);
		    const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		    goto(localisedPath);
	  }
</script>

<div>
	  <button onclick={() => switchToLanguage()}>
        <Languages />
    </button>
</div>
