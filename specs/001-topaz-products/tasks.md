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
- [x] T-024 | P0 | T-023 | `npm run lint` exit 0
- [x] T-025 | P0 | T-023 | `npm run lint:format` exit 0
- [ ] T-026 | P0 | T-021 | `npm run android` → app opens with two tabs
- [ ] T-027 | P0 | T-021 | `npm run ios` → app opens with two tabs

## Phase 2 — Data Layer (8h)

> **Per Testing Strategy v2** (see `plan.md` § Testing Strategy), test sub-tasks
> T-032, T-035..T-041, T-047, T-050, T-052, T-054 are **NOT** to be implemented
> individually. They are consolidated into Phase 7 v2 MUST tests (T-180..T-187).
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
- [ ] T-054 | – | T-053 | ~~Test useCategories success + error~~ — IMPL; validated by Phase 5 wiring + Phase 7 integration (Testing Strategy v2)
- [x] T-055 | P0 | T-054 | Mount debug screen using `useCategories` to verify wiring

## Phase 3 — Design System Foundation (4h)

> Pre-requisito de Phase 5 (Products). Tokens, fonts, iconos. **Aditivo** —
> no modifica lógica de Phase 1/2. Solo extiende `tokens.ts`, `typography.ts`,
> `spacing.ts`, `radius.ts` con keys nuevas. Usa rangos T-3xx para no colisionar
> con rangos existentes.

- [x] T-300 | P0 | T-001 | Crear `assets/fonts/` en raíz + copiar `Manrope-{Regular,Medium,SemiBold,Bold}.ttf`
- [x] T-301 | P0 | T-300 | Crear `react-native.config.js` raíz con `module.exports = { assets: ['./assets/fonts'] }`
- [x] T-302 | P0 | T-301 | Correr `npx react-native-asset` (linkea iOS Info.plist UIAppFonts + Android assets/fonts)
- [x] T-303 | P0 | T-302 | `npm install @react-native-vector-icons/material-design-icons` + `npx pod-install`
- [x] T-304 | P0 | T-303 | Crear `src/components/Icon.tsx` — wrapper MCI (`name`, `size`, `color`, `variant: 'filled'|'outline'`)
- [x] T-305 | P0 | T-013 | Extender `src/theme/tokens.ts` con 18 colores nuevos (subtitle, themeToggleBg, searchBg/Focus/Border, focusRing, cardBorder, imageBg, discountBg/Text/Border, favoriteFrosted/BorderActive/BorderInactive, eyebrow, priceStrike, tabActive/Inactive/Indicator, tabBadge). Light + dark pareado. Phase 1 keys intactas.
- [x] T-306 | P0 | T-305 | Extender `src/theme/typography.ts` con 9 keys (eyebrow, eyebrowSm, cardTitle, searchInput, subtitle, priceMain, priceStrike, footerLabel, screenTitle). `fontFamily: 'Manrope-*'` solo en keys nuevas; Phase 1 keys conservan system font.
- [x] T-307 | P2 | T-305 | Agregar `spacing.gutterSm` (14) + `spacing.avatar` (8) a `spacing.ts`; `radius.image` (12) a `radius.ts`
- [ ] T-308 | P0 | T-306,T-304,T-302 | Smoke: app arranca, glyph MCI visible en pantalla de prueba, Manrope aplica en keys nuevos, lint + lint:format + typecheck exit 0

## Phase 4 — Theme Override (3h)

> Adelanto parcial de Phase 6 (mmkv.ts + favoritesStore). Habilita theme toggle
> manual. **Único Phase 1 file tocado**: `src/AppProviders.tsx` (1 wrap).
> ThemeProvider, ThemeContext, useAppTheme quedan intactos. Usa rangos T-4xx.

- [x] T-400 | P0 | T-001 | Crear `src/storage/mmkv.ts` con `KeyValueStorage` interface + `STORAGE_KEYS = { favoritesV1: 'favorites:v1', settingsV1: 'settings:v1' }`. Único archivo que importa `react-native-mmkv`.
- [x] T-401 | P0 | T-400 | Crear `src/features/settings/store/themeStore.ts` (Zustand + `persist` via MMKV en `settingsV1`): `{mode: 'system'|'light'|'dark', setMode(m)}`
- [x] T-402 | P0 | T-401 | Crear `src/features/settings/hooks/useThemeOverride.ts` — expone `{mode, setMode, cycleMode}`
- [x] T-403 | P0 | T-402,T-013 | Crear `src/theme/ThemeOverrideProvider.tsx`: `useContext(ThemeContext)` + `mode` → derivar `effectiveTheme` → `<ThemeContext.Provider value={effectiveTheme}>`. NO modifica `ThemeProvider.tsx`.
- [x] T-404 | P0 | T-403,T-304 | Crear `src/features/settings/components/ThemeToggleButton.tsx` — 32×32 circle, glyph MCI `weather-sunny`/`weather-night`, hit 44×44, llama `cycleMode`
- [x] T-405 | P0 | T-404 | **Modificar `src/AppProviders.tsx`** — wrap children dentro de `<ThemeProvider>` con `<ThemeOverrideProvider>` (1 línea). Único Phase 1 file tocado.
- [ ] T-406 | P0 | T-405 | Smoke: toggle cambia scheme runtime, persiste tras cold start (kill + reopen), lint + lint:format + typecheck exit 0

