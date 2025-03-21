<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { m, mpm, mpmc } from '$lib/trans';
</script>

<svelte:head>
  <title>{mpm.contact_us()} | {m.app_name()}</title>
  <meta name="description" content={`${mpm.contact_us()} for ${m.app_name()}`} />
</svelte:head>

<Card.Root class="my-10">
  <Card.Header>
    <Card.Title>{mpm.contact_us()}</Card.Title>
    <Card.Description>{mpmc.contact_us_description()}</Card.Description>
  </Card.Header>
  <Card.Content>
    <form>
      <div class="grid w-full items-center gap-4">
        <div class="grid w-full items-center gap-4">
          <Label for="name">{mpmc.name()}</Label>
          <Input id="name" placeholder={mpmc.name()} />
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

