<script lang="ts">
    import { ChevronRight, Ellipsis, Pencil, Trash2 } from "lucide-svelte";
    import * as Sidebar from '$lib/components/ui/sidebar/index.js';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import * as Collapsible from '$lib/components/ui/collapsible/index.js';
    import { writable } from 'svelte/store';
    import RenameDialog from "./rename_dialog.svelte";
    import DeleteDialog from "./delete_dialog.svelte";
  
    export let item;
    export let onFileClick;
    const isOpen = writable(false);
</script>
  
{#if item.filetype === "file"}
  <Sidebar.MenuItem>
    <Sidebar.MenuButton onclick={() => onFileClick(item)}>
      {#snippet child({ props })}
        <a {...props}>
          <span>{item.filename}</span>
        </a>
      {/snippet}
    </Sidebar.MenuButton>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuAction {...props}>
            <Ellipsis />
          </Sidebar.MenuAction>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="right" align="start">
        <DropdownMenu.Item class="flex justify-between items-center">
          <RenameDialog file={item}/>
        </DropdownMenu.Item>
        <DropdownMenu.Item class="flex justify-between items-center">
          <DeleteDialog file={item}/>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
{:else if item.filetype === "folder"}
  <Collapsible.Root class="group/collapsible"  bind:open={$isOpen}>
    <Sidebar.MenuItem>
      <Collapsible.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton {...props} onclick={() => isOpen.update(v => !v)}>
            {#snippet tooltipContent()}
              {item.filename}
            {/snippet}
            <ChevronRight
              class="transition-transform duration-200 { $isOpen ? 'rotate-90' : '' }"
            />
            <span>{item.filename}</span>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuAction {...props}>
                    <Ellipsis />
                  </Sidebar.MenuAction>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content side="right" align="start">
                <DropdownMenu.Item class="flex justify-between items-center">
                  <RenameDialog file={item}/>
                </DropdownMenu.Item>
                <DropdownMenu.Item class="flex justify-between items-center">
                  <DeleteDialog file={item}/>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Sidebar.MenuButton>
        {/snippet}
      </Collapsible.Trigger>
      <Collapsible.Content>
        {#if item.children}
          <Sidebar.MenuSub>
            {#each item.children as child (child.id)}
              <svelte:self item={child} onFileClick={onFileClick} />
            {/each}
          </Sidebar.MenuSub>
        {/if}
      </Collapsible.Content>
    </Sidebar.MenuItem>
  </Collapsible.Root>
{/if}