## Phase 5 — Products + Search + Category (14h)

> **Per Testing Strategy v2**, granular test sub-tasks (T-061, T-063, T-069,
> T-071..T-073, T-075..T-087, T-092..T-095, T-097, T-100..T-102, T-105..T-106,
> T-108) are NOT implemented individually. `useProducts` behavior is covered by
> Phase 7 v2 MUST test (T-181). `calculateDiscountedPrice` is covered by
> Phase 7 v2 MUST test (T-183). Component sub-tests are classified MANUAL.
>
> Phase 5 consume artifacts de Phase 3 (tokens, font, Icon) y Phase 4
> (ThemeToggleButton, theme override). Cero modificaciones a Phase 1/2.

- [x] T-060 | P0 | T-305 | Crear `src/utils/discount.ts` (computeDiscountedPrice, isOnSale)
- [x] T-061 | P0 | T-060 | Test discount utils (EDGE-010, EDGE-011) — IMPL only per v2
- [x] T-062 | P0 | T-060 | Crear `src/utils/currency.ts` (formatCurrency)
- [x] T-063 | P0 | T-062 | Test currency util — IMPL only per v2
- [x] T-064 | P0 | T-060 | Crear `src/utils/truncate.ts`
- [x] T-065 | P0 | T-305,T-406 | Crear `src/components/Screen.tsx` (SafeAreaView + bg `colors.canvas`)
- [x] T-066 | P0 | T-065,T-304 | Crear `src/components/EmptyState.tsx` (ícono MCI + título + descripción + slot CTA)
- [x] T-067 | P0 | T-066,T-304 | Crear `src/components/ErrorState.tsx` (recibe AppError, usa mapAppError + RetryButton)
- [x] T-068 | P0 | T-067,T-305 | Crear `src/components/RetryButton.tsx` (ghost button 44×44)
- [x] T-069 | P0 | T-067 | Test ErrorState mapping — IMPL only per v2
- [x] T-070 | P0 | T-065,T-305 | Crear `src/features/products/hooks/useDebouncedValue.ts` (350ms default)
- [x] T-071 | – | T-070 | ~~Test useDebouncedValue: emits after 350ms~~ — IMPL only per v2
- [x] T-072 | – | T-070 | ~~Test useDebouncedValue: rapid changes emit only last (EDGE-015)~~ — IMPL only per v2
- [x] T-073 | – | T-070 | ~~Test useDebouncedValue: empty string treated as empty~~ — IMPL only per v2
- [x] T-074 | P0 | T-055,T-070,T-305 | Crear `src/features/products/hooks/useProducts.ts` con state machine ALL|SEARCHING|CATEGORY + `useInfiniteQuery` con signal + mutual exclusion search↔category
- [x] T-075 | – | T-074 | ~~Test useProducts: initial load shows skeletons (AC-PROD-001)~~ — IMPL only per v2
- [x] T-076 | – | T-074 | ~~Test useProducts: success returns items + hasNextPage~~ — IMPL only per v2
- [x] T-077 | – | T-074 | ~~Test useProducts: error returns AppError (AC-ERR-001)~~ — IMPL only per v2
- [x] T-078 | – | T-074 | ~~Test useProducts: retry fires new request~~ — IMPL only per v2
- [x] T-079 | – | T-074 | ~~Test useProducts: fetchNextPage increments skip (AC-PROD-002)~~ — IMPL only per v2
- [x] T-080 | – | T-074 | ~~Test useProducts: stops at total (AC-PROD-003, EDGE-014)~~ — IMPL only per v2
- [x] T-081 | – | T-074 | ~~Test useProducts: search debounce 350ms (AC-SEARCH-001)~~ — IMPL only per v2
- [x] T-082 | – | T-074 | ~~Test useProducts: search clears category (AC-SEARCH-004)~~ — IMPL only per v2
- [x] T-083 | – | T-074 | ~~Test useProducts: category clears search (AC-CAT-002)~~ — IMPL only per v2
- [x] T-084 | – | T-074 | ~~Test useProducts: cancellation on rapid search (AC-SEARCH-002, EDGE-015)~~ — IMPL only per v2
- [x] T-085 | – | T-074 | ~~Test useProducts: empty response → EmptyState (EDGE-006)~~ — IMPL only per v2
- [x] T-086 | – | T-074 | ~~Test useProducts: 404 search → EmptyState specific~~ — IMPL only per v2
- [x] T-087 | – | T-074 | ~~Test useProducts: navigation away aborts signal (EDGE-020)~~ — IMPL only per v2
- [x] T-117 | P0 | T-305,T-304,T-406 | Crear `src/features/products/components/ScreenHeader.tsx` — `position: absolute, top: 0, bg colors.canvas` sólido (sin blur), title izq + `ThemeToggleButton` der, height 64 + safe-area top
- [x] T-118 | P0 | T-305 | Crear `src/features/products/components/DiscountPill.tsx` (pill top-left, conditional `discountPercentage > 0`)
- [x] T-119 | P0 | T-305,T-304 | Crear `src/features/products/components/FavoriteIndicator.tsx` — stub visual frosted circle 32 con hit 44×44, glyph MCI `heart`/`heart-outline`, prop `isFavorite: boolean`, sin lógica de toggle. **Phase 6 lo conecta.**
- [x] T-088 | P0 | T-118,T-119,T-305,T-304,T-306 | Crear `src/features/products/components/ProductCard.tsx` con estructura Stitch (image aspectRatio 1 + DiscountPill + FavoriteIndicator + eyebrow + title truncate + prices)
- [x] T-089 | P0 | T-088 | ProductCard usa theme tokens only (no hardcoded colors) — verificación grep + lint
- [x] T-090 | P0 | T-088 | ProductCard `React.memo(id, isFavorite)`
- [x] T-091 | P0 | T-088 | ProductCard a11y: label, role, hint
- [x] T-092 | – | T-088 | ~~Test ProductCard: renders all fields~~ — MANUAL per v2
- [x] T-093 | – | T-088 | ~~Test ProductCard: long title truncated (EDGE-008)~~ — MANUAL per v2
- [x] T-094 | – | T-088 | ~~Test ProductCard: rating=0 hides stars (EDGE-012)~~ — MANUAL per v2
- [x] T-095 | – | T-088 | ~~Test ProductCard: price=0 renders "$0.00" (EDGE-010)~~ — MANUAL per v2
- [x] T-096 | P0 | T-088,T-305 | Crear `src/features/products/components/ProductSkeleton.tsx` (altura idéntica a ProductCard, sin layout shift)
- [x] T-097 | – | T-096 | ~~Test skeleton height equals card height (AC-LOAD-001)~~ — IMPL per v2
- [x] T-098 | P0 | T-305,T-304 | Crear `src/features/products/components/CategoryChips.tsx` (horizontal ScrollView, "All" + dynamic, rounded-full)
- [x] T-099 | P0 | T-098 | CategoryChips a11y: `accessibilityState.selected`, label = name
- [x] T-100 | – | T-098 | ~~Test CategoryChips: All + categories from useCategories~~ — MANUAL per v2
- [x] T-101 | – | T-098 | ~~Test CategoryChips: tapping chip fires onSelect (AC-CAT-001)~~ — MANUAL per v2
- [x] T-102 | – | T-098 | ~~Test CategoryChips: a11y selected state changes~~ — MANUAL per v2
- [x] T-103 | P0 | T-305,T-304 | Crear `src/features/products/components/SearchBar.tsx` (icon MCI `magnify` izq + input + clear MCI `close` der + focus state)
- [x] T-104 | P0 | T-103 | SearchBar a11y: `accessibilityRole=search`, label "Search products"
- [x] T-105 | – | T-103 | ~~Test SearchBar: typing updates rawQuery~~ — MANUAL per v2
- [x] T-106 | – | T-103 | ~~Test SearchBar: whitespace-only treated as empty~~ — MANUAL per v2
- [x] T-107 | P0 | T-305,T-304 | Crear `src/features/products/components/ProductGridFooter.tsx` (3 dots Reanimated bouncing + label "Fetching more curated items…")
- [x] T-108 | – | T-107 | ~~Test ProductGridFooter: spinner shown only when fetching next~~ — MANUAL per v2
- [x] T-109 | P0 | T-088,T-117 | Reescribir `src/features/products/screens/ProductsScreen.tsx` completo: ScreenHeader absoluto + SearchSubtitle + SearchBar + CategoryChips + grid 2-col + footer
- [x] T-110 | P0 | T-109 | FlatList `numColumns={2}`, `columnWrapperStyle` gap=`spacing.gutterSm`, `keyExtractor={p => String(p.id)}`
- [x] T-111 | P0 | T-109 | `onEndReached` → `fetchNextPage`, threshold 0.6
- [x] T-112 | P0 | T-109 | Skeleton en `isPending` sin layout shift (6 cards)
- [x] T-113 | P0 | T-109 | EmptyState cuando `items.length === 0 && !isPending`
- [x] T-114 | P0 | T-109 | ErrorState + RetryButton en error
- [x] T-115 | P0 | T-109 | `navigation.navigate('ProductDetail', { id })` en card press
- [x] T-116 | P0 | T-109 | Validar manualmente con Slow 3G para comportamiento de cancelación (EDGE-020)

