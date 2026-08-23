<script lang="ts">
  import type { SummarySection } from "../../../types";

  let { section }: { section: SummarySection } = $props();
</script>

<section>
  <h2 class="section-title text-section-title">{section.title}</h2>
  <div class="text-summary-description text-body">
    {section.data.description}
  </div>
</section>
