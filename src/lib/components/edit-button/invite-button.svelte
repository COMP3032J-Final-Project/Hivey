<script lang="ts">
  import { UserRoundPlus } from 'lucide-svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  
  let inviteeName = '';
  
  function handleInvite() {
    console.log('Inviting:', inviteeName);
    inviteeName = '';
  }
</script>

<div>
  <AlertDialog.Root>
    <AlertDialog.Trigger>
      <Button class="rounded-full" variant="ghost" size="icon">
        <UserRoundPlus />
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Invite New Member</AlertDialog.Title>
      </AlertDialog.Header>
      <div>
        <Input 
          type="text" 
          placeholder="Enter member's name" 
          bind:value={inviteeName}
        />
      </div>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action onclick={handleInvite}>Invite</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