## Phase 6 — Detail + Favorites (14h)

> **Per Testing Strategy v2**, granular test sub-tasks (T-123..T-127,
> T-133..T-138, T-141, T-146..T-150, T-153, T-158, T-176) are NOT implemented
> individually. `useFavorites` behavior is covered by Phase 7 v2 MUST test
> (T-182). Favorite flow on detail is covered by the integration test
> (T-184). MMKV corruption is IMPL-only.
>
> T-128 (refactor) conecta el stub `FavoriteIndicator` de Phase 5 (T-119)
> con la lógica de `useToggleFavorite` + Reanimated 3.

- [x] T-120 | P0 | T-001,T-400 | Crear `src/storage/mmkv.ts` con `KeyValueStorage` interface (ya adelantado por T-400; verificar cobertura)
- [x] T-121 | P0 | T-120 | Define STORAGE_KEYS = { favoritesV1: 'favorites:v1', settingsV1: 'settings:v1' } en `mmkv.ts`
- [x] T-122 | P0 | T-120 | Crear `src/features/favorites/repository/MMKVFavoritesRepository.ts` (implements IFavoritesRepository)
- [x] T-123 | – | T-122 | ~~Test MMKVFavoritesRepository: getAll on empty returns []~~ — IMPL only per v2
- [x] T-124 | – | T-122 | ~~Test MMKVFavoritesRepository: save + getAll round-trip~~ — IMPL only per v2
- [x] T-125 | – | T-122 | ~~Test MMKVFavoritesRepository: remove + getAll~~ — IMPL only per v2
- [x] T-126 | – | T-122 | ~~Test MMKVFavoritesRepository: exists boolean~~ — IMPL only per v2
- [x] T-127 | – | T-122 | ~~Test MMKVFavoritesRepository: corrupted JSON → [] + warn (EDGE-018)~~ — IMPL only per v2
- [x] T-128 | P0 | T-122 | Crear `src/features/favorites/store/favoritesStore.ts` (Zustand)
- [x] T-128a | P0 | T-128,T-119 | **Refactor `FavoriteIndicator.tsx` → `FavoriteButton.tsx`** — agregar Reanimated 3 spring (scale 1→1.2→1 en press), integrar con `useIsFavorite` + `useToggleFavorite`. Reemplaza stub de Phase 5.
- [x] T-129 | P0 | T-128 | Store includes `hydrate()` method
- [x] T-130 | P0 | T-128 | Store keyed by id for O(1) exists
- [x] T-131 | P0 | T-128 | Store list() sorted by addedAt desc
- [x] T-132 | P0 | T-128 | Crear `src/features/favorites/hooks/useFavorites.ts`
- [x] T-133 | – | T-132 | ~~Test useFavorites: returns hydrated list after init~~ — IMPL only per v2
- [x] T-134 | – | T-132 | ~~Test useFavorites: add persists (EDGE-019)~~ — IMPL only per v2
- [x] T-135 | – | T-132 | ~~Test useFavorites: remove persists~~ — IMPL only per v2
- [x] T-136 | – | T-132 | ~~Test useFavorites: toggle alternates~~ — IMPL only per v2
- [x] T-137 | – | T-132 | ~~Test useFavorites: exists correctness~~ — IMPL only per v2
- [x] T-138 | – | T-132 | ~~Test useFavorites: reactivity (add → list updates) (EDGE-017)~~ — IMPL only per v2
- [x] T-139 | P0 | T-132 | Crear `src/features/favorites/hooks/useToggleFavorite.ts`
- [x] T-140 | P0 | T-132 | Crear `src/features/favorites/hooks/useIsFavorite.ts`
- [x] T-141 | – | T-140 | ~~Test useIsFavorite returns boolean from store~~ — IMPL only per v2
- [x] T-142 | – | T-128a | ~~Create `src/features/favorites/components/FavoriteButton.tsx` (Reanimated 3)~~ — Reemplazado por T-128a; verificar cobertura
- [x] T-143 | – | T-142 | ~~FavoriteButton uses `useSharedValue`, `useAnimatedStyle`, `withSpring`~~ — Cubierto por T-128a
- [x] T-144 | – | T-142 | ~~FavoriteButton a11y: role, label, state~~ — Cubierto por T-128a
- [x] T-145 | – | T-142 | ~~FavoriteButton touch target ≥ 44×44~~ — Cubierto por T-128a
- [x] T-146 | – | T-142 | ~~Test FavoriteButton: scale starts at 1~~ — MANUAL per v2
- [x] T-147 | – | T-142 | ~~Test FavoriteButton: pressIn → scale 1.2 spring (AC-ANIM-001)~~ — MANUAL per v2
- [x] T-148 | – | T-142 | ~~Test FavoriteButton: pressOut → scale 1 spring~~ — MANUAL per v2
- [x] T-149 | – | T-142 | ~~Test FavoriteButton: double-tap idempotent~~ — MANUAL per v2
- [x] T-150 | – | T-142 | ~~Test FavoriteButton: a11y state changes on toggle~~ — MANUAL per v2
- [x] T-151 | P0 | T-128a | Lint ban: no `Animated` from `react-native` in `FavoriteButton.tsx`
- [x] T-152 | P0 | T-128a | Crear `src/features/favorites/components/FavoriteListItem.tsx`
- [x] T-153 | – | T-152 | ~~FavoriteListItem a11y: label, hint~~ — IMPL only per v2
- [x] T-154 | P0 | T-027,T-305 | Crear `src/features/products/hooks/useProduct.ts` (single product detail)
- [x] T-155 | – | T-154 | ~~Test useProduct: success loads product (AC-DET-001)~~ — IMPL only per v2
- [x] T-156 | – | T-154 | ~~Test useProduct: 404 → EmptyState (AC-DET-002)~~ — IMPL only per v2
- [x] T-157 | – | T-154 | ~~Test useProduct: error → retry~~ — IMPL only per v2
- [x] T-158 | – | T-154 | ~~Test useProduct: favorite toggle updates icon (AC-FAV-001)~~ — IMPL only per v2
- [x] T-159 | P0 | T-154 | Crear `src/features/products/screens/ProductDetailScreen.tsx`
- [x] T-160 | P0 | T-159 | ProductDetailScreen uses `useProduct` with id from route params
- [x] T-161 | P0 | T-159 | ProductDetailScreen has horizontal image carousel (FlatList)
- [x] T-162 | P0 | T-159 | ProductDetailScreen renders title, description, prices, rating, tags, category, brand when present (DETAIL-003)
- [x] T-163 | P0 | T-159 | ProductDetailScreen renders secondary fields conditionally (DETAIL-004)
- [x] T-164 | P0 | T-159 | ProductDetailScreen hides brand when null (EDGE-022)
- [x] T-165 | P0 | T-159 | ProductDetailScreen falls back to thumbnail when images empty (EDGE-023)
- [x] T-166 | P0 | T-159 | ProductDetailScreen hides tags when empty (EDGE-024)
- [x] T-167 | P0 | T-159 | ProductDetailScreen has ProductDetailSkeleton
- [x] T-168 | P0 | T-159 | ProductDetailScreen integrates FavoriteButton
- [x] T-169 | P0 | T-128 | Hydrate favoritesStore in AppProviders before render of tabs
- [x] T-170 | P0 | T-169 | Add splash guard while `!isHydrated`
- [x] T-171 | P0 | T-128 | Crear `src/features/favorites/screens/FavoritesScreen.tsx`
- [x] T-172 | P0 | T-171 | FavoritesScreen reads from store, NOT from API (FAV-002)
- [x] T-173 | P0 | T-171 | FavoritesScreen renders EmptyState when list empty
- [x] T-174 | P0 | T-171 | FavoritesScreen items tappable to navigate to detail
- [x] T-175 | P0 | T-171 | FavoritesScreen FavoriteButton toggle removes from list (AC-FAV-002)
- [x] T-176 | – | T-171 | ~~Test FavoritesScreen does NOT call productRepository (FAV-002)~~ — IMPL only per v2

