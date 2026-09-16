# Tasks — topazProducts

Format: `- [ ] T-XXX | phase | priority | depends-on | description`

Priority: P0 (blocker), P1 (must-have), P2 (should), P3 (bonus).

> Folder layout reference: see `specs/001-topaz-products/plan.md` § Folder Structure.

## Phase 1 — Foundation (8h)

- [x] T-001 | P0 | — | Create folder skeleton `src/{api,domain/{product,favorites},features/{products,favorites},storage,components,hooks,utils,store,navigation,theme}`
- [x] T-002 | P0 | T-001 | Add `tsconfig` paths for `@/*` → `src/*`
- [x] T-003 | P0 | T-001 | Install runtime deps: react-navigation/native, native-stack, bottom-tabs, screens, gesture-handler, reanimated, mmkv, fast-image
- [x] T-004 | P0 | T-003 | Install dev deps: @testing-library/react-native, @tanstack/react-query, zustand
- [x] T-005 | P0 | T-003 | Append `'react-native-reanimated/plugin'` to `babel.config.js` plugins
- [x] T-006 | P0 | T-002 | Update `tsconfig.json` strict config
- [x] T-007 | P0 | T-001 | Create `src/theme/tokens.ts` with all tokens from plan § Design Token Mapping
- [x] T-008 | P0 | T-007 | Create `src/theme/lightTheme.ts`
- [x] T-009 | P0 | T-007 | Create `src/theme/darkTheme.ts`
- [x] T-010 | P0 | T-007 | Create `src/theme/typography.ts`
- [x] T-011 | P0 | T-007 | Create `src/theme/spacing.ts`
- [x] T-012 | P0 | T-007 | Create `src/theme/radius.ts`
- [x] T-013 | P0 | T-008 | Create `src/theme/ThemeContext.ts` + `useAppTheme`
- [x] T-014 | P0 | T-013 | Create `src/theme/ThemeProvider.tsx`
- [x] T-015 | P0 | T-001 | Create `src/store/queryClient.ts` with default options from plan
- [x] T-016 | P0 | T-001 | Create `AppProviders` ErrorBoundary at `src/AppProviders.tsx`
- [x] T-017 | P0 | T-014..T-016 | Compose `src/AppProviders.tsx` with SafeArea + Query + Theme + ErrorBoundary
- [x] T-018 | P0 | T-001 | Create `src/navigation/types.ts` with `RootTabParamList`, `ProductsStackParamList`
- [x] T-019 | P0 | T-018 | Create `src/navigation/ProductsStack.tsx` with two placeholder screens
- [x] T-020 | P0 | T-018 | Create `src/navigation/RootTabs.tsx` with two tabs
- [x] T-021 | P0 | T-020 | Wire `App.tsx` → `AppProviders` → `RootTabs`
- [x] T-022 | P0 | T-021 | Update package.json scripts: `lint` over `src`, `lint:format` (Prettier check), `format`
- [x] T-023 | P0 | T-022 | Add `.eslintrc.js` rule `no-restricted-imports` for `react-native-mmkv` outside `src/storage/`
- [ ] T-024 | P0 | T-023 | `npm run lint` exit 0
- [ ] T-025 | P0 | T-023 | `npm run lint:format` exit 0
- [ ] T-026 | P0 | T-021 | `npm run android` → app opens with two tabs
- [ ] T-027 | P0 | T-021 | `npm run ios` → app opens with two tabs

## Phase 2 — Data Layer (8h)

> **Per Testing Strategy v2** (see `plan.md` § Testing Strategy), test sub-tasks
> T-032, T-035..T-041, T-047, T-050, T-052, T-054 are **NOT** to be implemented
> individually. They are consolidated into Phase 5 v2 MUST tests (T-180..T-187).
> Behavior is validated by implementation review + manual exploration.

