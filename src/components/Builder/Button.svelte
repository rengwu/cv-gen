<script lang="ts" module>
  const buttonTypes = [
    "secondary",
    "default",
    "success",
    "danger",
    "naked",
  ] as const;
  export type ButtonType = (typeof buttonTypes)[number];

  const buttonSizes = {
    default: {
      style: "padding: 0.25rem 0.5rem; font-size: 13px;",
    },
    naked: {
      style: "",
    },
  };
  export type ButtonSize = keyof typeof buttonSizes;
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    type = "default" as ButtonType,
    disabled = false,
    id = "",
    size = "default" as ButtonSize,
    class: className = "",
    onclick,
    children,
    icon,
  }: {
    type?: ButtonType;
    disabled?: boolean;
    id?: string;
    size?: ButtonSize;
    class?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    icon?: Snippet;
  } = $props();
</script>

<button
  class={`button flex flex-nowrap items-center justify-center ${type} ${className}`}
  style={buttonSizes[size].style}
  {disabled}
  {id}
  {onclick}
>
  {#if icon}{@render icon()}{/if}
  {#if children}{@render children()}{:else}Button{/if}
</button>

<style>
  button {
    border-radius: 3px;
  }
  button.default {
    background: #294dd0;
    color: #f7f7f7;

    &:disabled {
      opacity: 0.5;
    }
  }
  button.secondary {
    background: rgba(0, 0, 0, 0.1);
    color: #222;

    &:disabled {
      opacity: 0.5;
    }
  }
  button.success {
    background: #14a014;
    color: #f7f7f7;

    &:disabled {
      opacity: 0.5;
    }
  }
  button.danger {
    background: #c31212;
    color: #f7f7f7;

    &:disabled {
      opacity: 0.5;
    }
  }
  button.naked {
    &:disabled {
      opacity: 0.5;
    }
  }
</style>
