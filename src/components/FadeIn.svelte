<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    class: className = "",
    duration = 500,
    children,
  }: { class?: string; duration?: number; children?: Snippet } = $props();

  let element: HTMLDivElement;

  $effect(() => {
    const timeout = setTimeout(() => {
      element.style.setProperty("opacity", "1");
    }, 10);
    return () => clearTimeout(timeout);
  });
</script>

<div
  class={className}
  style={`opacity: 0; transition-duration: ${duration}ms`}
  bind:this={element}
>
  {@render children?.()}
</div>
