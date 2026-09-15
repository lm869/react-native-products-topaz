# AGENTS.md

React Native 0.81.0 / React 19.1.0 app, scaffolded by `@react-native-community/cli@20`. Single root-level app, no monorepo.

> **Git discipline (immutable)**: `git commit`, `git push`, `git tag`, `git branch`, amend/force operations are **FORBIDDEN** unless the user explicitly says "commit", "push", "tag", "merge"/"rebase" (remote-tracked). Local-only ops (`add`, `status`, `diff`, `log`, `reset --mixed/--soft`, `stash`) are allowed without permission. Never auto-commit to "save progress". The user controls git history. See `~/.config/opencode/AGENTS.md` § Git Discipline.

## Stack
- Node `>= 22.11.0` (enforced by `package.json` `engines`)
- React Native 0.81.0, React 19.1.0, TypeScript 5.8.x
- Android: minSdk 24, compileSdk 36+, targetSdk 35, NDK 27.x, Kotlin 2.x
- Test: Jest 29 via `react-native` preset
- Lint: ESLint 8 via `@react-native` config
- Source of truth: `specs/001-topaz-products/{spec,plan,tasks,data-model}.md` and `.specify/memory/constitution.md`

### Runtime deps (pinned)
- `react-navigation` v7 (native + native-stack + bottom-tabs)
- `react-native-screens` **4.15.0 exact** — last 4.x compatible with RN 0.81 codegen. Do NOT bump above 4.15 without verifying codegen against RN 0.81's `@react-native/codegen` (4.16+ adds `SearchBarNativeComponent` whose `ElementRef<>` command syntax breaks the parser).
- `react-native-gesture-handler` ^2.20
- `react-native-reanimated` ^3.16
- `react-native-mmkv` ^3
- `@d11/react-native-fast-image` ^8
- `react-native-safe-area-context` ^5.5

### Dev deps
- `@tanstack/react-query` ^5, `zustand` ^5
- `@testing-library/react-native` ^12
- `babel-plugin-module-resolver` ^5 (required for `@/*` alias to work at Metro layer — see `plan.md` § Library Matrix)

## Commands (run from repo root)
- `npm start` — Metro dev server (must be running before `android` / `ios`)
- `npm start -- --reset-cache` — use after any babel/metro config change
- `npm run android` / `npm run ios` — build + launch on emulator/simulator
- `npm test` — Jest
- `npm run lint` — ESLint
- `npm run lint:format` — Prettier check
- `npm run format` — Prettier write
- `npm run typecheck` — `tsc --noEmit`

## iOS first-time / native-deps setup
```
bundle install              # first time only
bundle exec pod install     # every time a native dep changes
```
`.bundle/config` pins gems to `vendor/bundle`. Skipping `pod install` breaks Xcode builds.

## Layout
- `App.tsx` — mounts `GestureHandlerRootView` → `AppProviders` → `NavigationContainer` → `RootTabs` (two-tab nav: Products, Favorites)
- `index.js` — registers `App` with `AppRegistry` using `name` from `app.json`. Keep the `app.json` `name` and the `index.js` import in sync.
- `src/` — feature-based architecture (see `plan.md` § Folder Structure):
  - `api/`, `domain/{product,favorites}/`, `features/{products,favorites}/`, `storage/`, `components/`, `hooks/`, `utils/`, `store/`, `navigation/`, `theme/`
  - `AppProviders.tsx` is the composition root (ErrorBoundary + SafeArea + QueryClient + Theme)
- `android/`, `ios/` — native projects; treat generated files as read-only unless you know the RN gradle/pod hooks
- `__tests__/App.test.tsx` — smoke test (renders `App` via `react-test-renderer`)

## Conventions
- `@/*` import alias works in TS (tsconfig paths), Metro (babel module-resolver), and Jest (moduleNameMapper). Update all three if you change the alias — drift = runtime `Unable to resolve module @/...`.
- `babel.config.js` plugin order matters: `module-resolver` MUST come before `react-native-reanimated/plugin`.
- `app.json` `name` (`topazProducts`) is the AppRegistry key. Renaming requires touching `index.js`, `ios/topazProducts.xcodeproj`, and Android `applicationId` / package.

## What does NOT exist (don't waste time looking)
- No CI (`.github/workflows/`, `.gitlab-ci.yml`, etc.)
- No pre-commit / husky / lint-staged
- No monorepo tooling, no workspaces, no shared packages
- No `.env` loading — RN templates read env via `react-native-config` if added later