- [x] T-030 | P0 | T-027 | Create `src/api/errors.ts` with NetworkError, TimeoutError, HttpError, ParseError, UnknownAppError
- [x] T-031 | P0 | T-030 | Create `mapAppError` in `src/api/errors.ts`
- [ ] T-032 | – | T-030 | ~~Test `mapAppError` for each kind~~ — Implementation only; covered by code review (Testing Strategy v2)
- [x] T-033 | P0 | T-030 | Create `src/api/httpClient.ts` (URL composition, AbortSignal.any, timeout, fetch, error mapping)
- [x] T-034 | P0 | T-033 | Create `src/api/config.ts` (baseURL, default timeout)
- [ ] T-035 | – | T-033 | ~~Test httpClient: happy path~~ — IMPL (Testing Strategy v2)
- [ ] T-036 | – | T-033 | ~~Test httpClient: timeout~~ — MANUAL (Testing Strategy v2)
- [ ] T-037 | – | T-033 | ~~Test httpClient: 500~~ — IMPL (Testing Strategy v2)
- [ ] T-038 | – | T-033 | ~~Test httpClient: invalid JSON~~ — IMPL (Testing Strategy v2)
- [ ] T-039 | – | T-033 | ~~Test httpClient: signal aborted~~ — IMPL (Testing Strategy v2)
- [ ] T-040 | – | T-033 | ~~Test httpClient: omit undefined~~ — IMPL (Testing Strategy v2)
- [ ] T-041 | – | T-033 | ~~Test httpClient: trailing slash~~ — IMPL (Testing Strategy v2)
- [x] T-042 | P0 | T-001 | Create `src/domain/product/Product.ts`, `ProductCategory.ts`, `PaginatedProducts.ts`, `IProductRepository.ts`
- [x] T-043 | P0 | T-001 | Create `src/domain/favorites/FavoriteProduct.ts`, `IFavoritesRepository.ts`
- [x] T-044 | P0 | T-042..T-043 | Verify `src/domain/*` has zero non-type imports (lint test INV-006)
- [x] T-045 | P0 | T-042 | Create `src/features/products/api/productsDto.ts` (ProductApiDto, ProductsResponseDto, ProductCategoryDto)
- [x] T-046 | P0 | T-045 | Create `src/features/products/mappers/productMapper.ts` (mapProductDto, mapProductsResponseDto, mapCategoryDto)
- [ ] T-047 | P2 | T-046 | ~~Test mappers (INV-001..003)~~ — SHOULD; only if not covered by `useProducts.test.ts`
- [x] T-048 | P0 | T-045 | Create `src/features/products/api/productsApi.ts` (5 endpoint methods, all accept signal)
- [x] T-049 | P0 | T-048 | Create `src/features/products/repository/DummyJsonProductRepository.ts` (implements IProductRepository)
- [ ] T-050 | – | T-049 | ~~Test DummyJsonProductRepository methods propagate signal~~ — IMPL; validated via useProducts hook integration (Testing Strategy v2)
- [x] T-051 | P0 | T-049 | Create `src/api/queryKeys.ts` with stable keys
- [ ] T-052 | – | T-051 | ~~Test queryKeys determinism~~ — IMPL; trivial by inspection (Testing Strategy v2)
- [x] T-053 | P0 | T-049 | Create `src/features/products/hooks/useCategories.ts`
- [ ] T-054 | – | T-053 | ~~Test useCategories success + error~~ — IMPL; validated by Bloque D wiring + Phase 3 integration (Testing Strategy v2)
- [x] T-055 | P0 | T-054 | Mount debug screen using `useCategories` to verify wiring

## Phase 3 — Products + Search + Category (14h)

> **Per Testing Strategy v2**, granular test sub-tasks (T-061, T-063, T-069,
> T-071..T-073, T-075..T-087, T-092..T-095, T-097, T-100..T-102, T-105..T-106,
> T-108) are NOT implemented individually. `useProducts` behavior is covered by
> Phase 5 v2 MUST test (T-181). `calculateDiscountedPrice` is covered by
> Phase 5 v2 MUST test (T-183). Component sub-tests are classified MANUAL.

