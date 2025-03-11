<script lang="ts">
    import * as m from '$lib/paraglide/messages';
</script>

<footer class="bg-muted py-12">
    <div class="max-w-7xl mx-auto px-6 md:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-6 md:mb-0">
                <a href="/" class="text-xl font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    { m.app_name() }
                </a>
                <p class="mt-2 text-sm text-muted-foreground">{m.the_collaborative_editor_for_all_your_document_formats()}</p>
            </div>
            
            <div class="flex gap-6">
                <a href="https://drive.google.com/file/d/1Dsz_1Af36AS22ohMIDBBXQ9LOjA4XROo/view?usp=drive_link" target="_blank" rel="noopener noreferrer" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{m.about()}</a>
                <a href="/features" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{m.features()}</a>
                <a href="#pricing" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{m.pricing()}</a>
                <a href="/contact" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{m.contact()}</a>
            </div>
        </div>
        
        <div class="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p class="text-sm text-muted-foreground">© {new Date().getFullYear()} { m.app_name() }. {m.all_rights_reserved()}</p>
            <div class="flex gap-4 mt-4 md:mt-0">
                <a href="/terms" class="text-xs text-muted-foreground hover:text-foreground transition-colors">{m.terms()}</a>
            </div>
        </div>
    </div>
</footer> 