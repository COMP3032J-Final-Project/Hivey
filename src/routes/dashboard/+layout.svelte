<script lang="ts" module>
	import FlatGroup from '$lib/components/sidebar-flat-group.svelte';
	import { Files, File, CirclePlus } from 'lucide-svelte';
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { currentNav, updateNav, openProjectDialog } from './store.svelte';
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { ChevronDown } from 'lucide-svelte';
	import { ProjectFormCategory } from '$lib/types/dashboard';
  import { mpd } from '$lib/trans';
	import { user } from './store.svelte';

	// 导航和资源数据
	const navData = {
		resources: [
			{
				title: mpd.documentation(),
				url: 'https://drive.google.com/file/d/1Dsz_1Af36AS22ohMIDBBXQ9LOjA4XROo/view?usp=drive_link'
			}
		],
		navMain: [
			{
				title: mpd.projects(),
				url: '#',
				icon: Files,
				isActive: true,
				items: [
					{
						title: mpd.all_projects(),
						url: '/dashboard/repository/projects/all'
					},
					{
						title: mpd.my_projects(),
						url: '/dashboard/repository/projects/mine'
					},
					{
						title: mpd.shared_with_me(),
						url: '/dashboard/repository/projects/shared'
					}
				]
			},
			{
				title: mpd.templates(),
				url: '#',
				icon: File,
				items: [
					{
						title: mpd.all_templates(),
						url: '/dashboard/repository/templates/all'
					},
					{
						title: mpd.favourite_templates(),
						url: '/dashboard/repository/templates/favourite'
					},
					{
						title: mpd.my_templates(),
						url: '/dashboard/repository/templates/mine'
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import NavMain from '$lib/components/sidebar-nav-main.svelte';
	import NavUser from './components/sidebar-nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { LayoutData } from './$types';

	let { data, children } = $props<{ data: LayoutData; children: any }>();
</script>

<Sidebar.Provider>
	<Sidebar.Root collapsible="icon" variant="inset">
    <Sidebar.Header>
      <Sidebar.Header>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuButton {...props} class="bg-primary text-primary-foreground hover:bg-primary/80 p-4">
                    <CirclePlus />
                    <span class="ml-2">{ mpd.create_project() }</span>
                    <ChevronDown class="ml-auto" />
                  </Sidebar.MenuButton>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="w-[--bits-dropdown-menu-anchor-width]">
                
                <!-- 创建空白项目 -->
                <DropdownMenu.Item onclick={() => openProjectDialog(ProjectFormCategory.Blank)}>
                  { mpd.blank_project() }
                </DropdownMenu.Item>

                <!-- 创建示例项目 -->
                <DropdownMenu.Item onclick={() => openProjectDialog(ProjectFormCategory.Example)}>
                  { mpd.example_project() }
                </DropdownMenu.Item>

                <!-- 创建上传项目 -->
                <DropdownMenu.Item onclick={() => openProjectDialog(ProjectFormCategory.Upload)}>
                  { mpd.upload_project() }
                </DropdownMenu.Item>

              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
    </Sidebar.Header>
		<Sidebar.Content>
			<NavMain groupName="Repository" items={navData.navMain} on:navSelect={(e) => updateNav(e.detail.group, e.detail.item)} />
			<FlatGroup groupName="Resources" items={navData.resources} />
		</Sidebar.Content>

		<Sidebar.Footer>
			<NavUser user={$user} />
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>

	<Sidebar.Inset class="flex flex-col">
		<header
			class="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">{$currentNav.group || 'Projects'}</Breadcrumb.Link>
						</Breadcrumb.Item>
						{#if $currentNav.item}
							<Breadcrumb.Separator class="hidden md:block" />
							<Breadcrumb.Item>
								<Breadcrumb.Page>{$currentNav.item}</Breadcrumb.Page>
							</Breadcrumb.Item>
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="flex-1 overflow-auto">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
