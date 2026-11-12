# Allowlist link schemes in the rendered résumé

## Question

The viewer renders profile links from JSON it fetched at runtime from a URL
supplied in the `?data=` query parameter. That parameter is attacker-controlled:
anyone can send a victim a link that loads JSON they wrote. The renderer treats
that JSON as trusted.

`src/themes/default/components/ContactItem.svelte:10` does this:

```svelte
<a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
```

`link.href` is a bare `z.string()` in `linkSchema` (`src/lib/resumeSchema.ts`).
Nothing checks its scheme, so `javascript:...` in a hosted résumé executes in
the victim's origin when they click the link. `data:text/html,...` is the same
class of problem.

Add a `safeHref()` helper under `src/lib/`. It should allow `http:`, `https:`,
`mailto:`, and `tel:`, plus relative URLs, and reject everything else. Watch the
obfuscations that trip naive checks: leading and interior whitespace and control
characters (`java\tscript:`), mixed case (`JaVaScRiPt:`), and protocol-relative
`//evil.example` — decide deliberately how each is treated and encode that
decision in tests.

Where `safeHref()` rejects a URL, `ContactItem` must render the label as plain
text rather than as an anchor. Do not silently drop the link entirely — the
label is content the résumé owner wrote and the reader should still see it.

Prefer rejecting at render time over rejecting at parse time. Tightening
`linkSchema` would make a whole résumé fail to load over one bad link, and the
`.passthrough()`/lenient-import property described in CONTEXT.md matters more
than strictness here.

Ticket 01's hostile fixture already contains a `javascript:` href; use it.

## Done when

- `safeHref()` exists in `src/lib/`, is unit-tested, and its treatment of
  whitespace, case, and protocol-relative URLs is pinned by tests.
- `ContactItem.svelte` renders rejected links as plain text, never as an anchor.
- Valid `http`, `https`, `mailto`, and `tel` links still render as anchors with
  `rel="noopener noreferrer"` intact.
- A test loads the hostile fixture and asserts no `javascript:` URL reaches an
  `href`.
- `pnpm test` and `pnpm check` both exit 0.
