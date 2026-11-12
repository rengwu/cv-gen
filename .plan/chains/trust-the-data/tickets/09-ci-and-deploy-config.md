# Run the chain's own checks in CI, and commit the deploy config

## Question

Every check this chain gates on — `pnpm check`, `pnpm test`, `pnpm build` — runs
only on whoever's laptop happens to be running a ticket. There is no `.github/`
directory and no CI of any kind. A regression lands the moment someone pushes
without running them.

Add a GitHub Actions workflow that installs dependencies and runs `check`,
`test`, and `build` on push and on pull request. Details that matter here:

- The project uses **pnpm** (`pnpm-lock.yaml`, and `.npmrc` is present — read it
  before assuming install flags). Use a frozen-lockfile install so CI fails on a
  drifted lockfile instead of silently resolving something else.
- Cache the pnpm store; a cold install on every push is the difference between
  CI people wait for and CI people ignore.
- `pnpm check` runs `svelte-kit sync` first, which needs to work in a clean
  checkout — verify that rather than assuming.
- `build/` is gitignored and generated. CI builds it to prove the build works;
  it must not be committed.

Second, the deploy configuration is implicit. The README documents a Netlify
deploy and a `PUBLIC_PRELOADED_RESUME_DATA_URL` environment variable, but
nothing in the repository states the build command, the publish directory, or
the Node version — it lives in whatever the Netlify UI was set to. Commit a
`netlify.toml` recording it. `svelte.config.js` uses `adapter-static` with
`strict: true` and output to `./build`; keep them consistent.

Do not add branch protection, required-status-check settings, release
automation, or a deploy step that publishes from CI. This ticket makes the
existing checks run automatically and writes down the existing deploy — nothing
more.

## Done when

- A workflow at `.github/workflows/` runs `pnpm check`, `pnpm test`, and
  `pnpm build` on push and pull request, and passes on the current branch.
- The install uses pnpm with a frozen lockfile and a cached store.
- `netlify.toml` records the build command, publish directory, and Node version,
  consistent with `svelte.config.js`.
- `build/` remains gitignored and uncommitted.
- `pnpm test`, `pnpm check`, and `pnpm build` all exit 0 locally.
