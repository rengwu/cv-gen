<script lang="ts">
  import Plus from "@lucide/svelte/icons/plus";

  import { themes } from "../../themes";
  import type {
    Experience,
    Link,
    ResumeData,
    Skill,
    Theme,
    ValidSection,
  } from "../../types";
  import Button from "./Button.svelte";
  import Dropdown from "./Dropdown.svelte";
  import Form from "./Form.svelte";
  import FormSection from "./FormSection.svelte";
  import ListDropdownOptions from "./ListDropdownOptions.svelte";
  import SelectInput from "./SelectInput.svelte";
  import TextInput from "./TextInput.svelte";

  let { formState, class: className = "" }: { formState: ResumeData; class?: string } =
    $props();

  let currentTheme: Theme =
    themes[Object.keys(themes)[0] as keyof typeof themes];

  const sectionTemplates: { [key: string]: ValidSection } = {
    experience: {
      title: "",
      data: [],
      type: "experienceList",
    },
    skills: {
      title: "",
      data: [],
      type: "skillList",
      labels: { low: "rarely", high: "often" },
    },
    summary: {
      title: "",
      data: { description: "" },
      type: "summary",
    },
  };

  const addSection = (type: keyof typeof sectionTemplates) => {
    formState.sections.push(structuredClone(sectionTemplates[type]));
  };

  const addContactLink = () => {
    formState.profile.links.push({ label: "", href: "", icon: "" });
  };

  const addExperienceItem = (index: number) => {
    (formState.sections[index].data as Experience[]).push({
      title: "",
      subtitle: "",
      location: "",
      date: "",
      items: [],
    });
  };

  const addSkillItem = (index: number) => {
    (formState.sections[index].data as Skill[]).push({
      name: "",
      level: 1,
    });
  };

  const addExperienceBulletItem = (
    sectionIndex: number,
    experienceIndex: number
  ) => {
    (formState.sections[sectionIndex].data as Experience[])[
      experienceIndex
    ].items.push("");
  };
</script>

