<script lang="ts" module>
	import FlatGroup from '$lib/components/sidebar-flat-group.svelte';
	import { Files, File } from 'lucide-svelte';
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { currentNav, updateNav, dialogOpen, dialogCategory, openProjectDialog } from './store.svelte';
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { ChevronDown } from 'lucide-svelte';
	import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import NewProjectDialog from './repository/[type]/[category]/components/alert-dialog.svelte';
	import type { NewProjectCategory } from './repository/[type]/[category]/components/alert-dialog.svelte';
	
	// 导航和资源数据
	const navData = {
		resources: [
			{
				title: 'Documentation',
				url: 'https://drive.google.com/file/d/1Dsz_1Af36AS22ohMIDBBXQ9LOjA4XROo/view?usp=drive_link'
			}
		],
		navMain: [
			{
				title: 'Projects',
				url: '#',
				icon: Files,
				isActive: true,
				items: [
					{
						title: 'All Projects',
						url: '/dashboard/repository/projects/all'
					},
					{
						title: 'My Projects',
						url: '/dashboard/repository/projects/mine'
					},
					{
						title: 'Shared with Me',
						url: '/dashboard/repository/projects/shared'
					}
				]
			},
			{
				title: 'Templates',
				url: '#',
				icon: File,
				items: [
					{
						title: 'All Templates',
						url: '/dashboard/repository/templates/all'
					},
					{
						title: 'Favourite Templates',
						url: '/dashboard/repository/templates/favourite'
					},
					{
						title: 'My Templates',
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
	import type { User } from '$lib/types/auth';

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
                  <Sidebar.MenuButton {...props}>
                    Create Project
                    <ChevronDown class="ml-auto" />
                  </Sidebar.MenuButton>
                {/snippet}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="w-[--bits-dropdown-menu-anchor-width]">
                
                <!-- 创建空白项目 -->
                <DropdownMenu.Item onclick={() => openProjectDialog('blank')}>
                  Blank Project
                </DropdownMenu.Item>

                <!-- 创建示例项目 -->
                <DropdownMenu.Item onclick={() => openProjectDialog('example')}>
                  Example Project
                </DropdownMenu.Item>

                <!-- 创建上传项目 -->
                <DropdownMenu.Item onclick={() => openProjectDialog('upload')}>
                  Upload Project
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
			<NavUser user={data.user} />
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
