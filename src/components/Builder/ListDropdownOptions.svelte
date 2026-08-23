<script lang="ts">
  import EllipsisDropdown from "./EllipsisDropdown.svelte";

  let {
    list,
    item,
    index,
  }: { list: any[]; item: any; index: number } = $props();
</script>

<EllipsisDropdown>
  <button
    disabled={index <= 0}
    onclick={() => {
      const tmp = list[index - 1];
      list[index - 1] = list[index];
      list[index] = tmp;
    }}
  >
    Move Up
  </button>
  <button
    disabled={index >= list.length - 1}
    onclick={() => {
      const tmp = list[index + 1];
      list[index + 1] = list[index];
      list[index] = tmp;
    }}
  >
    Move Down
  </button>
  <button
    onclick={() => {
      list.splice(index, 1);
    }}
  >
    Delete
  </button>
</EllipsisDropdown>
