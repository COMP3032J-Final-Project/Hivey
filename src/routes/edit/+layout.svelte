<script lang="ts" module>
    import { Folder, File } from 'lucide-svelte';

	  // Sample data.
	  const data = {
		navMain: [
		{
			title: "Projects",
			url: "#",
			icon: Folder,
			isActive: true,
			items: [
			{
				title: "All",
				url: "#",
			},
			{
				title: "Mine",
				url: "#",
			},
			{
				title: "Shared with Me",
				url: "#",
			},],
		},
		{
			title: "Templates",
			url: "#",
			icon: Folder,
			items: [
			{
				title: "All",
				url: "#",
			},
			{
				title: "Mine",
				url: "#",
			},
			{
				title: "Shared with Me",
				url: "#",
			},
			{
				title: "Favourite",
				url: "#",
			},],
		}]
	  };
</script>

<script lang="ts">
    import NavMain from "./components/sidebar-nav-main.svelte";
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";

    let { children } = $props();

</script>

<Sidebar.Provider>
    <Sidebar.Root collapsible="icon" variant="inset">
	      <Sidebar.Content>
		    <NavMain groupName="Project" items={data.navMain} />
	      </Sidebar.Content>
	      <Sidebar.Rail />
    </Sidebar.Root>

    <Sidebar.Inset>
        {@render children()}
    </Sidebar.Inset>
</Sidebar.Provider>
