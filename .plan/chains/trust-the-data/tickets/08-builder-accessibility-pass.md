# Make the builder usable by keyboard and screen reader

## Question

The builder is a form-heavy application in which no form control has a label and
the menu component is invalid HTML.

**Labels.** Every input in `src/components/Builder/ResumeForm.svelte` and
`src/routes/builder/+page.svelte` is identified only by its `placeholder`.
Placeholders disappear on input and are not reliably announced, so a screen
reader user filling in a résumé hears nothing about which field is which. Note
that `TextInput.svelte` and `SelectInput.svelte` already accept an `id` prop,
and `ResumeForm` already passes structured ids like
`formState.sections[0].data[1].title` — nothing is ever paired to them. That is
the hook to build on.

**The dropdown.** `src/components/Builder/Dropdown.svelte:60` renders the open
menu as a `<button>` whose children are themselves `<button>` elements:

```svelte
<button onclick={() => (showDropdown = false)} class="dropdown-list ...">
  {@render children?.()}
</button>
```

Interactive elements may not nest. Browsers recover from this unpredictably and
keyboard navigation breaks. The outer element is only there to close the menu on
click; that is a job for the container, not a button. `EllipsisDropdown.svelte`
wraps this component and `ListDropdownOptions.svelte` fills it with the
Move Up / Move Down / Delete controls on every list row, so this affects every
repeated item in the builder.

**Toggle and focus.** The trigger runs `onclick={() => (showDropdown = true)}` —
it only ever opens, so clicking it again cannot close the menu. There is no
`Escape` handling. Focus is not returned to the trigger when the menu closes, so
a keyboard user is dropped at the top of the document after every delete. The
existing `onfocusout` handler already does the right thing for click-away;
preserve that behaviour.

Fix these three things. Do not restyle the builder, and do not restructure the
form — this is an accessibility pass, not a redesign. `svelte-check` reports
a11y warnings and the project is at zero warnings today; keep it there.

## Done when

- Every builder input has a programmatically associated label, using the `id`
  props already threaded through `TextInput` and `SelectInput`. Where a visible
  label would crowd the sidebar, an accessible name by other means is fine —
  but `placeholder` alone is not.
- No interactive element nests inside another; the dropdown menu is a container
  with appropriate roles, not a `<button>`.
- The dropdown trigger toggles, `Escape` closes the menu, and focus returns to
  the trigger on close.
- Click-away closing still works.
- The builder can be driven end to end — add a language, add a section, add an
  experience, reorder it, delete it — using only the keyboard.
- `pnpm check` still reports 0 errors and 0 warnings, a11y warnings included.
- `pnpm test` exits 0.
