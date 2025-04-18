<script lang="ts">
  import { onMount } from 'svelte';
  import { getUserInfo } from '$lib/api/auth';
  import type { User } from '$lib/types/auth';

  let currentUser: User | null = null;
  let loading = true;

  onMount(async () => {
    try {
      currentUser = await getUserInfo();
    } catch (error) {
      console.error('Failed to get user info:', error);
    } finally {
      loading = false;
    }
  });
</script>

<slot {currentUser} {loading}></slot> 
