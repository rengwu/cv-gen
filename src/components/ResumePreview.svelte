<script lang="ts">
  import type { InputData, ResumeData } from "../types";
  import { themes } from "../themes";
  import Button from "./Builder/Button.svelte";

  let {
    theme = "default",
    hideLanguages = false,
    hidePrint = false,
    inputData,
    currentLanguage = $bindable(""),
  }: {
    theme?: keyof typeof themes;
    hideLanguages?: boolean;
    hidePrint?: boolean;
    inputData: InputData;
    currentLanguage?: string;
  } = $props();

  let currentTheme = $derived(themes[theme]);

  let resumeData: ResumeData | null = $derived(
    inputData && currentLanguage
      ? (inputData.languages[currentLanguage] ?? null)
      : null
  );

  $effect(() => {
    void import(`../themes/${theme}/styles/index.css`);
  });

  $effect(() => {
    if (inputData && inputData.defaultLanguage && !currentLanguage) {
      currentLanguage = inputData.defaultLanguage;
    }
  });
</script>

<div class="flex flex-col items-center px-8" id="page-container">
  {#if !hideLanguages}
    <div id="languages-container" class="fixed bottom-[24px] left-[24px]">
      <div class="flex flex-row flex-nowrap gap-1">
        {#each Object.keys(inputData.languages) as language}
          <Button
            type={currentLanguage === language ? "default" : "naked"}
            class={`px-1.5 py-0.5 text-[13px] ${currentLanguage === language ? "" : "bg-gray-200/80 opacity-50 hover:opacity-100"}`}
            onclick={() => (currentLanguage = language)}
            size="naked"
          >
            {language}
          </Button>
        {/each}
      </div>
    </div>
  {/if}

  {#if resumeData}
    <div class="page-frame duration-200" id="page">
      <currentTheme.Page {resumeData} icons={currentTheme.icons} />
    </div>
  {/if}

  <div id="credits-container" class="mb-4">
    <div class="text-[12px] text-white/70 opacity-70">
      made with <a
        class="text-blue-300"
        target="_blank"
        href="https://github.com/johngohrw/cv-gen">cv-gen</a
      >
    </div>
  </div>
  {#if !hidePrint}
    <Button
      type="default"
      class="fixed bottom-[24px] right-[24px] !text-[16px] !px-5 !py-2 !rounded-full font-medium"
      onclick={() => print()}
    >
      Print
    </Button>
  {/if}
</div>

<style>
  @media print {
    :global(body),
    :global(body) > :global(div),
    :global(body) > :global(div) > :global(div),
    #page-container {
      background: none !important;
      padding: 0px !important;
      min-height: unset !important;
      margin: 0px !important;
      box-shadow: unset !important;
      transform: none !important;
    }
    :global(:not(#page *)) {
      /* border: 4px solid green; */
      margin: 0;
    }
    #page-container > :global(button),
    #languages-container,
    #credits-container {
      display: none;
    }
    #page {
      width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      background: none !important;
      box-shadow: unset !important;
      transform: none !important;
    }
  }

  .page-frame {
    max-width: 850px;
    width: 100%;
    padding: 3.5rem;
    background: #f5f5f5;
    box-shadow: 3px 3px 13px -3px rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
    margin: 2rem;
  }
</style>
