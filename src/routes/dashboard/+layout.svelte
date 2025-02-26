<script lang="ts" module>
    import FlatGroup from '$lib/components/sidebar-flat-group.svelte';
    import { Files, File } from 'lucide-svelte';

	  // Sample data.
	  const data = {
		    user: {
			      name: "shadcn",
			      email: "m@example.com",
			      avatar: "/avatars/shadcn.jpg",
		    },
        recentProjects: [
            {
                'title': 'project 0',
                'url': '#',
            },
            {
                'title': 'Project 1',
                'url': '#',
            }
        ],
        resources: [
            {
                'title': 'Template Universe',
                'url': '#',
            },
            {
                'title': 'Documentation',
                'url': '#'
            }
        ],
		    navMain: [
			      {
				        title: "Projects",
				        url: "#",
				        icon: Files,
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
					          },
				        ],
			      },
			      {
				        title: "Templates",
				        url: "#",
				        icon: File,
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
				        ],
			      }
		    ]
	  };
</script>

<script lang="ts">
    
    import NavMain from "$lib/components/sidebar-nav-main.svelte";
	  import NavUser from "./components/sidebar-nav-user.svelte";
	  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    
    let { children } = $props();

</script>

<Sidebar.Provider>
    <Sidebar.Root collapsible="icon" variant="inset">
	      <Sidebar.Content>
		        <NavMain groupName="Project" items={data.navMain} />

            <FlatGroup groupName="Recent Projects" items={data.recentProjects}/>
            <FlatGroup groupName="Resources" items={data.resources}/>
	      </Sidebar.Content>
	      <Sidebar.Footer>
		        <NavUser user={data.user} />
	      </Sidebar.Footer>
	      <Sidebar.Rail />
    </Sidebar.Root>

    <Sidebar.Inset>
        {@render children()}
    </Sidebar.Inset>
</Sidebar.Provider>
