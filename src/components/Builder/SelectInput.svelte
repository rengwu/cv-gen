<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    value = $bindable(""),
    placeholder = "",
    id = "",
    class: className = "",
    children,
    ...rest
  }: {
    value?: string;
    placeholder?: string;
    id?: string;
    class?: string;
    children?: Snippet;
    [key: string]: any;
  } = $props();
</script>

<select
  {...rest}
  class={`form-field-select w-full ${value.length === 0 ? "unselected" : ""} ${className}`}
  bind:value
  {placeholder}
  {id}
>
  {#if placeholder.length > 0}
    <option value="" disabled selected hidden>{placeholder}</option>
  {/if}
  {@render children?.()}
</select>

<style>
  .form-field-select {
    padding: 0.2rem 0.2rem;
    border-radius: 4px;
    box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.1) inset;
    border: 1px solid #dcdcdc;
  }
  .form-field-select.unselected {
    color: #999;
  }
</style>