- [ ] T-060 | P0 | T-055 | Create `src/utils/discount.ts` (computeDiscountedPrice, isOnSale)
- [ ] T-061 | P0 | T-060 | Test discount utils (EDGE-010, EDGE-011)
- [ ] T-062 | P0 | T-060 | Create `src/utils/currency.ts` (formatCurrency)
- [ ] T-063 | P0 | T-062 | Test currency util
- [ ] T-064 | P0 | T-060 | Create `src/utils/truncate.ts`
- [ ] T-065 | P0 | T-001 | Create `src/components/Screen.tsx`
- [ ] T-066 | P0 | T-065 | Create `src/components/EmptyState.tsx`
- [ ] T-067 | P0 | T-065 | Create `src/components/ErrorState.tsx`
- [ ] T-068 | P0 | T-065 | Create `src/components/RetryButton.tsx`
- [ ] T-069 | P0 | T-067 | Test ErrorState mapping
- [ ] T-070 | P0 | T-065 | Create `src/features/products/hooks/useDebouncedValue.ts`
- [ ] T-071 | P0 | T-070 | Test useDebouncedValue: emits after 350ms
- [ ] T-072 | P0 | T-070 | Test useDebouncedValue: rapid changes emit only last (EDGE-015)
- [ ] T-073 | P0 | T-070 | Test useDebouncedValue: empty string treated as empty
- [ ] T-074 | P0 | T-055 | Create `src/features/products/hooks/useProducts.ts` with state machine
- [ ] T-075 | P0 | T-074 | Test useProducts: initial load shows skeletons (AC-PROD-001)
- [ ] T-076 | P0 | T-074 | Test useProducts: success returns items + hasNextPage
- [ ] T-077 | P0 | T-074 | Test useProducts: error returns AppError (AC-ERR-001)
- [ ] T-078 | P0 | T-074 | Test useProducts: retry fires new request
- [ ] T-079 | P0 | T-074 | Test useProducts: fetchNextPage increments skip (AC-PROD-002)
- [ ] T-080 | P0 | T-074 | Test useProducts: stops at total (AC-PROD-003, EDGE-014)
- [ ] T-081 | P0 | T-074 | Test useProducts: search debounce 350ms (AC-SEARCH-001)
- [ ] T-082 | P0 | T-074 | Test useProducts: search clears category (AC-SEARCH-004)
- [ ] T-083 | P0 | T-074 | Test useProducts: category clears search (AC-CAT-002)
- [ ] T-084 | P0 | T-074 | Test useProducts: cancellation on rapid search (AC-SEARCH-002, EDGE-015)
- [ ] T-085 | P0 | T-074 | Test useProducts: empty response → EmptyState (EDGE-006)
- [ ] T-086 | P0 | T-074 | Test useProducts: 404 search → EmptyState specific
- [ ] T-087 | P0 | T-074 | Test useProducts: navigation away aborts signal (EDGE-020)
- [ ] T-088 | P0 | T-076 | Create `src/features/products/components/ProductCard.tsx`
- [ ] T-089 | P0 | T-088 | ProductCard uses theme tokens only (no hardcoded colors)
- [ ] T-090 | P0 | T-088 | ProductCard memoized on id + isFavorite
- [ ] T-091 | P0 | T-088 | ProductCard a11y: label, role, hint
- [ ] T-092 | P0 | T-088 | Test ProductCard: renders all fields
- [ ] T-093 | P0 | T-088 | Test ProductCard: long title truncated (EDGE-008)
- [ ] T-094 | P0 | T-088 | Test ProductCard: rating=0 hides stars (EDGE-012)
- [ ] T-095 | P0 | T-088 | Test ProductCard: price=0 renders "$0.00" (EDGE-010)
- [ ] T-096 | P0 | T-076 | Create `src/features/products/components/ProductSkeleton.tsx` matching card height
- [ ] T-097 | P0 | T-096 | Test skeleton height equals card height (AC-LOAD-001)
- [ ] T-098 | P0 | T-076 | Create `src/features/products/components/CategoryChips.tsx`
- [ ] T-099 | P0 | T-098 | CategoryChips a11y: selected state, label
- [ ] T-100 | P0 | T-098 | Test CategoryChips: All + categories from useCategories
- [ ] T-101 | P0 | T-098 | Test CategoryChips: tapping chip fires onSelect (AC-CAT-001)
- [ ] T-102 | P0 | T-098 | Test CategoryChips: a11y selected state changes
- [ ] T-103 | P0 | T-076 | Create `src/features/products/components/SearchBar.tsx`
- [ ] T-104 | P0 | T-103 | SearchBar a11y: role=search, label
- [ ] T-105 | P0 | T-103 | Test SearchBar: typing updates rawQuery
- [ ] T-106 | P0 | T-103 | Test SearchBar: whitespace-only treated as empty
- [ ] T-107 | P0 | T-076 | Create `src/features/products/components/ProductGridFooter.tsx`
- [ ] T-108 | P0 | T-107 | Test ProductGridFooter: spinner shown only when fetching next
- [ ] T-109 | P0 | T-088..T-107 | Create `src/features/products/screens/ProductsScreen.tsx`
- [ ] T-110 | P0 | T-109 | ProductsScreen FlatList 2 cols, keyExtractor
- [ ] T-111 | P0 | T-109 | ProductsScreen onEndReached → fetchNextPage
- [ ] T-112 | P0 | T-109 | ProductsScreen shows skeleton on isPending (no layout shift)
- [ ] T-113 | P0 | T-109 | ProductsScreen shows EmptyState on empty
- [ ] T-114 | P0 | T-109 | ProductsScreen shows ErrorState on error
- [ ] T-115 | P0 | T-109 | Wire navigation to ProductDetail on card press
- [ ] T-116 | P0 | T-109 | Validate manually with Slow 3G for cancellation behavior

