<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { m, mpm, mpmc, me, mpae } from '$lib/trans';
  import { failure, success } from '$lib/components/ui/toast';

  let formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  let isSubmitting = false;

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    isSubmitting = true;

    try {
      // 验证表单
      if (!formData.name.trim()) throw new Error(mpae.empty_username());
      if (!formData.email.trim()) throw new Error(mpae.empty_email());
      if (!formData.subject.trim()) throw new Error('主题不能为空');
      if (!formData.message.trim()) throw new Error('消息不能为空');
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) throw new Error(mpae.invalid_email());

      // 显示成功提示
      success(mpmc.message_sent_successfully());
      
      // 重置表单
      formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    } catch (error) {
      failure(error instanceof Error ? error.message : me.unknown());
    } finally {
      isSubmitting = false;
    }
  };
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
    <form on:submit={handleSubmit}>
      <div class="grid w-full items-center gap-4">
        <div class="grid w-full items-center gap-4">
          <Label for="name">{mpmc.name()}</Label>
          <Input 
            id="name" 
            placeholder={mpmc.name()} 
            bind:value={formData.name}
            disabled={isSubmitting}
          />
        </div>
        <div class="grid w-full items-center gap-4">
          <Label for="email">{m.email()}</Label>
          <Input 
            id="email" 
            type="email"
            placeholder={m.email()} 
            bind:value={formData.email}
            disabled={isSubmitting}
          />
        </div> 
        <div class="grid w-full items-center gap-4">
          <Label for="subject">{m.subject()}</Label>
          <Input 
            id="subject" 
            placeholder={m.subject()} 
            bind:value={formData.subject}
            disabled={isSubmitting}
          />
        </div>
        <div class="grid w-full items-center gap-4">
          <Label for="message">{m.message()}</Label>
          <Textarea 
            id="message" 
            placeholder={m.message()} 
            bind:value={formData.message}
            disabled={isSubmitting}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? m.loading() : m.send()}
        </Button>
      </div>
    </form>
  </Card.Content>
</Card.Root>

