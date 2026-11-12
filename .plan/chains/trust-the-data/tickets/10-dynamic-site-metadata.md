# Give each hosted résumé real page metadata

## Question

The product's whole premise is that a user hosts their résumé and shares the
link. Every one of those links is untitled.

`src/app.html` declares no `<title>`, and nothing anywhere in `src/` uses
`<svelte:head>` — confirmed by grep. So the browser tab shows the URL, a
bookmark saves nothing readable, and a link pasted into Slack, LinkedIn, or a
recruiter's email preview shows no title, no description, and no card. For a
document whose entire job is to be shared and read by someone else, that is the
most visible defect left in the project. `docs/TODO.md` has carried it as
"Dynamically populate site metadata (title, description, favicon, etc)" since
before the modernization.

Drive the metadata from the loaded résumé. `src/routes/+page.svelte` already
holds `inputData` and derives `resumeData`; the profile has `name`, `caption`,
and `description` to work with. Title from the name, description from the
caption or description.

Things to get right:

- **Before the data loads, and when it never does.** The viewer has three
  states: loading, loaded, and the `Welcome` landing page shown when no `?data=`
  source is present. Each needs a sensible title; the landing page should say
  what the site is, not carry a stale name from a previous render.
- **The other two routes.** `/builder` and `/load` need titles too. They are
  static and can be plain.
- **Prerendering.** The app is statically exported with `prerender = true`, so
  the HTML shipped for `/` is generated at build time and the résumé is fetched
  client-side afterwards. Metadata therefore updates in the browser but is *not*
  in the served HTML — which means naive link-preview crawlers will not see it.
  Establish what actually happens rather than assuming a fix; if real
  Open Graph previews would need prerendering changes or a build-time data
  fetch, that is a larger decision than this ticket — state the limitation
  plainly instead of half-building it.
- **Escaping.** The name and caption come from untrusted JSON and are being
  written into `<head>`. Svelte escapes text in `<svelte:head>`, but attribute
  values in `<meta content>` deserve a deliberate check, not an assumption.
- **Favicon.** The TODO mentions it. `src/app.html` references
  `%sveltekit.assets%/favicon.png` and `static/favicon.png` exists. A
  résumé-supplied favicon URL means loading a remote image chosen by whoever
  wrote the JSON; it is reasonable to rule that out and keep the static one.
  Decide and say which.

## Done when

- The viewer's `<title>` reflects the loaded résumé's profile name, with a
  meaningful fallback for the loading and landing states.
- A `<meta name="description">` is populated from the profile.
- `/builder` and `/load` have their own titles.
- Untrusted profile text reaching `<head>` is escaped, verified rather than
  assumed.
- The prerendering limitation for link-preview crawlers is either resolved or
  written down explicitly as a known limitation.
- The favicon question is decided either way and recorded.
- `docs/TODO.md` is updated.
- `pnpm test`, `pnpm check`, and `pnpm build` all exit 0.