## Phase 4 — Detail + Favorites (14h)

> **Per Testing Strategy v2**, granular test sub-tasks (T-123..T-127,
> T-133..T-138, T-141, T-146..T-150, T-153, T-158, T-176) are NOT implemented
> individually. `useFavorites` behavior is covered by Phase 5 v2 MUST test
> (T-182). Favorite flow on detail is covered by the integration test
> (T-184). MMKV corruption is IMPL-only.

- [ ] T-120 | P0 | T-001 | Create `src/storage/mmkv.ts` with KeyValueStorage interface
- [ ] T-121 | P0 | T-120 | Define STORAGE_KEYS = { favoritesV1: 'favorites:v1' } in `mmkv.ts`
- [ ] T-122 | P0 | T-120 | Create `src/features/favorites/repository/MMKVFavoritesRepository.ts` (implements IFavoritesRepository)
- [ ] T-123 | P0 | T-122 | Test MMKVFavoritesRepository: getAll on empty returns []
- [ ] T-124 | P0 | T-122 | Test MMKVFavoritesRepository: save + getAll round-trip
- [ ] T-125 | P0 | T-122 | Test MMKVFavoritesRepository: remove + getAll
- [ ] T-126 | P0 | T-122 | Test MMKVFavoritesRepository: exists boolean
- [ ] T-127 | P0 | T-122 | Test MMKVFavoritesRepository: corrupted JSON → [] + warn (EDGE-018)
- [ ] T-128 | P0 | T-122 | Create `src/features/favorites/store/favoritesStore.ts` (Zustand)
- [ ] T-129 | P0 | T-128 | Store includes `hydrate()` method
- [ ] T-130 | P0 | T-128 | Store keyed by id for O(1) exists
- [ ] T-131 | P0 | T-128 | Store list() sorted by addedAt desc
- [ ] T-132 | P0 | T-128 | Create `src/features/favorites/hooks/useFavorites.ts`
- [ ] T-133 | P0 | T-132 | Test useFavorites: returns hydrated list after init
- [ ] T-134 | P0 | T-132 | Test useFavorites: add persists (EDGE-019)
- [ ] T-135 | P0 | T-132 | Test useFavorites: remove persists
- [ ] T-136 | P0 | T-132 | Test useFavorites: toggle alternates
- [ ] T-137 | P0 | T-132 | Test useFavorites: exists correctness
- [ ] T-138 | P0 | T-132 | Test useFavorites: reactivity (add → list updates) (EDGE-017)
- [ ] T-139 | P0 | T-132 | Create `src/features/favorites/hooks/useToggleFavorite.ts`
- [ ] T-140 | P0 | T-132 | Create `src/features/favorites/hooks/useIsFavorite.ts`
- [ ] T-141 | P0 | T-140 | Test useIsFavorite returns boolean from store
- [ ] T-142 | P0 | T-139 | Create `src/features/favorites/components/FavoriteButton.tsx` (Reanimated 3)
- [ ] T-143 | P0 | T-142 | FavoriteButton uses `useSharedValue`, `useAnimatedStyle`, `withSpring`
- [ ] T-144 | P0 | T-142 | FavoriteButton a11y: role, label, state
- [ ] T-145 | P0 | T-142 | FavoriteButton touch target ≥ 44×44
- [ ] T-146 | P0 | T-142 | Test FavoriteButton: scale starts at 1
- [ ] T-147 | P0 | T-142 | Test FavoriteButton: pressIn → scale 1.2 spring (AC-ANIM-001)
- [ ] T-148 | P0 | T-142 | Test FavoriteButton: pressOut → scale 1 spring
- [ ] T-149 | P0 | T-142 | Test FavoriteButton: double-tap idempotent
- [ ] T-150 | P0 | T-142 | Test FavoriteButton: a11y state changes on toggle
- [ ] T-151 | P0 | T-142 | Lint ban: no `Animated` from `react-native` in this file
- [ ] T-152 | P0 | T-142 | Create `src/features/favorites/components/FavoriteListItem.tsx`
- [ ] T-153 | P0 | T-152 | FavoriteListItem a11y: label, hint
- [ ] T-154 | P0 | T-027 | Create `src/features/products/hooks/useProduct.ts` (single product detail)
- [ ] T-155 | P0 | T-154 | Test useProduct: success loads product (AC-DET-001)
- [ ] T-156 | P0 | T-154 | Test useProduct: 404 → EmptyState (AC-DET-002)
- [ ] T-157 | P0 | T-154 | Test useProduct: error → retry
- [ ] T-158 | P0 | T-154 | Test useProduct: favorite toggle updates icon (AC-FAV-001)
- [ ] T-159 | P0 | T-154 | Create `src/features/products/screens/ProductDetailScreen.tsx`
- [ ] T-160 | P0 | T-159 | ProductDetailScreen uses `useProduct` with id from route params
- [ ] T-161 | P0 | T-159 | ProductDetailScreen has horizontal image carousel (FlatList)
- [ ] T-162 | P0 | T-159 | ProductDetailScreen renders title, description, prices, rating, tags, category, brand when present (DETAIL-003)
- [ ] T-163 | P0 | T-159 | ProductDetailScreen renders secondary fields conditionally (DETAIL-004)
- [ ] T-164 | P0 | T-159 | ProductDetailScreen hides brand when null (EDGE-022)
- [ ] T-165 | P0 | T-159 | ProductDetailScreen falls back to thumbnail when images empty (EDGE-023)
- [ ] T-166 | P0 | T-159 | ProductDetailScreen hides tags when empty (EDGE-024)
- [ ] T-167 | P0 | T-159 | ProductDetailScreen has ProductDetailSkeleton
- [ ] T-168 | P0 | T-159 | ProductDetailScreen integrates FavoriteButton
- [ ] T-169 | P0 | T-128 | Hydrate favoritesStore in AppProviders before render of tabs
- [ ] T-170 | P0 | T-169 | Add splash guard while `!isHydrated`
- [ ] T-171 | P0 | T-128 | Create `src/features/favorites/screens/FavoritesScreen.tsx`
- [ ] T-172 | P0 | T-171 | FavoritesScreen reads from store, NOT from API (FAV-002)
- [ ] T-173 | P0 | T-171 | FavoritesScreen renders EmptyState when list empty
- [ ] T-174 | P0 | T-171 | FavoritesScreen items tappable to navigate to detail
- [ ] T-175 | P0 | T-171 | FavoritesScreen FavoriteButton toggle removes from list (AC-FAV-002)
- [ ] T-176 | P0 | T-171 | Test FavoritesScreen does NOT call productRepository (FAV-002)