<Form class={className}>
  <FormSection title="Profile" class="flex flex-col gap-1">
    <TextInput placeholder="Name" bind:value={formState.profile.name} />
    <TextInput placeholder="Caption" bind:value={formState.profile.caption} />
  </FormSection>
  <FormSection title="Links" class="">
    {#each formState.profile.links as link, i}
      <div
        class="flex flex-row p-2 mb-2 bg-white/30 rounded border border-gray-300 shadow"
      >
        <div class="flex flex-col gap-1 flex-grow">
          <div class="flex flex-row flex-nowrap gap-1">
            <TextInput
              class="w-full"
              placeholder="Label"
              id={`formState.profile.links[${i}].label`}
              bind:value={formState.profile.links[i].label}
            />
            <SelectInput
              bind:value={formState.profile.links[i].icon}
              placeholder="Icon"
            >
              {#each Object.entries(currentTheme.icons) as [name, icon]}
                <option value={icon}>{name}</option>
              {/each}
            </SelectInput>
          </div>

          <TextInput
            class="w-full"
            placeholder="URL"
            id={`formState.profile.links[${i}].href`}
            bind:value={formState.profile.links[i].href}
          />
        </div>
        <ListDropdownOptions
          list={formState.profile.links}
          item={link}
          index={i}
        />
      </div>
    {/each}
    <div class="flex justify-end">
      <Button type="secondary" onclick={addContactLink}>
        {#snippet icon()}
          <Plus size={18} class="mr-1" />
        {/snippet}
        Add Link
      </Button>
    </div>
  </FormSection>

  <FormSection title="Sections" class="">
    {#each formState.sections as section, i}
      <div
        class="flex flex-row bg-white/30 rounded border border-gray-300 shadow p-2 mb-4"
      >
        <div class="flex flex-col gap-2 flex-grow">
          <div class="flex flex-row flex-nowrap">
            <TextInput
              class="w-full"
              placeholder="Section Title"
              id={`formState.sections[${i}].title`}
              bind:value={section.title}
            />
            <ListDropdownOptions
              list={formState.sections}
              item={section}
              index={i}
            />
          </div>

          {#if section.type === "experienceList"}
            <div class="border-b my-1 border-black/10"></div>
            {#each section.data as experience, j}
              <div class="flex flex-col gap-1 p-3 bg-black/5 rounded-lg">
                <div class="flex flex-row flex-nowrap">
                  <TextInput
                    class="w-full"
                    placeholder="Title"
                    id={`formState.sections[${i}].data[${j}].title`}
                    bind:value={experience.title}
                  />
                  <ListDropdownOptions
                    list={section.data}
                    item={experience}
                    index={j}
                  />
                </div>
                <TextInput
                  class="w-full"
                  placeholder="Subtitle"
                  id={`formState.sections[${i}].data[${j}].subtitle`}
                  bind:value={experience.subtitle}
                />
                <div class="flex flex-row gap-1">
                  <TextInput
                    class="w-full"
                    placeholder="Location"
                    id={`formState.sections[${i}].data[${j}].location`}
                    bind:value={experience.location}
                  />
                  <TextInput
                    class="w-full"
                    placeholder="Date"
                    id={`formState.sections[${i}].data[${j}].date`}
                    bind:value={experience.date}
                  />
                </div>
                {#if experience.items.length <= 0}
                  <div
                    class="flex items-center justify-center text-[12px] py-2 text-gray-400"
                  >
                    No Bullets
                  </div>
                {/if}
                {#each experience.items as bullet, k}
                  <div class="flex mb-2 flex-row flex-nowrap">
                    <div class="mt-2 mx-1.5 h-1 w-1 bg-black/20 rounded-full"></div>
                    <textarea
                      class="w-full text-xs rounded-[2px] mb-[-6px] p-1"
                      placeholder="Bullet text"
                      bind:value={experience.items[k]}
                    ></textarea>
                    <ListDropdownOptions
                      list={experience.items}
                      item={bullet}
                      index={k}
                    />
                  </div>
                {/each}
                <div class="flex justify-end">
                  <Button
                    type="secondary"
                    onclick={() => addExperienceBulletItem(i, j)}
                  >
                    Add Bullet
                  </Button>
                </div>
              </div>
            {/each}
            <Button type="secondary" onclick={() => addExperienceItem(i)}>
              Add Experience
            </Button>
          {:else if section.type === "skillList"}
            <div class="flex flex-row flex-nowrap gap-1">
              <TextInput
                class="w-full"
                placeholder="rarely"
                bind:value={section.labels.low}
              />
              <TextInput
                class="w-full"
                placeholder="often"
                bind:value={section.labels.high}
              />
            </div>
            <div class="border-b my-1 border-black/10"></div>
            {#each section.data as skill, k}
              <div class="relative flex flex-row flex-nowrap">
                <TextInput
                  class="w-full"
                  placeholder="Skill"
                  bind:value={skill.name}
                />
                <input
                  type="number"
                  bind:value={skill.level}
                  class="w-[32px] text-center bg-transparent"
                />
                <input
                  bind:value={skill.level}
                  class="w-[100px]"
                  type="range"
                  min={1}
                  max={5}
                />
                <ListDropdownOptions
                  list={section.data}
                  item={skill}
                  index={k}
                />
              </div>
            {/each}
            <Button type="secondary" onclick={() => addSkillItem(i)}>
              Add Skill
            </Button>
          {:else if section.type === "summary"}
            <div>
              <textarea
                class="w-full text-xs rounded-[2px] mb-[-6px] p-1"
                placeholder="Summary description"
                bind:value={section.data.description}
              ></textarea>
            </div>
          {/if}
        </div>
      </div>
    {/each}
    <div class="flex justify-end pb-[250px]">
      <Dropdown>
        {#snippet icon()}
          <Plus size={18} class="mr-1" />
        {/snippet}
        {#snippet label()}
          <span>Add Section</span>
        {/snippet}
        <button onclick={() => addSection("experience")}>
          Experience Section
        </button>
        <button onclick={() => addSection("skills")}>Skills Section</button>
        <button onclick={() => addSection("summary")}>Summary Section</button>
      </Dropdown>
    </div>
  </FormSection>
</Form>
