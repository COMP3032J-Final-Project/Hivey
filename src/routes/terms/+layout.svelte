<script lang="ts">
    import * as m from '$lib/paraglide/messages';
    import { Button } from "$lib/components/ui/button/index";
    import { fade } from 'svelte/transition';
    
    let { children } = $props();
    let mobileMenuOpen = $state(false);
    
    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }

    const today = new Date().toLocaleDateString();
</script>

<div class="flex flex-col min-h-screen">
    <div class="bg-primary/10">
        <header class="relative z-10">
            <nav class="flex justify-between items-center p-6 px-8 max-w-7xl mx-auto">
                <a href="/" class="text-3xl font-bold flex items-center gap-2">
                    <enhanced:img class="w-12 h-12" src="$lib/images/logo.svg" alt="Logo" />
                    <span>{ m.app_name() }</span>
                </a>
                
                <!-- Desktop Navigation -->
                <div class="hidden md:flex items-center gap-8">
                    <div class="flex items-center gap-4">
                        <Button href="/auth/signin" variant="link" class="text-primary-foreground font-medium">{ m.sign_in() }</Button>
                        <Button variant="secondary" href="/auth/signup" class="shadow-md hover:shadow-lg transition-all duration-300">{ m.sign_up() }</Button>
                    </div>
                </div>

                <!-- Mobile Menu Button -->
                <button class="md:hidden focus:outline-none" on:click={toggleMobileMenu}>
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-16 6h16"}/>
                    </svg>
                </button>
            </nav>
            
            <!-- Mobile Menu -->
            {#if mobileMenuOpen}
                <div class="md:hidden px-8 pb-6 pt-2 bg-primary/90 absolute w-full" transition:fade={{ duration: 200 }}>
                    <div class="flex flex-col space-y-4">
                        <Button href="/auth/signin" variant="link" class="text-primary-foreground justify-start">{m.sign_in()}</Button>
                        <Button variant="secondary" href="/auth/signup" class="shadow">{m.sign_up()}</Button>
                    </div>
                </div>
            {/if}
        </header>

        <div class="max-w-5xl mx-auto px-6 md:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Privacy & Terms</h2>
            <p class="text-lg text-muted-foreground mb-2">
                Last Modified: {today}
            </p>
            <p class="text-lg text-muted-foreground mb-2">
                Thank you for using {m.app_name()}! 
            </p>
            <p class="text-lg text-muted-foreground mb-6">
                Below, you can find our Privacy Policy and Terms of Service for using {m.app_name()} website and services. If you have any questions or concerns, please <a href="#" class="underline">get in touch with us</a>.
            </p>

            <h3 class="text-2xl font-bold mb-4">Privacy Policy</h3>
            <h4 class="text-xl font-bold mb-2">What Information Do We Collect?</h4>
            <p class="text-lg text-muted-foreground mb-2">
                We gather several categories of information to enhance your experience and ensure service security.  When signing up, you provide personal details such as your name and email.  If you opt for a paid plan, payment information is also collected.  While using our services, we automatically collect usage data, including project creation and file uploads, as well as technical information like your device type, OS, browser version, and IP address.  This helps us analyze usage patterns and improve service quality.
            </p>
            <p class="text-lg text-muted-foreground mb-2">
                If you integrate third-party services like Google Drive or Dropbox with Hivey, we collect relevant account details and files you choose to upload.  We also use cookies and similar technologies to recognize your device, maintain session continuity, and gather analytical data about your interactions.  With your consent, we may collect data from external sources such as social media profiles or publicly available information you’ve shared online.  This helps us enhance your experience by integrating relevant content from these platforms into our services.
            </p>
            <p class="text-lg text-muted-foreground mb-4">
                Overall, our goal is to collect only the information necessary to provide you with the best possible service while maintaining transparency about what data we gather and how it’s used.
            </p>

            <h4 class="text-xl font-bold mb-2">How Do We Use Your Information?</h4>
            <p class="text-lg text-muted-foreground mb-2">
                We use the collected information to enhance your experience, operate our services effectively, and communicate with you meaningfully. Your data enables us to provide and personalize the services you request, such as securely storing your projects and offering customized features based on your preferences.
            </p>
            <p class="text-lg text-muted-foreground mb-2">
                Your information is crucial for maintaining service security and integrity. We monitor accounts for suspicious activity and use technical details like IP addresses to prevent unauthorized access and fraud. Additionally, we may use your data to comply with legal obligations, such as responding to court orders or subpoenas, ensuring our services operate within the bounds of the law.
            </p>
            <p class="text-lg text-muted-foreground mb-2">
                We might share your information with trusted third-party service providers who assist in delivering our services, like cloud storage or payment processing partners. These providers are contractually obligated to protect your data and use it only for specified purposes. In rare cases, we may also disclose your data if required by law or to protect our rights, property, or safety, as well as that of our users and the public.
            </p>
            <p class="text-lg text-muted-foreground mb-4">
                We are committed to ensuring your data is used responsibly and transparently. We will always strive to inform you about how your information is being used and will provide options for you to control your data where appropriate.
            </p>

            <h4 class="text-xl font-bold mb-2">What Are Your Rights?</h4>
            <p class="text-lg text-muted-foreground mb-2">
                We recognize and respect your rights over your personal data. Depending on the jurisdiction you are in, you may have the following privacy-related rights:
            </p>
            <ul class="list-disc list-inside text-lg text-muted-foreground mb-6">
                <li>Access: You can request access to the personal data we hold about you to review and verify its accuracy.</li>
                <li>Rectification: You have the right to request correction or updating of your personal data if it is inaccurate or incomplete.</li>
                <li>Deletion: You may ask us to delete your personal data, subject to legal and operational constraints.</li>
                <li>Restriction of Processing: In certain cases, you can request that we limit the processing of your personal data.</li>
                <li>Data Portability: You have the right to receive your personal data in a structured, commonly used, and machine-readable format.</li>
                <li>Objection: You can object to the processing of your personal data in certain circumstances, such as direct marketing.</li>
                <li>Withdrawal of Consent: If you have consented to the processing of your data, you may withdraw your consent at any time.</li>
            </ul>

            <h3 class="text-2xl font-bold mb-4">Terms of Service</h3>
            <h4 class="text-xl font-bold mb-2">Acceptable Use</h4>
            <p class="text-lg text-muted-foreground mb-4">
                By using Hivey, you agree to comply with and be bound by these Terms of Service.  If you do not agree to these terms, you may not use our services.  You are responsible for ensuring that your use of Hivey complies with all applicable laws and regulations.
            </p>
            <h4 class="text-xl font-bold mb-2">Account Registration and Security</h4>
            <p class="text-lg text-muted-foreground mb-4">
                To access certain features of Hivey, you may need to register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security.
            </p>
            <h4 class="text-xl font-bold mb-2">Service Availability</h4>
            <p class="text-lg text-muted-foreground mb-10">
                We aim to provide continuous service, but we may need to suspend or modify services due to maintenance, emergencies, or other circumstances beyond our control. We will make reasonable efforts to notify you of any planned service interruptions.
            </p>
        </div>

    </div>
    
    <!-- Footer -->
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
                    <p class="mt-2 text-sm text-muted-foreground">The collaborative editor for all your document formats.</p>
                </div>
                
                <div class="flex gap-6">
                    <a href="https://drive.google.com/file/d/1Dsz_1Af36AS22ohMIDBBXQ9LOjA4XROo/view?usp=drive_link"  target="_blank" rel="noopener noreferrer" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{m.about()}</a>
                    <a href="/features" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                    <a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{m.pricing()}</a>
                    <a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{m.contact()}</a>
                </div>
            </div>
            
            <div class="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
                <p class="text-sm text-muted-foreground">© {new Date().getFullYear()} { m.app_name() }. All rights reserved.</p>
                <div class="flex gap-4 mt-4 md:mt-0">
                    <a href="/terms" class="text-xs text-muted-foreground hover:text-foreground transition-colors">{m.terms()}</a>
                </div>
            </div>
        </div>
    </footer>    
</div>
