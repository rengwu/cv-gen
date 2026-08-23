<script lang="ts">
  import Button, { type ButtonSize, type ButtonType } from "./Button.svelte";
  import type { Snippet } from "svelte";

  let {
    positionX = "right",
    positionY = "bottom",
    buttonProps = {
      type: "secondary",
      size: "default",
    } as { [key: string]: any } & Partial<{
      type: ButtonType;
      size: ButtonSize;
    }>,
    class: className = "",
    label,
    icon,
    children,
  }: {
    positionX?: "left" | "right";
    positionY?: "top" | "bottom";
    buttonProps?: { [key: string]: any } & Partial<{
      type: ButtonType;
      size: ButtonSize;
    }>;
    class?: string;
    label?: Snippet;
    icon?: Snippet;
    children?: Snippet;
  } = $props();

  let showDropdown = $state(false);

  const handleDropdownFocusLoss = ({
    relatedTarget,
    currentTarget,
  }: {
    relatedTarget: any;
    currentTarget: any;
  }) => {
    if (
      relatedTarget instanceof HTMLElement &&
      currentTarget.contains(relatedTarget)
    ) {
      return;
    }

    showDropdown = false;
  };
</script>

<div class={`relative ${className}`} onfocusout={handleDropdownFocusLoss}>
  <Button onclick={() => (showDropdown = true)} {...buttonProps}>
    {#if icon}{@render icon()}{/if}
    {#if label}{@render label()}{/if}
  </Button>
  {#if showDropdown}
    <button
      onclick={() => (showDropdown = false)}
      class="dropdown-list absolute w-fit flex flex-col items-start py-1 rounded shadow-lg bg-gray-100 text-gray-900 text-[12px] whitespace-nowrap z-20"
      style={`${positionX}: 0; ${positionY === "top" && "bottom: 100%;"} ${positionY === "bottom" && "top: 100%;"}`}
    >
      {@render children?.()}
    </button>
  {/if}
</div>

<style>
  .dropdown-list :global(button) {
    padding: 0.3rem 0.5rem;
    width: 100%;
    text-align: left;

    &:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &:disabled {
      opacity: 0.3;
    }
  }

  .dropdown-list :global(button:not(:last-child)) {
    border-bottom: 1px solid #ddd;
  }
</style>
