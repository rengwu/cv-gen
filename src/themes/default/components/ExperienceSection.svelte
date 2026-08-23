<script lang="ts">
  import type { ExperienceSection } from "../../../types";

  let { section }: { section: ExperienceSection } = $props();
</script>

<section>
  <h2 class="section-title text-section-title">{section.title}</h2>
  {#each section.data as experience}
    <div class="experience">
      <h3 class="with-underline text-experience-title">
        <span style="font-weight: 500;">{experience.title}</span><span
          class="separator">
          - </span
        >{experience.subtitle}
      </h3>
      <div class="experience-subinfo text-subtitle">
        <div class="experience-date">{experience.date}</div>
        <div class="location">{experience.location}</div>
      </div>
      <ul class="experience-list text-body">
        {#each experience.items as item}
          <li>{item}</li>
        {/each}
      </ul>
    </div>
  {/each}
</section>
