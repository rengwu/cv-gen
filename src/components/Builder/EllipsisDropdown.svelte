<script lang="ts">
  import Dropdown from "./Dropdown.svelte";
  import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<Dropdown
  buttonProps={{
    type: "naked",
    size: "naked",
    class: "px-0.5 ml-0.5",
  }}
  positionX="right"
  positionY="bottom"
>
  {#snippet icon()}
    <EllipsisVertical size={14} color="#555" />
  {/snippet}
  {@render children?.()}
</Dropdown>
