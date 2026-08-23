<script lang="ts">
  let {
    value = $bindable(""),
    placeholder = "",
    id = "",
    class: className = "",
    ...rest
  }: {
    value?: string;
    placeholder?: string;
    id?: string;
    class?: string;
    [key: string]: any;
  } = $props();
</script>

<input
  {...rest}
  type="text"
  class={`form-field-text w-full ${className}`}
  bind:value
  {placeholder}
  {id}
/>

<style>
  .form-field-text {
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.1) inset;
    border: 1px solid #dcdcdc;
  }
</style>
