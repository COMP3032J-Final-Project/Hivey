<script lang="ts">
  import { mpae, mpp, mpd } from '$lib/trans';
  import { UserRoundPlus } from 'lucide-svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { postAddProjectMember } from '$lib/api/project';
  import { success } from '$lib/components/ui/toast';
  import { UserPermissionEnum } from '$lib/types/auth';
  let { currentUser, projectId } = $props();
  let isOpen = $state(false);
  let inviteeName = $state('');
  let inviteePermission = $state(UserPermissionEnum.Writer);
  let errorMessage = $state('');
  
  async function handleInvite() {
    if (!inviteeName.trim()) {
      errorMessage = mpae.empty_username();
      return;
    }
    errorMessage = '';
    try {
      await postAddProjectMember({ currentUser, projectId, inviteeName: inviteeName.trim(), inviteePermission: inviteePermission });
      success(mpp.success_invite_member());
      inviteeName = '';
      isOpen = false;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invitation failed, please try again later';
      errorMessage = message;
    }
  }

</script>

<div>
  <AlertDialog.Root bind:open={isOpen}>
    <AlertDialog.Trigger>
      <Button class="rounded-full" variant="ghost" size="icon">
        <UserRoundPlus />
      </Button>
    </AlertDialog.Trigger>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>{mpp.invite_member()}</AlertDialog.Title>
        <AlertDialog.Description>
          {mpp.invite_member_description()}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <div class="space-y-4">
        <Input 
          type="text" 
          placeholder={mpp.invite_member_placeholder()} 
          bind:value={inviteeName}
          onkeydown={(e) => {
            if (e.key === 'Enter') handleInvite();
          }}
        />
        {#if errorMessage}
          <div class="text-destructive text-sm">{errorMessage}</div>
        {/if}
      </div>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>{mpd.cancel()}</AlertDialog.Cancel>
        <AlertDialog.Action onclick={handleInvite}>{mpp.invite()}</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
