<script lang="ts">
  import type { ResumeData } from "../../../types";
  import ContactItem from "./ContactItem.svelte";
  import ExperienceSection from "./ExperienceSection.svelte";
  import SkillsSection from "./SkillsSection.svelte";
  import SummarySection from "./SummarySection.svelte";

  let {
    resumeData,
    icons,
  }: { resumeData: ResumeData; icons: { [key: string]: string } } = $props();
</script>

<header class="header-section">
  <div class="header-main">
    <h1 class="text-header-title">{resumeData.profile.name}</h1>
    <p class="text-header-subtitle">{resumeData.profile.caption}</p>
  </div>
  <div class="contact-container">
    {#each resumeData.profile.links as link}
      <ContactItem {link} icon={link.icon ? icons[link.icon] : undefined} />
    {/each}
  </div>
</header>
<div>
  {#each resumeData.sections as section}
    {#if section.type === "experienceList"}
      <ExperienceSection {section} />
    {:else if section.type === "skillList"}
      <SkillsSection {section} />
    {:else if section.type === "summary"}
      <SummarySection {section} />
    {/if}
  {/each}
</div>
