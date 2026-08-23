<script lang="ts">
  import type { Link } from "../../../types";

  let { link, icon }: { link: Link; icon?: string } = $props();
</script>

<div class="contact-item">
  {#if icon}
    <img src={icon} class="contact-icon" alt="" />
  {/if}
  <div class="contact-label text-contact-item">
    {#if link.href}
      <a href={link.href} target="_blank" rel="noopener noreferrer"
        >{link.label}</a
      >
    {:else}
      {link.label}
    {/if}
  </div>
</div>
