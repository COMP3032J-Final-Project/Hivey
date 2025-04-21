<script lang="ts">
  import { mpae, mpp, mpd } from '$lib/trans';
  import { UserRoundPlus } from 'lucide-svelte';
  import { Button } from "$lib/components/ui/button/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { addProjectMember } from '$lib/api/project';
  import { success } from '$lib/components/ui/toast';
  import { UserPermissionEnum } from '$lib/types/auth';
  import type { User } from '$lib/types/auth';
  import { getProjectMembers } from '$lib/api/project';
  import { setMembers, addMember } from '../../store.svelte';
  import { getContext } from 'svelte';
  import type { WebSocketClient } from '$lib/api/websocket';

  let { currentUser, projectId } = $props();
  const getWsClient = getContext<() => WebSocketClient | null>('websocket-client'); // 从context中获取WebSocket客户端的函数
	let wsClient = $derived(getWsClient ? getWsClient() : null); // 获取当前的wsClient实例
  let isOpen = $state(false);
  let inviteeName = $state('');
  let inviteePermission = $state<UserPermissionEnum>(UserPermissionEnum.Writer);
  let errorMessage = $state('');
  let permissionOptions = $state<Array<{value: UserPermissionEnum, label: string}>>([]);

  $effect(() => {
    if (wsClient) {
      if (!wsClient.memberInvitedHandler) {
        wsClient.memberInvitedHandler = (invitee: User) => {
          addMember(invitee);
        }
      }
    }

    // 根据当前用户权限设置可选的权限选项
    if (currentUser.permission === UserPermissionEnum.Owner) {
      permissionOptions = [
        { value: UserPermissionEnum.Admin, label: mpp.permission_admin() },
        { value: UserPermissionEnum.Writer, label: mpp.permission_writer() },
        { value: UserPermissionEnum.Viewer, label: mpp.permission_viewer() }
      ];
    } else if (currentUser.permission === UserPermissionEnum.Admin) {
      permissionOptions = [
        { value: UserPermissionEnum.Writer, label: mpp.permission_writer() },
        { value: UserPermissionEnum.Viewer, label: mpp.permission_viewer() }
      ];
    } else {
      permissionOptions = [
        { value: UserPermissionEnum.Writer, label: mpp.permission_writer() }
      ];
    }
  });
  
  function handleSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    inviteePermission = target.value as UserPermissionEnum;
  }
  
  async function handleInvite() {
    if (!inviteeName.trim()) {
      errorMessage = mpae.empty_username();
      return;
    }
    errorMessage = '';
    try {
      const response = await addProjectMember({ 
        currentUser, 
        projectId, 
        inviteeName: inviteeName.trim(), 
        inviteePermission
      });
      
      // 更新全局成员状态
      const membersData: User[] = await getProjectMembers(projectId);
      membersData.forEach(member => {
          if (!member.avatar) {
              const avatar = member.username.slice(0, 2).toUpperCase();
              member.avatar = `https://ui-avatars.com/api/?name=${avatar}`;
          }
      });
      setMembers(membersData);
      
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
      <Tooltip.Root>
        <Tooltip.Trigger>
          <Button class="rounded-full" variant="ghost" size="icon">
            <UserRoundPlus />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Invite Member
        </Tooltip.Content>
      </Tooltip.Root>
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
        
        <div class="pt-2">
          <label for="permission-select" class="text-sm font-medium mb-2 block">
            {mpp.member_permission()}
          </label>
          <select 
            id="permission-select"
            class="w-full border rounded-md h-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-background"
            value={inviteePermission}
            onchange={handleSelectChange}
          >
            {#each permissionOptions as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
        
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
