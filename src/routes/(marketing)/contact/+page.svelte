<script lang="ts">
      import * as m from '$lib/paraglide/messages';
      import * as Card from "$lib/components/ui/card/index.js";
	  import { Input } from "$lib/components/ui/input/index.js";
	  import { Label } from "$lib/components/ui/label/index.js";
      import { Button } from "$lib/components/ui/button/index.js";
      import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<svelte:head>
    <title>{m.contact()} | {m.app_name()}</title>
    <meta name="description" content={`${m.contact()} for ${m.app_name()}`} />
</svelte:head>

<Card.Root>
    <Card.Header>
        <Card.Title>{m.contact_us()}</Card.Title>
        <Card.Description>{m.contact_us_description()}</Card.Description>
    </Card.Header>
    <Card.Content>
        <form>
            <div class="grid w-full items-center gap-4">
                <div class="grid w-full items-center gap-4">
                    <Label for="name">{m.name()}</Label>
                    <Input id="name" placeholder={m.name()} />
                </div>
                <div class="grid w-full items-center gap-4">
                    <Label for="email">{m.email()}</Label>
                    <Input id="email" placeholder={m.email()} />
                </div> 
                <div class="grid w-full items-center gap-4">
                    <Label for="subject">{m.subject()}</Label>
                    <Input id="subject" placeholder={m.subject()} />
                </div>
                <div class="grid w-full items-center gap-4">
                    <Label for="message">{m.message()}</Label>
                    <Textarea id="message" placeholder={m.message()} />
                </div>
                <Button type="submit">{m.send()}</Button>
            </div>
        </form>
    </Card.Content>
</Card.Root>
 
