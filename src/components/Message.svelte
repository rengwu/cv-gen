<script lang="ts">
  import type { Snippet } from "svelte";

  let { style = "", children }: { style?: string; children?: Snippet } = $props();
</script>

<div class="absolute top-[12px] left-[12px]" {style}>
  <div
    class="text-xs text-gray-500 font-medium bg-gray-200 rounded-sm p-[0.5rem] pt-[0.55rem]"
  >
    {@render children?.()}
  </div>
</div>
