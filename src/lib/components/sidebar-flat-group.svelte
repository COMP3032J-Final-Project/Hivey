<script lang="ts">
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    let {
        groupName,
        items
    }: {
        groupName: string,
        items: {
            title: string,
            url: string
        }[]
    } = $props();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
    <Sidebar.GroupLabel>{groupName}</Sidebar.GroupLabel>
    <Sidebar.GroupContent>
        <Sidebar.Menu>
            {#each items as item}
                <Sidebar.MenuItem>
                    <Sidebar.MenuButton>
                        {#snippet child({ props })}
						                <a href={item.url} {...props}>
							                  <span>{item.title}</span>
						                </a>
					              {/snippet}
                    </Sidebar.MenuButton>
                </Sidebar.MenuItem>
            {/each}
        </Sidebar.Menu>
    </Sidebar.GroupContent>
</Sidebar.Group>
