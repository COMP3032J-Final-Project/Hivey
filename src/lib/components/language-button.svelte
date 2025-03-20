<script lang="ts">
    import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	  import { page } from '$app/state';
    import { Languages } from 'lucide-svelte';
</script>

<div>
    <a  data-sveltekit-reload
        href={localizeHref(page.url.pathname, { locale: getLocale() === 'en' ? 'zh-cn' : 'en' })}
    >
    	  <Languages />
    </a>
</div>
