# Fix the /load URL round trip

## Question

`src/routes/load/+page.svelte` is the page where a user pastes the URL of their
hosted résumé JSON. It navigates like this:

```js
const handleLoad = () => {
  goto("/?data=" + url);
};
```

The pasted URL is concatenated raw. Any résumé URL carrying its own query string
is destroyed: everything from the first `&` onward is parsed as a separate
parameter of the *cv-gen* URL, not as part of `data`. This is not a corner case —
jsonbin URLs, GitHub raw URLs with `?token=`, and any CDN link with a cache-
busting parameter all break. The user is shown the generic "Couldn't load resume
data from that URL" message and has no way to tell why.

Encode the parameter. Then confirm the read side agrees: `getSearchParams()` in
`src/lib/url.ts` already runs every value through `decodeURIComponent`, so an
encoded value should round-trip — prove it rather than assume it, and note that
double-decoding is a real hazard here since `decodeSearchParamsObject` decodes
values that `URLSearchParams` has already decoded once.

While in this file, two other things:

- **Validate before navigating.** Only `http:` and `https:` URLs make sense as a
  data source. Reject anything else in the page, where the user can see the
  message, instead of letting the viewer fail opaquely after the navigation.
  Ticket 02 added `safeHref()` for a different job — reuse it only if it
  genuinely fits; a data source and a rendered link are not the same
  constraint, and `mailto:` is valid for one and nonsense for the other.
- **Migrate to runes.** This file is the last one still in legacy mode: it uses
  a plain `<script>` with `let url = ""` rather than `$state`. It works, but it
  is the only component in the tree that does, and consistency was the point of
  the migration in a prior session.

## Done when

- A résumé URL containing `?` and `&` survives `/load` intact and reaches the
  viewer whole.
- A non-`http(s)` URL is rejected on the `/load` page with a visible message,
  not by silent failure after navigation.
- A test round-trips such a URL through the encode step and
  `getSearchParams`/`decodeSearchParamsObject`, proving no double-decode.
- The file uses runes (`$state`) and `lang="ts"`, consistent with the rest of
  the tree.
- `pnpm test` and `pnpm check` both exit 0.
