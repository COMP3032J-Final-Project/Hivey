<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from '$lib/components/ui/button';
    import { fade } from 'svelte/transition';
    
    import image1 from '$lib/images/demoslide/1.png';
    import image2 from '$lib/images/demoslide/2.png';
    import image3 from '$lib/images/demoslide/3.png';
    import image4 from '$lib/images/demoslide/4.png';
    import image5 from '$lib/images/demoslide/5.png';
    import image6 from '$lib/images/demoslide/6.png';
    import image7 from '$lib/images/demoslide/7.png';
    import image8 from '$lib/images/demoslide/8.png';
    import image9 from '$lib/images/demoslide/9.png';
    import image10 from '$lib/images/demoslide/10.png';
    import image11 from '$lib/images/demoslide/11.png';
    import image12 from '$lib/images/demoslide/12.png';
    import image13 from '$lib/images/demoslide/13.png';
    import image14 from '$lib/images/demoslide/14.png';
    
    let activeCompetitor = 0;
    
    // Competitors list
    const competitors = [
        {
            name: "Overleaf, Typst, HedgeDoc",
            advantages: [
                `${m.hivey_competitor_features_1()}`,
                `${m.hivey_competitor_features_2()}`,
                `${m.hivey_competitor_features_3()}`
            ]
        },
        {
            name: "Google Docs, Framapad, Tecent Docs",
            advantages: [
                `${m.hivey_competitor_features_1()}`,
                `${m.hivey_competitor_features_4()}`,
                `${m.hivey_competitor_features_5()}`
            ]
        },
        {
            name: "Rustpad, Codeshare",
            advantages: [
                `${m.hivey_competitor_features_6()}`,
                `${m.hivey_competitor_features_7()}`,
                `${m.hivey_competitor_features_8()}`
            ]
        }
    ];
    
    // Feature screenshot images for the sliding gallery
    const featureScreenshots = [
        {
            src: image1,
            alt: "demo1 slide 1"
        },
        {
            src: image2,
            alt: "demo1 slide 2"
        },
        {
            src: image3,
            alt: "demo1 slide 3"
        },
        {
            src: image4,
            alt: "demo1 slide 4"
        },
        {
            src: image5,
            alt: "demo1 slide 5"
        },
        {
            src: image6,
            alt: "demo1 slide 6"
        },
        {
            src: image7,
            alt: "demo1 slide 7"
        },
        {
            src: image8,
            alt: "demo1 slide 8"
        },
        {
            src: image9,
            alt: "demo1 slide 9"
        },
        {
            src: image10,
            alt: "demo1 slide 10"
        },
        {
            src: image11,
            alt: "demo1 slide 11"
        },
        {
            src: image12,
            alt: "demo1 slide 12"
        },
        {
            src: image13,
            alt: "demo1 slide 13"
        },
        {
            src: image14,
            alt: "demo1 slide 14"
        }
    ];
    
    function setActiveCompetitor(index: number) {
        activeCompetitor = index;
    }
    
</script>

<svelte:head>
    <title>{m.features()} | {m.app_name()}</title>
    <meta name="description" content={`${m.features()} for ${m.app_name()}`} />
</svelte:head>

<div class="max-w-6xl mx-auto px-6 md:px-8">
    <!-- <h1 class="text-4xl md:text-5xl font-bold mb-8">{m.features()}</h1> -->
    
    <!-- Feature Screenshots Gallery -->
    <section class="my-12" in:fade={{ duration: 300}}>
        <h2 class="text-3xl font-bold mb-6 text-center">{m.overview_of_hivey()}</h2>
        <p class="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
            {m.one_editor_all_formats_description()}
        </p>
        <div class="relative overflow-hidden">
            <div class="slider-container relative w-full py-6 overflow-hidden min-h-[180px]">
                <div class="slide-track flex">
                    {#each [...featureScreenshots, ...featureScreenshots] as screenshot, i}
                        <div class="slide flex-shrink-0 w-[200px] md:w-[250px] lg:w-[300px] px-4 py-2">
                            <img 
                                src={screenshot.src} 
                                alt={screenshot.alt}
                                class="w-full max-h-[240px] object-contain rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
                                loading={i > 3 ? "lazy" : "eager"} 
                            />
                        </div>
                    {/each}
                </div>
                
                <!-- Gradient masks -->
                <div class="absolute left-0 top-0 h-full w-[100px] z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"></div>
                <div class="absolute right-0 top-0 h-full w-[100px] z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"></div>
            </div>
        </div>
    </section>
    
    <!-- 主要功能部分可以在这里添加 -->
    
    <section id="why-use" class="my-12"  in:fade={{ duration: 300 }}>
        <h2 class="text-3xl font-bold mb-6">{m.why_use_hivey()}</h2>
        
        <div class="grid md:grid-cols-5 gap-8">
            <div class="md:col-span-2">
                <ul id="advantage-buttons" class="flex flex-col gap-2">
                    {#each competitors as competitor, i}
                        <li class="w-full">
                            <button 
                                class="w-full py-4 px-6 text-left text-lg rounded-lg bg-background border
                                {i === activeCompetitor ? 'active bg-primary/20 font-medium' : ''}" 
                                aria-pressed={i === activeCompetitor}
                                on:click={() => setActiveCompetitor(i)}
                            >
                                {competitor.name}
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>
            
            <div class="md:col-span-3">
                <div>
                    <h3 class="text-xl font-semibold mb-4">{m.app_name()}...</h3>
                    <ul class="space-y-3 list-disc pl-6">
                        {#each competitors[activeCompetitor].advantages as advantage}
                            <li>
                                <span>{advantage}</span>
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section id="cta" class="my-12 py-16relative overflow-hidden bg-gradient-to-br from-primary/60 to-primary/20 bg-cover shadow-xl rounded-2xl" in:fade={{ duration: 300 }}>
        <div class="absolute inset-0 backdrop-blur-md -z-10"></div>
        
        <div class="max-w-4xl mx-auto text-center py-16 px-6 relative z-10">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">{m.try_it_now()}</h2>
            
            <p class="text-xl mb-10 max-w-4xl mx-auto">
                {m.try_it_now_description()}
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" href="/auth/signup">
                    {m.try_it_now_button()}
                </Button>
                <Button size="lg" href="https://github.com/COMP3032J-Final-Project/Hivey">
                    {m.github_button()}
                    <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </Button>
            </div>
        </div>
    </section>

</div>

<style>
    #advantage-buttons button.active {
        border-color: var(--color-primary);
    }
    
    #advantage-buttons button {
        transform-origin: center;
        transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
    }
    
    .slide-track {
        width: calc(300px * 28);
        animation: scroll 50s linear infinite;
    }
    
    .slide-track:hover {
        animation-play-state: paused;
    }
    
    @keyframes scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(calc(-300px * 14));
        }
    }
    
    @media (max-width: 768px) {
        .slide-track {
            width: calc(250px * 28);
        }
        
        @keyframes scroll {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(calc(-250px * 14));
            }
        }
    }
    
    @media (max-width: 480px) {
        .slide-track {
            width: calc(200px * 28);
        }
        
        @keyframes scroll {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(calc(-200px * 14));
            }
        }
    }
</style>
