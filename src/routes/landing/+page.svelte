<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
</script>

<!-- Features Section -->
<div class="py-16 md:py-24 bg-background">
    <div class="max-w-7xl mx-auto px-6 md:px-8">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Hivey?</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="flex flex-col items-center text-center p-6 rounded-lg">
                <div class="bg-primary/10 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Multi-Format Support</h3>
                <p class="text-muted-foreground">Switch between Typst, LaTeX, and Markdown without leaving your document.</p>
            </div>
            
            <!-- Feature 2 -->
            <div class="flex flex-col items-center text-center p-6 rounded-lg">
                <div class="bg-primary/10 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Real-Time Collaboration</h3>
                <p class="text-muted-foreground">Work with your team in real-time with seamless synchronization and no conflicts.</p>
            </div>
            
            <!-- Feature 3 -->
            <div class="flex flex-col items-center text-center p-6 rounded-lg">
                <div class="bg-primary/10 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd" />
                    </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">Live Preview</h3>
                <p class="text-muted-foreground">See your changes instantly with a side-by-side preview that updates as you type.</p>
            </div>
        </div>
        
        <div class="text-center mt-16">
            <Button variant="outline" class="border-primary/20 hover:bg-primary/5">
                Explore all features
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </Button>
        </div>
    </div>
</div>