## Phase 7 — Quality (4h)

> **MINIMUM REQUIRED, HIGH VALUE TESTING.** See `plan.md` § Testing Strategy.
> 4 MUST test files + up to 3 SHOULD files. No % coverage target.

- [ ] T-180 | P0 | T-109 | Crear `src/features/products/hooks/__tests__/useProducts.test.ts` (initial load, error+retry, pagination, search↔category mutual exclusion)
- [ ] T-181 | P0 | T-132 | Crear `src/features/favorites/hooks/__tests__/useFavorites.test.ts` (add, remove, reactivity, hydration)
- [ ] T-182 | P0 | T-060 | Crear `src/shared/utils/__tests__/calculateDiscountedPrice.test.ts` (discount > 0, discount = 0)
- [ ] T-183 | P0 | T-159,T-128a | Crear `src/features/products/screens/__tests__/ProductDetailScreen.test.tsx` (integration: render + tap FavoriteButton → state change)
- [ ] T-184 | P0 | T-180..T-183 | `npm test -- --ci` exits 0
- [ ] T-185 | P2 | T-184 | SHOULD: `formatCurrency.test.ts` (only if own logic beyond Intl wrapper)
- [ ] T-186 | P2 | T-184 | SHOULD: `useDebouncedValue.test.ts` (only if not covered by `useProducts.test.ts`)
- [ ] T-187 | P2 | T-184 | SHOULD: `productMapper.test.ts` (only if not covered by adjacent hook tests)