## Phase 5 — Quality (4h)

> **MINIMUM REQUIRED, HIGH VALUE TESTING.** See `plan.md` § Testing Strategy.
> 4 MUST test files + up to 3 SHOULD files. No % coverage target.

- [ ] T-180 | P0 | T-176 | Create `src/features/products/hooks/__tests__/useProducts.test.ts` (initial load, error+retry, pagination, search↔category mutual exclusion)
- [ ] T-181 | P0 | T-176 | Create `src/features/favorites/hooks/__tests__/useFavorites.test.ts` (add, remove, reactivity, hydration)
- [ ] T-182 | P0 | T-176 | Create `src/shared/utils/__tests__/calculateDiscountedPrice.test.ts` (discount > 0, discount = 0)
- [ ] T-183 | P0 | T-176 | Create `src/features/products/screens/__tests__/ProductDetailScreen.test.tsx` (integration: render + tap FavoriteButton → state change)
- [ ] T-184 | P0 | T-180..T-183 | `npm test -- --ci` exits 0
- [ ] T-185 | P2 | T-184 | SHOULD: `formatCurrency.test.ts` (only if own logic beyond Intl wrapper)
- [ ] T-186 | P2 | T-184 | SHOULD: `useDebouncedValue.test.ts` (only if not covered by `useProducts.test.ts`)
- [ ] T-187 | P2 | T-184 | SHOULD: `productMapper.test.ts` (only if not covered by adjacent hook tests)

