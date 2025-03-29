<script lang="ts">
  import { m, mpm, mpma } from '$lib/trans';
  import yang from '$lib/images/team/yang.jpg';
  import tao from '$lib/images/team/tao.jpg';
  import zhao from '$lib/images/team/zhao.jpg';
  import chen from '$lib/images/team/chen.jpg';
  import rao from '$lib/images/team/rao.jpg';
  import zhai from '$lib/images/team/zhai.jpg';
</script>

<svelte:head>
  <title>{mpm.about_us()} | {m.app_name()}</title>
  <meta name="description" content={`${mpm.about_us()} for ${m.app_name()}`} />
</svelte:head>

<section id="team-members" class="mb-8">
  <h3 class="text-3xl mb-6 text-center">{mpma.team_members()}</h3>
    
  <ul class="grid grid-cols-1 md:grid-cols-3 gap-8 list-none p-0">
    <!-- Team Member 1 -->
    <li class="flex flex-col items-center">
      <img 
        src={yang} 
        alt="{mpma.yang()}" 
        width="200" 
        height="200" 
        class="rounded-full"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      >
      <div class="flex items-center justify-center gap-2 mt-4">
        <h2 class="text-xl font-medium mb-0">{mpma.yang()}</h2>
        <div class="flex gap-2">
          <a href="https://github.com/Ziqi-Yang" aria-label="{mpma.yang()}'s GitHub" class="text-muted-foreground hover:text-primary">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="text-muted-foreground">{mpma.yang_description()}</div>
      <div class="text-sm mb-4">{mpma.ucd_number()}: 21207440</div>
    </li>
    <!-- Team Member 2 -->
    <li class="flex flex-col items-center">
      <img 
        src={tao} 
        alt="{mpma.tao()}" 
        width="200" 
        height="200" 
        class="rounded-full"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      >
      <div class="flex items-center justify-center gap-2 mt-4">
        <h2 class="text-xl font-medium mb-0">{mpma.tao()}</h2>
        <div class="flex gap-2">
          <a href="https://github.com/641217688tly" aria-label="{mpma.tao()}'s GitHub" class="text-muted-foreground hover:text-primary">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="text-muted-foreground">{mpma.tao_description()}</div>
      <div class="text-sm mb-4">{mpma.ucd_number()}: 21207500</div>
    </li>
        
    <!-- Team Member 3 -->
    <li class="flex flex-col items-center">
      <img 
        src={zhao} 
        alt="{mpma.zhao()}" 
        width="200" 
        height="200" 
        class="rounded-full"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      >
      <div class="flex items-center justify-center gap-2 mt-4">
        <h2 class="text-xl font-medium mb-0">{mpma.zhao()}</h2>
        <div class="flex gap-2">
          <a href="https://github.com/AuroraZoer" aria-label="{mpma.zhao()}'s GitHub" class="text-muted-foreground hover:text-primary">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="text-muted-foreground">{mpma.zhao_description()}</div>
      <div class="text-sm mb-4">{mpma.ucd_number()}: 21207295</div>
    </li>
        
    <!-- Team Member 4 -->
    <li class="flex flex-col items-center">
      <img 
        src={chen} 
        alt="{mpma.chen()}" 
        width="200" 
        height="200" 
        class="rounded-full"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      >
      <div class="flex items-center justify-center gap-2 mt-4">
        <h2 class="text-xl font-medium mb-0">{mpma.chen()}</h2>
        <div class="flex gap-2">
          <a href="https://github.com/cnapop" aria-label="{mpma.chen()}'s GitHub" class="text-muted-foreground hover:text-primary">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="text-muted-foreground">{mpma.chen_description()}</div>
      <div class="text-sm mb-4">{mpma.ucd_number()}: 21207327</div>
    </li>
        
    <!-- Team Member 5 -->
    <li class="flex flex-col items-center">
      <img 
        src={rao} 
        alt="{mpma.rao()}" 
        width="200" 
        height="200" 
        class="rounded-full"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      >
      <div class="flex items-center justify-center gap-2 mt-4">
        <h2 class="text-xl font-medium mb-0">{mpma.rao()}</h2>
        <div class="flex gap-2">
          <a href="https://github.com/LegendBug" aria-label="{mpma.rao()}'s GitHub" class="text-muted-foreground hover:text-primary">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="text-muted-foreground">{mpma.rao_description()}</div>
      <div class="text-sm mb-4">{mpma.ucd_number()}: 21207497</div>
    </li>
        
    <!-- Team Member 6 -->
    <li class="flex flex-col items-center">
      <img 
        src={zhai} 
        alt="{mpma.zhai()}" 
        width="200" 
        height="200" 
        class="rounded-full"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
      >
      <div class="flex items-center justify-center gap-2 mt-4">
        <h2 class="text-xl font-medium mb-0">{mpma.zhai()}</h2>
        <div class="flex gap-2">
          <a href="https://github.com/Prethea-Phoenixia" aria-label="{mpma.zhai()}'s GitHub" class="text-muted-foreground hover:text-primary">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="text-muted-foreground">{mpma.zhai_description()}</div>
      <div class="text-sm mb-4">{mpma.ucd_number()}: 21207331</div>
    </li>
  </ul>
</section>