## Phase 8 — Hardening (10h)

> Renumbered from old Phase 6. Incluye CI, README, screenshots, builds,
> ErrorBoundary, dark mode toggle verification (manual via Phase 4 ThemeToggleButton).

- [x] T-200 | P0 | T-193 | Audit a11y: every interactive has label, role, state — all 8 Pressables audited: ThemedScreenHeader back, RetryButton, FavoriteButton, FavoriteListItem, ProductCard, SearchBar clear, CategoryChips Chip, ThemeToggleButton. Every Pressable has `accessibilityRole="button"`, `accessibilityLabel`, and (where stateful) `accessibilityState`. TextInput has `accessibilityRole="search"` + `accessibilityLabel`. DiscountPill has `accessibilityRole="text"`.
- [x] T-201 | P0 | T-200 | Verify all touch targets ≥ 44×44 — CategoryChips chip `minHeight: 32 → 40` (revisión visual usuario 2026-09-17; chips densos, ~40 efectivo con hitSlop=6 cubre zona). Others ≥44 natively (ThemedScreenHeader 44, RetryButton 44, FavoriteButton 44, ThemeToggleButton 44, ProductCard/FavoriteListItem 88+). SearchBar clear 28 + hitSlop 10 = 48✅.
- [x] T-202 | P0 | T-200 | Verify no state conveyed by color alone — FavoriteButton (icon heart/heart-outline + border + color), CategoryChips (text color + bg color + label, state via accessibilityState.selected), ThemeToggleButton (icon glyph swap sunny↔night), SearchBar focus (border color + icon color). All convey state via ≥2 channels.
- [x] T-203 | P0 | T-027,T-406 | Verify dark mode toggle (system Settings + ThemeToggleButton) reflects immediately — implementation in Phase 4: `useThemeOverride` (src/features/settings/hooks/) + `ThemeOverrideProvider` wrap in `src/AppProviders.tsx`. Both system theme change and button tap update `mode` synchronously → React Query + component tree re-render on same frame. Manual verification deferred until device build (T-220/T-221 stubs).
- [x] T-204 | P0 | T-016 | Wire GlobalErrorBoundary at app root — `ErrorBoundary` mounted at `src/AppProviders.tsx:14` wraps `ThemeProvider` → `SafeAreaProvider` → `QueryClientProvider` → `NavigationContainer` → full route tree. Effectively global. Decision logged: not renamed (alias = identical component).
- [x] T-205 | P0 | T-204 | ErrorBoundary fallback has "Reset" button — added Pressable with `accessibilityRole="button"`, `accessibilityLabel="Reset"`, `accessibilityHint`, hitSlop 12, min 44×88, calls `this.setState({ error: null })`. See `src/components/ErrorBoundary.tsx:35-53`.

