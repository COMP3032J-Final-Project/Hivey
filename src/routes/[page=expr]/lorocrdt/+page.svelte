<script lang="ts">
    import { onMount } from "svelte";
    import { LoroDoc,  LoroList } from 'loro-crdt';

    onMount(() => {
        const doc = new LoroDoc();
        const list: LoroList = doc.getList("list");
        list.insert(0, "A");
        list.insert(1, "B");
        list.insert(2, "C");
        
        console.log(doc.toJSON());
    });
</script>