## Phase 6 — Hardening (8h)

- [ ] T-200 | P0 | T-193 | Audit a11y: every interactive has label, role, state
- [ ] T-201 | P0 | T-200 | Verify all touch targets ≥ 44×44
- [ ] T-202 | P0 | T-200 | Verify no state conveyed by color alone (use icon/text too)
- [ ] T-203 | P0 | T-027 | Verify dark mode toggle (system Settings) reflects immediately
- [ ] T-204 | P0 | T-016 | Wire GlobalErrorBoundary at app root
- [ ] T-205 | P0 | T-204 | ErrorBoundary fallback has "Reset" button
- [ ] T-206 | P0 | T-027 | Add `.github/workflows/ci.yml` (lint, format, test)
- [ ] T-207 | P0 | T-206 | CI runs on push (test with dummy commit on branch)
- [ ] T-208 | P0 | T-206 | CI runs on PR (test with draft PR)
- [ ] T-209 | P0 | T-027 | Write `README.md` per plan § README Plan
- [ ] T-210 | P0 | T-209 | README includes architecture diagram link
- [ ] T-211 | P0 | T-209 | README includes folder structure
- [ ] T-212 | P0 | T-209 | README includes tech stack table with versions
- [ ] T-213 | P0 | T-209 | README includes prerequisites (Node, RN, JDK, AS, Xcode, Ruby, Pods)
- [ ] T-214 | P0 | T-209 | README includes install/run/test/lint commands
- [ ] T-215 | P0 | T-209 | README includes technical decisions section
- [ ] T-216 | P0 | T-209 | README includes Known Tradeoffs
- [ ] T-217 | P0 | T-027 | Take screenshots: Products list (light + dark), Detail, Favorites
- [ ] T-218 | P0 | T-217 | Save screenshots in `docs/screenshots/`
- [ ] T-219 | P0 | T-218 | Reference screenshots from README
- [ ] T-220 | P0 | T-027 | Build APK debug (`./gradlew assembleDebug`)
- [ ] T-221 | P0 | T-027 | Build IPA debug (xcodebuild)
- [ ] T-222 | P0 | T-220..T-221 | Smoke test both binaries on simulators

## Phase 7 — Bonus: NativeCurrencyFormatter (12h, optional)

- [ ] T-230 | P3 | T-222 | Decide: implement or skip
- [ ] T-231 | P3 | T-230 | Create `NativeCurrencyFormatter.swift` iOS module
- [ ] T-232 | P3 | T-230 | Create `NativeCurrencyFormatterModule.kt` Android module
- [ ] T-233 | P3 | T-231 | Register Swift module in iOS bridge
- [ ] T-234 | P3 | T-232 | Register Kotlin module in Android package
- [ ] T-235 | P3 | T-231..T-232 | Create TS wrapper with NativeModules detection
- [ ] T-236 | P3 | T-235 | Wrapper fallback uses `Intl.NumberFormat`
- [ ] T-237 | P3 | T-236 | Test wrapper: when Native undefined → fallback path
- [ ] T-238 | P3 | T-236 | Test wrapper: when Native defined → calls native
- [ ] T-239 | P3 | T-235 | Document in README Bonus Features section

## Done Gate

- [ ] T-240 | P0 | T-222 | Run all gates in plan § Definition of Done
- [ ] T-241 | P0 | T-240 | Final commit + tag `v1.0.0`