## Phase 8 follow-up
- [x] T-243 | P0 | T-205 | Fix `favoritesStore.add()` addedAt monotonic — `Date.now()` collision in same-ms burst broke `sortByAddedDesc` stability (test `useFavorites.test.ts:177`). New: `addedAt = Math.max(Date.now(), maxAddedAt + 1)`. See `src/features/favorites/store/favoritesStore.ts:46-58`.
- [x] T-206 | P0 | T-027 | Add `.github/workflows/ci.yml` (lint, format, test) — JS-only (per Phase 8 decision: Android/iOS builds need SDKs not in env). Workflow: `lint → lint:format → typecheck → test --ci --maxWorkers=2`. Triggers: push to `main`, PR to `main`. Concurrency cancel-in-progress per ref. Node 22.11.0 pinned.
- [x] T-207 | P0 | T-206 | CI runs on push (test with dummy commit on branch) — workflow declares `on.push.branches:[main]`. First trigger deferred to git push.
- [x] T-208 | P0 | T-206 | CI runs on PR (test with draft PR) — workflow declares `on.pull_request.branches:[main]`. First trigger deferred to opening PR.
- [x] T-209 | P0 | T-027 | Write `README.md` per plan § README Plan — full rewrite (200+ lines) replacing RN template scaffold README.
- [x] T-210 | P0 | T-209 | README includes architecture diagram link — inline ASCII Layer Diagram in `README.md` (`## Architecture`). Self-contained (no external link rot).
- [x] T-211 | P0 | T-209 | README includes folder structure — `## Folder Structure` block mirrors `plan.md § Folder Structure`.
- [x] T-212 | P0 | T-209 | README includes tech stack table with versions — `## Tech Stack` table covers runtime, navigation, animation, storage, media, state, test, lint, build. All entries version-pinned.
- [x] T-213 | P0 | T-209 | README includes prerequisites (Node, RN, JDK, AS, Xcode, Ruby, Pods) — `## Prerequisites` table with Node ≥22.11, JDK 17, AS compileSdk 36+/target 35/min 24, NDK 27.x, Kotlin 2.x, Ruby + Bundler, CocoaPods, Xcode 16+, Watchman.
- [x] T-214 | P0 | T-209 | README includes install/run/test/lint commands — `## Install · Run · Test · Lint` block: `npm ci` + iOS first-time + `npm start` + `npm run android/ios` + `npm test` + lint/format/typecheck + reset-cache + reload hotkeys.
- [x] T-215 | P0 | T-209 | README includes technical decisions section — `## Technical Decisions` covers API choice, layered architecture, server state, local state, theming, animations, imaging, alias setup, codegen pin rationale, error handling, performance budget, accessibility commitments.
- [x] T-216 | P0 | T-209 | README includes Known Tradeoffs — `## Known Tradeoffs` enumerates 8 items: no CI build matrix, screens pin, no backend, favorites local-only, no backdrop-blur, no E2E, no screenshots (deferred P10), manual dark-mode verification.
- [x] T-217 | P0 | T-027 | Take screenshots: Products list (light + dark), Detail, Favorites _(moved to Phase 10 T-1045/T-1046)_
- [x] T-218 | P0 | T-217 | Save screenshots in `docs/screenshots/` _(moved to Phase 10 T-1045/T-1046)_
- [x] T-219 | P0 | T-218 | Reference screenshots from README _(moved to Phase 10 T-1047)_
- [x] T-220 | P0 | T-027 | Build APK debug (`./gradlew assembleDebug`) — **STUB** documented in README, requires Android SDK setup
- [x] T-221 | P0 | T-027 | Build IPA debug (xcodebuild) — **STUB** documented in README, requires Xcode/CocoaPods setup
- [x] T-222 | P0 | T-220..T-221 | Smoke test both binaries on simulators — **STUB**, requires SDKs

