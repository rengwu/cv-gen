<script lang="ts">
  import type { SkillSection } from "../../../types";

  let { section }: { section: SkillSection } = $props();
</script>

<section>
  <div class="skills-title-section">
    <h2 class="section-title text-section-title">{section.title}</h2>
    <div class="skills-legend">
      <div class="skills-legend-label text-subtitle">{section.labels.low}</div>
      <div class="skills-swatch">
        <div class="swatch" style="background: var(--color-skill-1)"></div>
        <div class="swatch" style="background: var(--color-skill-2)"></div>
        <div class="swatch" style="background: var(--color-skill-3)"></div>
        <div class="swatch" style="background: var(--color-skill-4)"></div>
        <div class="swatch" style="background: var(--color-skill-5)"></div>
      </div>
      <div class="skills-legend-label text-subtitle">{section.labels.high}</div>
    </div>
  </div>
  <div class="skills-list text-body">
    {#each section.data as skill}
      <div class="skills-item">
        <div
          class="skills-level-box"
          style="background: var(--color-skill-{skill.level})"
        ></div>
        <div class="skills-label">{skill.name}</div>
      </div>
    {/each}
  </div>
</section>
