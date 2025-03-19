<script lang="ts">
	  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	  import { ChevronRight } from "lucide-svelte";
	  import { createEventDispatcher } from 'svelte';

	  const dispatch = createEventDispatcher();

	  let {
        groupName,
		    items,
	  }: {
        groupName: string,
		    items: {
			      title: string;
			      url: string;
			      // this should be `Component` after lucide-svelte updates types
			      // eslint-disable-next-line @typescript-eslint/no-explicit-any
			      icon?: any;
			      isActive?: boolean;
			      items?: {
				        title: string;
				        url: string;
			      }[];
		    }[];
	  } = $props();

	  function handleNavSelect(group: string, item: string) {
		  dispatch('navSelect', { group, item });
	  }
</script>

<Sidebar.Group>
	  <Sidebar.GroupLabel>{groupName}</Sidebar.GroupLabel>
	  <Sidebar.Menu>
		    {#each items as mainItem (mainItem.title)}
			      <Collapsible.Root>
				        {#snippet child({ props })}
					          <Sidebar.MenuItem {...props}>
						            <Collapsible.Trigger>
							              {#snippet child({ props })}
								                <Sidebar.MenuButton {...props}>
									                  {#snippet tooltipContent()}
										                    {mainItem.title}
									                  {/snippet}
									                  {#if mainItem.icon}
										                    <mainItem.icon />
									                  {/if}
									                  <span>{mainItem.title}</span>
									                  <ChevronRight
										                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
									                  />
								                </Sidebar.MenuButton>
							              {/snippet}
						            </Collapsible.Trigger>
						            <Collapsible.Content>
							              {#if mainItem.items}
								                <Sidebar.MenuSub>
									                  {#each mainItem.items as subItem (subItem.title)}
										                    <Sidebar.MenuSubItem>
											                      <Sidebar.MenuSubButton>
												                        {#snippet child({ props })}
													                          <a 
														                            href={subItem.url} 
														                            {...props}
														                            onclick={() => handleNavSelect(mainItem.title, subItem.title)}
													                          >
														                            <span>{subItem.title}</span>
													                          </a>
												                        {/snippet}
											                      </Sidebar.MenuSubButton>
										                    </Sidebar.MenuSubItem>
									                  {/each}
								                </Sidebar.MenuSub>
							              {/if}
						            </Collapsible.Content>
					          </Sidebar.MenuItem>
				        {/snippet}
			      </Collapsible.Root>
		    {/each}
	  </Sidebar.Menu>
</Sidebar.Group>
