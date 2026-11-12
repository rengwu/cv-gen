# Add a second theme and a working theme picker

## Question

The builder's sidebar has this, in `src/routes/builder/+page.svelte`:

```svelte
<FormSection title="Themes">
  <p class="text-center text-xs text-gray-400 font-bold p-6">COMING SOON</p>
</FormSection>
```

Ticket 05 made `inputData.theme` real. This ticket gives the user something to
choose and a way to choose it. It also proves the theme contract is actually
extensible — right now the registry has one entry, so nothing has ever tested
the abstraction.

**The theme.** Add a second theme under `src/themes/<name>/` implementing the
`Theme` contract from `src/types.ts` — `{ name, icons, Page }`, where `Page` is
a typed Svelte component receiving `resumeData` and `icons`. Register it in
`src/themes/index.ts`. Model the structure on `src/themes/default/`: components
per section type under `components/`, styles under `styles/index.css`, icons
under `assets/icons/`.

It must handle all three section types (`experienceList`, `skillList`,
`summary`) and the profile header, and it must stay print-friendly — printing to
PDF is the product's main output path, and both `ResumePreview.svelte` and
`builder/+page.svelte` carry `@media print` rules that assume the page renders
inside `#page`.

Make it visually distinct from `default`, not a recolour. If it shares icons
with `default`, share them by import rather than by copying files — the repo had
a 63MB font problem in a prior session and duplicated binary assets are how that
starts.

**The picker.** Replace the placeholder with a control that writes
`formState.theme` from `Object.keys(themes)`. It must be driven by the registry,
not a hard-coded list, so registering a third theme needs no builder change. The
live preview should switch immediately, and the choice should survive the
localStorage draft autosave already in that file.

Watch the CSS side-loading in `ResumePreview` (`$effect` with a dynamic
`import()` of `../themes/${theme}/styles/index.css`). With two themes this
finally matters: switching must not leave the previous theme's styles applied on
top of the new one.

## Done when

- A second theme is implemented and registered, rendering all three section
  types plus the profile header.
- Printing the second theme produces a sane PDF, same as `default`.
- Shared assets are shared by import, not duplicated on disk.
- The builder's Themes section is a live picker enumerated from the registry;
  "COMING SOON" is gone.
- Switching themes updates the preview immediately, with no stylesheet bleed
  between themes.
- The chosen theme persists in the draft and appears in the JSON export.
- `pnpm build` emits both themes' CSS.
- `pnpm test`, `pnpm check`, and `pnpm build` all exit 0.
