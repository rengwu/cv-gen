<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title,
    class: className = "",
    children,
  }: { title: string; class?: string; children?: Snippet } = $props();
</script>

<div class={`mb-4 ${className}`}>
  <div class="uppercase font-semibold text-[14px] mb-2">
    {title}
  </div>
  {@render children?.()}
</div>
