# Spec — topazProducts

Feature ID: 001-topaz-products
Status: Approved
Stack: React Native 0.81.x, React 19.1.x, TypeScript 5.8.x

## Purpose

A React Native app (iOS + Android) that consumes the public DummyJSON Products API
to browse products and persist favorites locally. No auth, no cart, no checkout.

## Why

Built as a Senior React Native technical assessment. Quality bar: production-grade
architecture, strict typing, comprehensive tests, accessibility, and design fidelity
to `.opencode/design.md`.

## In Scope

- Browse, search, filter, paginate products
- View product detail with image carousel
- Add/remove favorites, persisted locally, reactive across screens
- Light and dark mode via system theme
- Type-safe navigation
- Animated favorite button (Reanimated 3)
- CI running lint, format, tests on push/PR

## Out of Scope

- Authentication, accounts, cloud sync
- Cart, checkout, payments
- Push notifications
- E2E tests (Detox)
- Voice input, fuzzy search, recommendations
- Internationalization beyond ES/EN strings

## Requirements (with IDs)

### Architecture (ARCH)
- ARCH-001: Feature-Based Architecture (see constitution Art. I §1)
- ARCH-002: Repository Pattern (Art. I §2)
- ARCH-003: No `fetch` in screens (Art. X)
- ARCH-004: No MMKV outside `mmkvStorage.ts` (Art. I §2, Art. X)

### State Management (STORE)
- STORE-001: TanStack Query for server state (Art. II §1)
- STORE-002: Zustand for favorites (Art. II §2)
- STORE-003: MMKV for persistence (Art. II §3)

### Products (PROD)
- PROD-001: FlatList 2 columns with card showing image, title, price,
  discounted price, discountPercentage, favorite indicator
- PROD-002: Pagination via `limit`/`skip`
- PROD-003: `nextPage` derived from `total/limit`; stop fetching at `total`

### Search (SEARCH)
- SEARCH-001: Endpoint `GET /products/search?q=`
- SEARCH-002: Debounce ≥ 300ms (preferred 350ms)
- SEARCH-003: AbortSignal cancels obsolete requests
- SEARCH-004: Typing clears active category

### Category (CAT)
- CAT-001: Endpoint `GET /products/categories`
- CAT-002: UI displays `name`, API uses `slug`
- CAT-003: Endpoint `GET /products/category/{slug}`
- CAT-004: Selecting a category clears the search

### Detail (DETAIL)
- DETAIL-001: Endpoint `GET /products/{id}`
- DETAIL-002: Carousel of images
- DETAIL-003: title, description, original price, discounted price, rating, tags,
  category, brand (when present)
- DETAIL-004: Secondary fields: availabilityStatus, shippingInformation,
  warrantyInformation, returnPolicy
- DETAIL-005: No cart/checkout/purchase

### Favorites (FAV)
- FAV-001: 100% local (MMKV) (Art. II §3)
- FAV-002: FavoritesScreen never queries DummyJSON
- FAV-003: Reactive across screens without manual reload
- FAV-004: `FavoriteProduct` includes at least: id, title, thumbnail, price,
  discountPercentage, rating

### Repositories (REPO)
- REPO-001: `ProductRepository` interface: getProducts, getProductById,
  searchProducts, getProductsByCategory, getCategories
- REPO-002: Methods accept `AbortSignal`
- REPO-003: `FavoritesRepository` interface: getAll, save, remove, exists

### Networking (NET)
- NET-001: `httpClient` supports baseURL, query params, AbortSignal, timeout,
  JSON parsing, typed responses
- NET-002: No hardcoded URLs (Art. IV §1)
- NET-003: AbortSignal propagated queryFn → repo → api → httpClient → fetch
  (Art. IV §2)

### Errors (ERR)
- ERR-001: Typed errors: NetworkError, TimeoutError, HttpError, ParseError,
  UnknownAppError
- ERR-002: Friendly messages, no stack traces exposed
- ERR-003: GlobalErrorBoundary for sync errors; async errors via TanStack Query

### Loading (LOAD)
- LOAD-001: Initial load uses skeletons: `ProductCardSkeleton`, `ProductDetailSkeleton`
- LOAD-002: Pagination uses a small footer loader
- LOAD-003: No layout shift between skeleton and content

### Animation (ANIM)
- ANIM-001: FavoriteButton uses Reanimated 3: `useSharedValue`,
  `useAnimatedStyle`, `withSpring`
- ANIM-002: No `Animated` API for favorite button (Art. V §3)

### Navigation (NAV)
- NAV-001: React Navigation v7 Bottom Tab root
- NAV-002: `ProductsTab` hosts a Native Stack: Products → ProductDetail
- NAV-003: `FavoritesTab` hosts FavoritesScreen
- NAV-004: ProductDetail is NOT a tab (Art. VI §1)
- NAV-005: `RootTabParamList` and `ProductsStackParamList` exported (Art. VI §2)

### Performance (PERF)
- PERF-001: Stable `keyExtractor` on FlatList
- PERF-002: Image strategy via `@d11/react-native-fast-image` (or justified
  native Image)
- PERF-003: No indiscriminate memoization
- PERF-004: No `getItemLayout` without deterministic heights

### Accessibility (A11Y)
- A11Y-001: `accessibilityLabel`, `accessibilityRole`, `accessibilityState` on
  interactive elements
- A11Y-002: Touch targets ≥ 44×44
- A11Y-003: State not conveyed by color alone

### Design System (DSGN)
- DSGN-001: `.opencode/design.md` is the visual source of truth (Art. V §1)
- DSGN-002: No hardcoded colors in components
- DSGN-003: ThemeProvider + tokens

### Dark Mode (DARK)
- DARK-001: `useColorScheme` drives theme (Art. V §2)

### Testing (TEST)
- TEST-001: Unit tests for useProducts, useFavorites, useDebouncedValue, discount,
  currency, mappers, error mapping
- TEST-002: At least one meaningful integration test (Art. VII §2)
- TEST-003: No "renders without crashing" as primary evidence (Art. VII §3)

### Mocking (MOCK)
- MOCK-001: Repositories mocked in hook/UI tests; fetch NOT mocked at that layer
  (Art. VII §1)

### Lint/Format (LINT)
- LINT-001: `@typescript-eslint/no-explicit-any`, `react-hooks/rules-of-hooks`,
  `react-hooks/exhaustive-deps`
- LINT-002: `npm run lint` exits 0
- LINT-003: `npm run lint:format` exits 0

### CI (CI)
- CI-001: GitHub Actions runs `npm ci`, `npm run lint`, `npm run lint:format`,
  `npm test` on push/PR

### Native Module Bonus (NATIVE)
- NATIVE-001: `NativeCurrencyFormatter` (Swift + Kotlin) with TS fallback

## Acceptance Criteria

See `specs/001-topaz-products/plan.md` § Acceptance Criteria and `tasks.md` for
the per-criterion verification list. Top-level criteria:

- AC-OVER-001: App boots on iOS and Android without errors
- AC-OVER-002: Lint, format, tests, typecheck all exit 0
- AC-OVER-003: Every MUST requirement appears in Traceability Matrix
  (`plan.md` § Traceability Matrix) with a test reference