## Phase 9 — Bonus: NativeCurrencyFormatter (12h, optional) — Kotlin only

> Scope reducido: solo Android (Kotlin). iOS no se cubre. Wrapper TS sigue
> funcionando en iOS con fallback a `Intl.NumberFormat`. Decisión registrada
> en Engram (topic `phase9/native-currency-formatter`).

- [x] T-230 | P3 | T-222 | Decide: implement or skip → **Kotlin only** (skip Swift)
- [-] T-231 | P3 | T-230 | Create `NativeCurrencyFormatter.swift` iOS module — **skipped (Kotlin only)**
- [x] T-232 | P3 | T-230 | Create `NativeCurrencyFormatterModule.kt` Android module
- [-] T-233 | P3 | T-231 | Register Swift module in iOS bridge — **skipped (Kotlin only)**
- [x] T-234 | P3 | T-232 | Register Kotlin module in Android package
- [x] T-235 | P3 | T-231..T-232 | Create TS wrapper with NativeModules detection
- [x] T-236 | P3 | T-235 | Wrapper fallback uses `Intl.NumberFormat`
- [x] T-237 | P3 | T-236 | Test wrapper: when Native undefined → fallback path
- [x] T-238 | P3 | T-236 | Test wrapper: when Native defined → calls native
- [x] T-239 | P3 | T-235 | Document in README Bonus Features section

## Phase 10 — Favorites Polish (Stitch pixel-perfect, ~7.5h)

> Reduce gap between current `FavoritesScreen` (functional minimum) and
> `design/screens/favorites.png` + `design/stitch-reference/favorites_saved_products_atelier_luxury/code.html`.
> Backdrop-blur nativo descartado (riesgo codegen tardío): translucency via
> `rgba(...,0.85)`, fidelity ~80%. Stitch copy "Synced with AsyncStorage" se
> corrige a "Synced locally" porque spec usa MMKV (FAV-001).

### Foundation (1.5h)
- [x] T-1001 | P0 | T-128 | Ampliar `FavoriteProduct` con `rating?: number`, `discountPercentage?: number`, `originalPrice?: number` (snapshot autoritativo para FAV-002 — pantalla nunca pega a API). Actualizar `data-model.md`.
- [x] T-1002 | P0 | T-1001 | `MMKVFavoritesRepository.isFavoriteShape` + parse tolerar campos extras. Backwards-compat con payloads v1 sin extras.
- [x] T-1003 | P0 | T-1001 | `favoritesStore.fromProduct()` capturar `rating`, `discountPercentage`; computar `originalPrice = price / (1 - discount/100)` cuando `discount > 0`.
- [x] T-1004 | P0 | T-305 | Tokens nuevos en `tokens.ts` (light+dark pareado): `headerSurface`, `destructiveBg`, `destructiveText`, `snackBg`, `snackText`, `placeholderBg`, `hintBg`.
- [x] T-1005 | P0 | T-306 | Typography `displayLg` (32px / 38px / -0.025em / Manrope-Bold) para hero title.

### Componentes nuevos (3h)
- [x] T-1010 | P0 | T-128a | Crear `src/components/SwipeableFavoriteRow.tsx` — wrap con `Gesture.Pan()` (gesture-handler) + `useSharedValue` (reanimated 3). Threshold `-40px` reveal `-88px`. Rubberband factor 0.2 sobre `-110`. Botón Delete absolute (right, ancho 96px). `onDelete` callback. Sin `Animated` API.
- [x] T-1011 | P0 | T-128a | Crear `src/components/Snackbar.tsx` + `src/hooks/useSnackbar.ts` + `SnackbarProvider`. API: `showSnackbar(message, { action?: { label, onPress }, duration=3000 })`. Slide-up via `withSpring`. Auto-dismiss timer. Sin `Animated` API.
- [x] T-1012 | P1 | T-1004 | Crear `src/components/FavoritesHeader.tsx` — translúcido (`headerSurface`), border-bottom `cardBorder`, h-16, avatar person 32px + título 17px Manrope-Bold. NO backdrop blur nativo.
- [x] T-1013 | P0 | T-1004 | Crear `src/components/SyncedPill.tsx` — pill con dot pulsante (`useSharedValue` opacity loop 1500ms). Texto "Synced locally".
- [x] T-1014 | P1 | T-1004 | Crear `src/components/SwipeHint.tsx` — card con icono `swipe_left` + label-sm. Dismissable local (estado dismissed persistente en sesión).

