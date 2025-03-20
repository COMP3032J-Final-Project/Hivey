<script lang="ts">
    import '../app.css';
    let { children } = $props();
    import { ProgressBar } from "@prgm/sveltekit-progress-bar";
    import Toast from '$lib/components/ui/toast/Toast.svelte';  // 使用自定义Toast组件
</script>

<!-- Toast组件 -->
<Toast />

<ProgressBar class="text-primary" />

{@render children()}
