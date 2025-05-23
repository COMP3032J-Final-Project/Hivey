<script lang="ts">
  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import { FileDropZone } from '$lib/components/ui/file-drop-zone/index.js';
  import type { createFileFrom } from '$lib/types/editor';
  import { success, failure } from '$lib/components/ui/toast';
  import { FilePlus } from 'lucide-svelte';
  import { me, mpp } from '$lib/trans';
  import { createFile as createNewFile, uploadFile } from '$lib/api/editor';
  import { getFolders } from '$lib/utils';
  import { UserPermissionEnum } from '$lib/types/auth';
  import { files, loadFiles, tempFolders } from '../store.svelte';

  let {
      projectId,
      currentUser,
      iconSize = 24,
  }: {
      projectId: string,
      currentUser: any,
      iconSize?: number
  } = $props();

  const project_id = projectId;
  let dialogOpen = $state(false);

  let folderValue = $state('');
  let foldersData = $derived($files ? getFolders($files, $tempFolders) : [{ value: 'root', label: 'root' }]);
  
  const triggerContent = $derived(
      foldersData.find((folder) => folder.value === folderValue)?.label ?? mpp.choose_file_path()
  );
  let formData: createFileFrom = {
      title: '', // 文件名
      path: '', // 文件路径
  };

  let create_file_filename: string | undefined = $state(undefined);
  let createFileCloseDialogElem: HTMLElement | null = $state(null);
  let uploadFileCloseDialogElem: HTMLElement | null = $state(null);

  const createFile = async (e: Event) => {
      e.preventDefault();

      try {
          if (!folderValue || !create_file_filename) {
              throw new Error('Please complete the form');
          } else {
              if (folderValue == 'root') {
                  folderValue = '';
              }
              formData = {
                  title: create_file_filename, // 文件标题
                  path: folderValue, // 文件路径
              };
              createNewFile(project_id, formData);
              success('Create file successfully');
              createFileCloseDialogElem?.click();
              // console.debug('[Create File Dialog] Reload files for projectId:', projectId);
              // 后端有延迟，必须要等一会
              await new Promise((resolve) => setTimeout(resolve, 100));
              await loadFiles(projectId, $tempFolders);
          }
      } catch (error) {
          // 直接使用错误消息
          const errorMessage = (error as Error).message;
          failure(errorMessage || me.unknown());
      }
  };

  let files_upload = $state<File[]>([]);
  let uploading = false;

  async function handleUpload(uploadedFiles: File[]) {
      if (!uploadedFiles.length || !folderValue) {
          failure('Please complete the form');
          return;
      }
      files_upload = uploadedFiles;
      for (const file of files_upload) {
          try{
            if (folderValue == 'root') {
              folderValue = '';
            }
            formData = {
                title: file.name,  // 文件标题
                path: folderValue, // 文件路径
            };
            await uploadFile(project_id, formData, file);
            success('Upload file successfully');
            uploadFileCloseDialogElem?.click();
            // console.debug('[Upload File Dialog] Reload files for projectId:', files_upload);
            // 后端有延迟，必须要等一会
            await new Promise((resolve) => setTimeout(resolve, 100));
            await loadFiles(projectId, $tempFolders);
          } catch (error) {
              // 直接使用错误消息
              const errorMessage = (error as Error).message;
              failure(errorMessage || me.unknown());
          }
      }
  }

  const handleTriggerClick = (e: MouseEvent) => {
      if (currentUser.permission === UserPermissionEnum.Viewer) {
          e.preventDefault();
          failure(mpp.error_no_permission());
          return;
      }
      dialogOpen = true;
  };
</script>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Trigger
    class={buttonVariants({ variant: 'ghost', size: 'icon' })}
    aria-label="New File"
    onclick={handleTriggerClick}
  >
    <FilePlus size={iconSize}/>
  </Dialog.Trigger>
  <Dialog.Content>
    <Tabs.Root value="createFile">
      <Tabs.List>
        <Tabs.Trigger value="createFile">{mpp.create_new_file()}</Tabs.Trigger>
        <Tabs.Trigger value="uploadFile">{mpp.upload_file()}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="createFile">
        <form onsubmit={createFile}>
          <div class="grid gap-4 py-4">
            <div class="flex items-center justify-center gap-4">
              <Label for="filename" class="w-1/4 text-right">{mpp.file_name()}</Label>
              <Input
                bind:value={create_file_filename}
                name="filename"
                placeholder={mpp.enter_file_name()}
                class="w-[250px]"
              />
            </div>
            <div class="flex items-center justify-center gap-4">
              <Label for="folder-select" class="w-1/4 text-right">{mpp.file_path()}</Label>
              <Select.Root type="single" name="folder" bind:value={folderValue}>
                <Select.Trigger id="folder-select" class="w-[250px]">
                  {triggerContent}
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    {#each foldersData as folder}
                      <Select.Item value={folder.value} label={folder.label}
                      >{folder.label}</Select.Item
                      >
                    {/each}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
          </div>
          <Dialog.Footer>
            <Button type="submit">Confirm</Button>
            <Dialog.Close bind:ref={createFileCloseDialogElem} class="hidden" />
          </Dialog.Footer>
        </form>
      </Tabs.Content>
      <Tabs.Content value="uploadFile">
        <FileDropZone onUpload={async (files: File[]) => {files_upload = files;}} maxFiles={5} maxFileSize={10 * 1024 * 1024}>
          <p>{mpp.upload_file_hint()}</p>
        </FileDropZone>
        <br>
        <div class="flex items-center justify-center gap-4">
          <Label for="folder-select1">{mpp.file_path()}</Label>
          <Select.Root type="single" name="folder" bind:value={folderValue}>
            <Select.Trigger id="folder-select1" class="w-[250px]">
              {triggerContent}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {#each foldersData as folder}
                  <Select.Item value={folder.value} label={folder.label}
                  >{folder.label}</Select.Item
                  >
                {/each}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {#if files_upload.length}
          <h3>{mpp.select_file()}</h3>
          <ul>
            {#each files_upload as file}
              <li>{file.name} - {(file.size / 1024).toFixed(2)} KB</li>
            {/each}
          </ul>
          <Dialog.Footer>
            <Button onclick={() => handleUpload(files_upload)} disabled={uploading}>
              {uploading ? mpp.uploading_file() : mpp.upload_file()}
            </Button>
            <Dialog.Close bind:ref={uploadFileCloseDialogElem} id="dialog-close-btn" class="hidden" />
          </Dialog.Footer>
        {/if}
      </Tabs.Content>
    </Tabs.Root>
  </Dialog.Content>
</Dialog.Root>