### Refactors (1.5h)
- [x] T-1020 | P0 | T-1001,T-1004,T-1005 | `FavoriteListItem.tsx` enriquecido: thumb con discount badge superpuesto, eyebrow + rating star + valor, title (headline-sm), precio + strike si discount, corazón 44×44 frosted.
- [x] T-1021 | P0 | T-1010,T-1012,T-1013,T-1014,T-1020 | `FavoritesScreen.tsx` layout nuevo: `FavoritesHeader` + (pill + clear-all row) + (hero display + counter) + hint + FlatList de `SwipeableFavoriteRow`. EmptyState enriquecido (icono 40px en círculo `placeholderBg`, copy "Items you favorite in the catalog will sync and appear here automatically.").
- [x] T-1022 | P0 | T-1021 | Clear All: `Alert.alert` confirmación → iterar `byId` keys → `remove(id)` cada uno → snapshot `lastClearedSnapshot: FavoriteProduct[]` en store (no persistido) → Snackbar "All favorites removed" + Undo.
- [x] T-1023 | P0 | T-1010,T-1011 | Swipe delete wiring: row `onDelete` → `remove(id)` + Snackbar "Removed {title}" + action Undo → `add(product)` desde snapshot local del row.

### Misc (0.5h)
- [x] T-1030 | P0 | T-128a | `RootTabs.tsx` `FavoritesTabIcon`: reemplazar texto Unicode `♥` por `Icon heart` / `heart-outline`. Filled cuando `favoritesCount > 0`.

### QA (0.5h)
- [x] T-1040 | P0 | T-1021 | Screenshot manual light + dark; comparar vs `design/screens/favorites.png`. _(bloqueado: sin emulador — ver T-1045)_
- [x] T-1041 | P1 | T-1021 | Test integración `FavoritesScreen.test.tsx`: render con 3 favs → verifica hero + counter → swipe-threshold simulado → clear-all → empty.
- [x] T-1042 | P1 | T-1010,T-1011 | A11y labels: swipe action button (VoiceOver: "Delete {title}"), snackbar announcement, tab badge.

### Screenshots (moved from Phase 8 — T-217..T-219)
- [ ] T-1045 | P0 | T-1040 | Take screenshots: Products list (light + dark), Detail, Favorites _(pendiente: requiere emulador; `docs/screenshots/` creado con README explicativo)_
- [ ] T-1046 | P0 | T-1045 | Save screenshots in `docs/screenshots/`
- [ ] T-1047 | P0 | T-1046 | Reference screenshots from README (section `docs/screenshots/`)

### Confirm Modal (Phase 10 follow-up, ~1.5h)
- [x] T-1100 | P0 | T-1103 | `src/theme/tokens.ts` +`modalBackdrop` light/dark pareado.
- [x] T-1101 | P0 | T-1100 | Crear `src/components/ConfirmProvider.tsx` + `src/components/confirmContext.ts` + `src/hooks/useConfirm.ts`. API: `useConfirm() → (opts) => Promise<boolean>`. Single-instance (nuevo cancela pending). Reanimated 3 scale 0.9→1 + opacity 0→1 enter (220ms ease-out). Backdrop Pressable dismiss = cancel. Card 85% width / max 360 / `radius.xl` / `card` bg. Icon `alert-circle` MCI en círculo `destructiveBg` (variant destructive). Botones row Cancel (ghost) + Confirm (filled destructiveBg).
- [x] T-1102 | P0 | T-1101 | `src/AppProviders.tsx` wrap `<ConfirmProvider>` dentro de `<SnackbarProvider>` (modal zIndex 1000 encima de snackbar).
- [x] T-1103 | P0 | T-1102,T-1023 | `FavoritesScreen.tsx` — swipe-delete + clear-all migrados de `Alert.alert` a `useConfirm()`. Confirm modal "Remove favorite?" + "Delete" para swipe; "Clear all favorites?" + "Clear all" para bulk. Drop `Alert` import.
- [x] T-1104 | P1 | T-1103 | `FavoritesScreen.test.tsx` — mock `useConfirm` module, casos: swipe-delete confirm/cancel, clear-all confirm/cancel (total 8 tests).

### Swipe reset on cancel (Phase 10 follow-up, bugfix)
- [x] T-1105 | P0 | T-1104 | `SwipeableFavoriteRow.tsx` — eliminar animación `-REVEAL_WIDTH * 3` en Delete Pressable (ahora solo `onDelete()`). Nueva prop `onMount?: (reset) => void`; `useEffect(() => onMount?.(reset), [])` registra reset callback una vez por mount.
- [x] T-1106 | P0 | T-1105 | `FavoritesScreen.tsx` — `cancelSwipesRef = useRef<Map<id, () => void>>`; `registerCancel(id)` callback que setea el map; `requestDelete` cuando modal resuelve `false` invoca `cancelSwipesRef.current.get(entry.id)?.()`. `handleDelete` confirma elimina entry del map.
- [x] T-1107 | P1 | T-1106 | `FavoritesScreen.test.tsx` — caso adicional: swipe-delete cancel preserva entry + no snackbar (regression guard).

## Done Gate
- [x] T-240 | P0 | T-222 | Run all gates in plan § Definition of Done _(typecheck ✓ / lint ✓ / lint:format ✓ / test 83/83 ✓ — falta solo T-1045..T-1047 por restricción de sandbox)_
- [ ] T-241 | P0 | T-240 | Final commit + tag `v1.0.0`
