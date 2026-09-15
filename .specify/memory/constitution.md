# Constitution — topazProducts

Version: 1.0.0
Status: Ratified
Last Amended: 2026-09-15

## Article I — Architecture

### Section 1. Feature-Based Architecture (mandatory)
The codebase MUST be organized under `src/` with three top-level concerns:
- `domain/` — pure models and repository **interfaces** (`IProductRepository`,
  `IFavoritesRepository`, `Product`, `FavoriteProduct`). No React, no fetch, no
  MMKV imports.
- `features/<domain>/` — concrete **implementations**, hooks, components, screens,
  stores, mappers, feature-specific DTOs.
- `api/`, `storage/`, `components/`, `hooks/`, `utils/`, `store/`, `navigation/`,
  `theme/` — shared infrastructure.

### Section 2. Repository Pattern with DIP (mandatory)
Repository **interfaces** live in `src/domain/<x>/`. Concrete **implementations**
live in `src/features/<x>/repository/`. UI never calls `fetch`, `MMKV`, or
third-party SDKs directly. The composition root (`src/AppProviders.tsx`) wires
the concrete impls and passes them down via context or as TanStack Query
`queryFn` targets.

### Section 3. No Clean Architecture
This codebase MUST NOT contain `use-cases`, `interactors`, `entities-with-behavior`,
or `services/` abstractions that add indirection without testability gain. The
`domain/` layer is interface-and-data-only.

### Section 4. Domain Layer Purity (mandatory)
`src/domain/` MUST NOT import anything from `src/api/`, `src/features/`,
`src/storage/`, `src/theme/`, `react`, or `react-native`. Pure TypeScript types
and interfaces only. This is enforced via `no-restricted-imports` in ESLint.

## Article II — State Boundaries

### Section 1. Server State
TanStack Query is the SOLE owner of server state (products, detail, categories,
search, category filter, pagination). Zustand MUST NOT mirror server data.

### Section 2. Client State
Zustand is used ONLY for:
- Favorites (with MMKV persistence)
- Ephemeral UI state explicitly justified in the spec

### Section 3. Persistence
`react-native-mmkv` is the ONLY persistent storage. Access goes through
`src/storage/mmkv.ts`. UI MUST NOT import MMKV.

## Article III — Type Safety

### Section 1. Strict TypeScript
`tsconfig.json` MUST have `"strict": true`. `any` is forbidden.

### Section 2. any Justification
If `any` is unavoidable due to a third-party type gap, a comment MUST be present:
`// any-justify: <library> lacks types for <X>`. No blanket `eslint-disable`.

## Article IV — Network & Cancellation

### Section 1. HTTP Client
A single `shared/api/httpClient.ts` MUST be used. No hardcoded base URLs outside it.

### Section 2. AbortSignal Propagation
Every async data fetch MUST accept and propagate `AbortSignal` through:
`queryFn → repository → api → httpClient → fetch`. Cancellation is mandatory for
search, pagination, and navigation-away scenarios.

## Article V — UI Discipline

### Section 1. Visual Source of Truth
`.opencode/design.md` is the SOLE source of UI/UX truth. Tokens come from
`src/app/theme/tokens.ts`. Components MUST NOT hardcode colors.

### Section 2. Dark Mode
`useColorScheme` MUST drive theme selection. `lightTheme` and `darkTheme` MUST be
derived from design tokens; no inline dark/light conditionals in components.

### Section 3. Animations
Reanimated 3 is the only animation library for interactive elements (mandatory for
`FavoriteButton`). The `Animated` API from React Native core is forbidden for the
favorite interaction.

## Article VI — Navigation

### Section 1. Topology
Root layout MUST be a Bottom Tab Navigator with two tabs: `Products` and
`Favorites`. `ProductDetail` MUST be a stack screen inside `Products` tab — never
a tab. Navigation lives at `src/navigation/` with `RootTabs.tsx`,
`ProductsStack.tsx`, and `types.ts`.

### Section 2. Typed Params
`RootTabParamList` and `ProductsStackParamList` MUST be exported from
`src/navigation/types.ts` and used with
`NativeStackNavigationProp<T>` / `BottomTabNavigationProp<T>`.

## Article VII — Testing

### Section 1. Mocking Strategy
In tests of hooks and UI, repositories MUST be mocked. `fetch` MUST NOT be mocked
at this layer. Mocking `httpClient` directly is permitted for `httpClient` unit tests.

### Section 2. Coverage
Unit tests MUST cover all custom hooks, all mappers, all utilities, all repositories,
and the error mapping. At least one meaningful integration test MUST exist (no
"renders without crashing" tests as primary evidence).

### Section 3. Test Quality
Empty smoke tests do not count toward Definition of Done.

## Article VIII — Quality Gates

### Section 1. Lint
`npm run lint` MUST exit 0 over `src/`. Required rules:
- `@typescript-eslint/no-explicit-any: error`
- `react-hooks/rules-of-hooks: error`
- `react-hooks/exhaustive-deps: error`

### Section 2. Format
`npm run lint:format` MUST exit 0 (Prettier check).

### Section 3. Typecheck
`npx tsc --noEmit` MUST exit 0.

## Article IX — Version Pin

### Section 1. React Native
React Native version is pinned to `0.81.x`. Deviation MUST be documented in
`README.md` Known Tradeoffs with explicit rationale.

### Section 2. Library Compatibility Matrix
Any library added MUST be verified against the RN 0.81 compatibility matrix
(see `plan.md` § Library Matrix). MMKV and `react-native-screens` MUST be
verified compatible with RN 0.81 + the chosen React Navigation major version
before installation.

> Verified 2026-09-15 (Phase 1 post-install): `react-native-screens@4.15.0`
> + `react-native-reanimated@3.16.x` + `@react-navigation/bottom-tabs@7.19.x`
> + RN 0.81.0 + React 19.1.0 — peer resolution clean, no `--legacy-peer-deps`
> required at install time. Bundle (Android + iOS) green.
>
> screens 4.16+ rejected: introduces `SearchBarNativeComponent` whose Fabric
> command syntax (`ElementRef<>`) is unparseable by RN 0.81's `@react-native/codegen`.
> Do NOT bump screens above 4.15.0 without verifying codegen compat first.

## Article X — Anti-Patterns (Explicit Prohibitions)

The following are forbidden and MUST be rejected in code review:
- `fetch` inside a screen
- `react-native-mmkv` import outside `src/storage/mmkv.ts`
- Business logic in JSX
- Prop drilling of favorites (must use Zustand)
- Server state duplicated in Zustand
- `any` without justification comment
- Hardcoded API URLs
- Hardcoded design colors in components
- Expo modules
- `Animated` API for the favorite button
- `ProductDetail` as a tab
- "renders without crashing" tests as primary evidence
- Indiscriminate `React.memo` / `useMemo` / `useCallback`
- `useCase` / `Interactor` classes without real logic
- Service layer that duplicates the repository
- Imports from `src/domain/` into `src/features/`, `src/api/`, or `src/storage/` that
  break the purity contract (domain imports must remain zero-dependency)
- Storing only favorite IDs (forces an API call to render FavoritesScreen)
- `eslint-disable` without inline justification comment

## Governance

Amendments to this constitution require explicit user approval and a version bump.
Article IX (Version Pin) and Article X (Anti-Patterns) are immutable during the
72-hour execution window.
