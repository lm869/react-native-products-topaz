# topazProducts

Catálogo de productos en React Native 0.81 con búsqueda, categorías, detalle y favoritos.
Scaffold desde `@react-native-community/cli@20`, arquitectura por capas
(`domain` → `api` / `storage` → `feature/repository` → `feature/hooks` → `feature/components` → `screens`),
TanStack Query para estado del servidor, Zustand + MMKV para persistencia local.

Fuente de verdad: [`specs/001-topaz-products/`](specs/001-topaz-products/)
(spec.md, plan.md, tasks.md, data-model.md, constitution).

---

## Arquitectura

```
                UI (Screens, Components)
                       │
                       ▼
        Feature Hooks (TanStack Query / Zustand)
                       │
                       ▼
            Repository (interface + concrete)
                       │
            ┌──────────┴──────────┐
            ▼                     ▼
       Api Module           Storage Adapter
            │                     │
            ▼                     ▼
       httpClient ──► fetch     MMKV
```

Las reglas de dependencia se fuerzan vía ESLint `no-restricted-imports`
(ver `plan.md § Dependency Rules`).

---

## Estructura de carpetas

```
topazProducts/
├── App.tsx                      # monta <AppProviders><Navigation/></AppProviders>
├── index.js
├── package.json
└── src/
    ├── AppProviders.tsx          # composition root (ErrorBoundary → Theme → SafeArea → Query → Navigation)
    │
    ├── api/                      # httpClient, config, AppError, queryKeys
    ├── domain/                   # modelos puros + interfaces de repository (sin RN, sin React)
    │   ├── product/
    │   └── favorites/
    │
    ├── features/
    │   ├── products/
    │   │   ├── api/              # DTOs + 5 endpoints (DummyJSON)
    │   │   ├── mappers/          # DTO → domain
    │   │   ├── repository/       # DummyJsonProductRepository
    │   │   ├── hooks/            # useProducts, useProduct, useCategories, useDebouncedValue
    │   │   ├── components/       # ProductCard, SearchBar, CategoryChips, Skeleton, Footer
    │   │   └── screens/          # ProductsScreen, ProductDetailScreen
    │   └── favorites/
    │       ├── repository/       # MMKVFavoritesRepository
    │       ├── store/            # favoritesStore (Zustand)
    │       ├── hooks/            # useFavorites, useIsFavorite, useToggleFavorite
    │       ├── components/       # FavoriteButton (Reanimated 3), FavoriteListItem
    │       └── screens/          # FavoritesScreen
    │
    ├── storage/                  # mmkv.ts — único import boundary de RN-MMKV
    ├── components/               # UI compartida (ErrorBoundary, RetryButton, EmptyState, Screen, ThemedScreenHeader, HydrationGate, Icon)
    ├── hooks/                    # useAppState, useMounted
    ├── utils/                    # currency, discount, truncate
    ├── store/                    # queryClient (TanStack Query)
    ├── navigation/               # RootTabs, ProductsStack, types
    └── theme/                    # tokens, light/dark themes, typography, spacing, radius, ThemeContext
```

---

## Stack tecnológico

| Capa            | Librería                                            | Versión         | Notas |
|-----------------|-----------------------------------------------------|-----------------|-------|
| Runtime         | React Native                                        | `0.81.0`        | exact |
|                 | React                                               | `19.1.0`        | exact |
|                 | TypeScript                                          | `^5.8.3`        | strict mode |
| Navigation      | `@react-navigation/native`                          | `^7.4.1`        | |
|                 | `@react-navigation/native-stack`                    | `^7.19.1`       | |
|                 | `@react-navigation/bottom-tabs`                     | `^7.19.1`       | |
|                 | `react-native-screens`                              | `4.15.0` exact  | última 4.x compatible con codegen de RN 0.81 |
|                 | `react-native-safe-area-context`                    | `^5.5.2`        | |
| Animación       | `react-native-reanimated`                           | `^3.19.5`       | worklets |
|                 | `react-native-gesture-handler`                      | `^2.33.0`       | gestures |
| Almacenamiento  | `react-native-mmkv`                                 | `^3.3.3`        | KV síncrono |
| Imágenes        | `@d11/react-native-fast-image`                      | `^8.13.0`       | fork D11, FastImage |
|                 | `@react-native-vector-icons/material-design-icons`  | `^13.1.4`       | fuente de glyphs |
| Estado          | `@tanstack/react-query`                             | `^5.102.8`      | server cache |
|                 | `zustand`                                           | `^5.0.15`       | store local |
| Tests           | `jest`                                              | `^29.6.3`       | preset `react-native` |
|                 | `@testing-library/react-native`                     | `^14.0.1`       | RNTL v14 (render async) |
|                 | `react-test-renderer`                               | `19.1.0`        | exact |
| Lint            | `eslint`                                            | `^8.19.0`       | `@react-native/eslint-config` |
|                 | `prettier`                                          | `2.8.8`         | format check |
| Build           | `@react-native-community/cli`                       | `20.0.0`        | scaffold |
|                 | `babel-plugin-module-resolver`                      | `^5.0.3`        | requerido para alias `@/*` en Metro |
| Native module   | Kotlin (`2.x`)                                      | `java.text.NumberFormat` (Android ICU) | bonus Phase 9 — Kotlin only, fallback a `Intl` en iOS |

Engines: `node >= 22.11.0` (forzado por `package.json`).

---

## Prerrequisitos

| Herramienta    | Versión          | Por qué |
|----------------|------------------|---------|
| Node.js        | `>= 22.11.0`     | forzado por `engines.node` |
| npm            | bundled con Node | package manager |
| JDK            | `17` (LTS)       | Android Gradle |
| Android SDK    | `compileSdk 36+` | build target |
|                | `targetSdk 35`   | runtime target |
|                | `minSdk 24`      | floor |
| Android NDK    | `27.x`           | native modules |
| Kotlin         | `2.x`            | Android Gradle script |
| Ruby           | `>= 3.x` (con Bundler) | CocoaPods + `bundle` |
| CocoaPods      | `>= 1.15`        | dependencias iOS |
| Xcode          | `16+`            | build iOS |
| Watchman       | latest           | Metro (Linux/macOS) |

iOS requiere además `bundle install` una vez y `bundle exec pod install`
en cada cambio de dependencia nativa (pineado a `vendor/bundle` vía `.bundle/config`).

---

## Install · Run · Test · Lint

> **Primera vez**: `npm ci` instala todo. Para iOS también `bundle install`
> (instala CocoaPods) y luego `bundle exec pod install`.

```sh
# Instalar dependencias JS
npm ci

# Arrancar Metro dev server (en una terminal — dejarlo corriendo)
npm start

# Build + lanzar en emulador/simulador (en otra terminal)
npm run android    # Android
npm run ios        # iOS (requiere pod install arriba)

# Tests
npm test                    # Jest (interactivo)
npm test -- --ci            # modo CI (sin watch, single pass)

# Lint + format + typecheck
npm run lint                # ESLint sobre src/ App.tsx __tests__/
npm run lint:format         # Prettier check (no escribe)
npm run format              # Prettier write
npm run typecheck           # tsc --noEmit
```

Reset cache de Metro (tras cambios en `babel.config.js`, `metro.config.js`, o alias):

```sh
npm start -- --reset-cache
```

Full reload en device:

- **Android**: <kbd>R</kbd> dos veces, o Dev Menu (<kbd>Ctrl</kbd>+<kbd>M</kbd> / <kbd>⌘</kbd>+<kbd>M</kbd>).
- **iOS**: <kbd>R</kbd> en Simulator.

---

## Decisiones técnicas

- **API**: [DummyJSON `/products`](https://dummyjson.com/docs/products) — sin auth,
  soporta paginación + search + filtro por categoría + sort. Endpoints clave:
  `GET /products?limit&skip&search&category&sortBy&order`,
  `GET /products/:id`, `GET /products/categories`, `GET /products/category/:slug`.

- **Arquitectura por capas**: `domain` (interfaces + modelos puros) → `api` / `storage`
  (adaptadores de infra) → `feature/repository` (impl concreta) → `feature/hooks` (TanStack Query / Zustand)
  → `feature/components` (presentacionales) → `screens`. Forzado por ESLint `no-restricted-imports`.
  Ver `plan.md § Dependency Rules` para matriz completa.

- **Estado del servidor**: TanStack Query v5 con `useInfiniteQuery` (listas paginadas)
  y propagación de `AbortSignal` signal-aware: `httpClient → api → repository → hook`.
  Defaults: `staleTime: 60s`, retry-una-vez para reads idempotentes.

- **Estado local**: Zustand para estado cross-feature (`favoritesStore`).
  MMKV es el boundary de persistencia — solo `MMKVFavoritesRepository` lee/escribe.

- **Theming**: paletas light + dark (`tokens.ts` espejado en ambos temas), override en runtime
  vía `ThemeOverrideProvider`. Tema del sistema + `ThemeToggleButton` manual, ambos honrados.
  Override manual persiste en MMKV.

- **Animaciones**: solo `react-native-reanimated` v3 — sin API `Animated`.
  `FavoriteButton` usa `useSharedValue` + `withSpring` (scale 1 → 1.2 → 1).

- **Imágenes**: `@d11/react-native-fast-image` en lugar de `react-native-fast-image`
  (mainline sin mantenimiento en RN 0.81). Ver `plan.md` Art. IX §2 para el workaround
  de dedupe de `androidsvg`.

- **Alias `@/*` → `src/*`**: funciona a nivel TypeScript (`tsconfig.json` paths),
  Metro (`babel-plugin-module-resolver`), y Jest (`moduleNameMapper`).
  Drift entre las tres capas = error runtime `Unable to resolve module @/...`.
  El orden de plugins de babel importa: `module-resolver` **antes** de `react-native-reanimated/plugin`.

- **Pin de codegen**: `react-native-screens` pineado a **4.15.0 exact**. 4.16+ trae
  `SearchBarNativeComponent.ts` cuya sintaxis de comandos `ElementRef<>` rompe el parser
  de codegen en RN 0.81. No bumpear sin verificar codegen contra
  `@react-native/codegen` de esta versión de RN.

- **Native module (Phase 9 bonus)**: módulo Kotlin `com.topazproducts.nativecurrency`
  expone `format(amount, currencyCode, locale)` vía `@ReactMethod` + `Promise`.
  Usa `java.text.NumberFormat` (API nativa Android, ICU del sistema).
  Wrapper JS detecta `Platform.OS === 'android'` + módulo registrado → llama
  nativo; cualquier otra condición (iOS, ausencia, error) cae a `Intl.NumberFormat`.
  iOS sin Swift module — `formatCurrency()` sync sigue siendo el path default.
  Demo de uso en `ProductDetailScreen` con selector currency + rates ficticios
  (ver sección *Bonus Features*).

- **Manejo de errores**: taxonomía `AppError` en `src/api/errors.ts` cubre `network` /
  `timeout` / `abort` / `http` / `parse` / `unknown`. `httpClient` mapea fallos de fetch
  a errores tipados; los repositorios propagan; los hooks exponen en el campo `error`;
  las screens renderizan `ErrorState` + `RetryButton` (llama a `query.refetch()`).
  `ErrorBoundary` de raíz captura excepciones del árbol de render con botón **Reset**.

- **Budget de performance** (de `plan.md § Performance Spec`):
  TTI ≤ 1.5s en device mid-tier; APK ≤ 25MB; imágenes de arranque ≤ 300KB.
  `ProductCard`/`FavoriteListItem` envueltos en `React.memo` con equality fn per-field.
  Lista del catálogo usa `FlatList` con `getItemLayout` para alturas estables.

- **Accesibilidad**: cada superficie interactiva tiene `accessibilityRole`, `accessibilityLabel`,
  y (donde hay estado) `accessibilityState`. Touch targets ≥ 44×44 (excepción: chips 40 por decisión visual).
  Los cambios de estado nunca se transmiten solo por color — siempre acompañados de icono, glyph o label.

---

## Build de producción

```sh
# Android (requiere Android SDK + JDK 17 + ANDROID_HOME / ANDROID_SDK_ROOT)
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk

# iOS (requiere Xcode 16+, CocoaPods, Ruby + Bundler, `bundle exec pod install` primero)
cd ios && xcodebuild \
  -workspace topazProducts.xcworkspace \
  -scheme topazProducts \
  -configuration Debug \
  -derivedDataPath build
# Output: ios/build/Build/Products/Debug-iphonesimulator/topazProducts.app
```

> **Nota**: en Phase 8 (v0.0.1) estos binarios no se han producido — el entorno de
> desarrollo (Linux + Hyprland) no tiene Android Studio ni Xcode instalados.
> Comandos documentados para uso en máquina macOS/Linux con los SDKs respectivos.

---

## Tradeoffs conocidos

- **Sin matriz de build en CI**: solo corren checks JS en GitHub Actions (`.github/workflows/ci.yml`).
  Builds Android/iOS requieren SDKs no presentes en el runner linux de CI. Migrar a matriz
  completa requeriría runners macOS (tier de pago).

- **`react-native-screens` pineado a 4.15.0 exact**: requerido por codegen de RN 0.81 (ver arriba).
  Se renuncia a mejoras recientes del search-bar hasta que `@react-native/codegen` para nuestra
  versión de RN maneje la sintaxis de comandos `ElementRef` de `SearchBarNativeComponent`.

- **Sin backend propio**: el catálogo es read-only contra el endpoint público de DummyJSON.
  Sin mutaciones, sin caché más allá del in-memory + persistence-omitted de TanStack Query.

- **Favoritos solo locales**: persistencia MMKV, nunca sincronizados. Pill "Synced locally"
  (Phase 10) reemplaza el copy antiguo "Synced with AsyncStorage" (FAV-001 requiere MMKV).

- **Sin backdrop-blur**: módulos nativos de blur (`@react-native-community/blur`) añaden riesgo
  de codegen al final del ciclo. El header de Favorites usa translucencia `rgba(...,0.85)` —
  ~80% de fidelidad al diseño. Ver Phase 10 para detalle.

- **Sin tests E2E**: solo unit/integration MUST-level (4 archivos según
  `plan.md § Testing Strategy v2` + añadidos Phase 7 v2). Sin Detox/Maestro.

- **Sin screenshots en repo**: `docs/screenshots/` queda creado (con README) en
  Phase 10; los PNG (T-1045..T-1047) requieren emulador y quedan como tarea
  diferida explícita en `tasks.md`.

- **Verificación manual de dark-mode**: T-203 (Phase 8) se verifica solo por code review —
  sin corrida en emulador logueada. El toggle está cableado vía `useThemeOverride` y
  `ThemeProvider` (Phase 4) y refleja de forma síncrona; smoke test pendiente del primer build.

---

## Dónde mirar

| Quiero...                              | Archivo / Carpeta |
|----------------------------------------|-------------------|
| Cambiar paleta / spacing / radius       | `src/theme/tokens.ts`, `src/theme/{lightTheme,darkTheme}.ts` |
| Añadir una screen nueva                 | `src/features/<feature>/screens/` + registrar en `src/navigation/` |
| Cablear un endpoint HTTP nuevo          | `src/api/httpClient.ts`, `src/features/<feature>/api/`, luego mapper + repo |
| Añadir un primitivo UI compartido      | `src/components/` |
| Añadir un util nuevo                    | `src/utils/` (+ test en `__tests__/` al lado) |
| Modificar UX de errores                 | `src/components/{ErrorState,RetryButton}.tsx`, `src/api/errors.ts` |
| Rastrear un bug por las capas           | `src/domain/*` → `src/features/*/repository/*` → `src/features/*/hooks/*` → `src/features/*/components/*` |
| Usar / extender el módulo nativo Kotlin | `src/utils/nativeCurrencyFormatter.ts`, `android/app/src/main/java/com/topazproducts/nativecurrency/` |

---

## Bonus Features

### NativeCurrencyFormatter (Phase 9, opcional)

Wrapper de formateo de moneda con módulo nativo **Android (Kotlin)** y fallback
a `Intl.NumberFormat` para iOS / mock / errores.

- **Módulo nativo**: `android/app/src/main/java/com/topazproducts/nativecurrency/`
  - `NativeCurrencyFormatterModule.kt` — `ReactContextBaseJavaModule`. Método
    `@ReactMethod fun format(amount: Double, currencyCode: String, locale: String, promise: Promise)`
    usando `java.text.NumberFormat.getCurrencyInstance(Locale.forLanguageTag(locale))`.
  - `NativeCurrencyFormatterPackage.kt` — `ReactPackage` registrado en
    `MainApplication.kt` vía `add(NativeCurrencyFormatterPackage())`.
- **Wrapper TS**: `src/utils/nativeCurrencyFormatter.ts`
  - `formatCurrencyNative(amount, currency?, locale?)` — async, detecta
    `NativeModules.NativeCurrencyFormatter`. Si está disponible y `Platform.OS === 'android'`,
    llama al módulo nativo. Cualquier error / ausencia / plataforma no-Android → fallback
    a `Intl.NumberFormat` (mismo algoritmo que `formatCurrency`).
  - `isNativeCurrencyFormatterAvailable()` — feature flag para UIs que quieran
    mostrar "formato nativo" o esconder trabajo async.
- **Tests**: `src/utils/__tests__/nativeCurrencyFormatter.test.ts` — 7 casos
  (fallback Intl, native success, native rejected, iOS bypass, NaN guard, feature flag).

### Demo currency selector (ProductDetailScreen)

Como parte del bonus, `ProductDetailScreen` ahora incluye un **selector visual**
de currency (`USD | EUR | ARS | JPY`) que permite ver el módulo nativo en
acción con currencies no-USD.

- **Hook**: `src/utils/useFormattedPrice.ts` — wrapper sobre el wrapper nativo
  con cache Map module-level. Cache hit → render sync (sin flicker). Cache miss →
  fallback sync mientras se hace fetch async al módulo nativo.
- **Conversion**: `src/utils/currencyConversion.ts` — rates **ficticios** hardcoded
  (`USD=1.0`, `EUR=0.93`, `ARS=1000`, `JPY=150`) para demostrar conversión
  visible en el demo. **NO son rates de mercado reales**. Disclaimer visible
  en el badge: `"1 USD = 1000 ARS · via native · Demo rates — not real-time"`.
- **Tests**: `src/utils/__tests__/currencyConversion.test.ts` (5 casos conversion
  + 4 casos locale) + `src/utils/__tests__/useFormattedPrice.test.ts` (4 casos).

#### Limitaciones del demo

- Rates hardcoded se desactualizan al instante. Para rates reales habría que
  integrar una API externa (`frankfurter.app`, `exchangerate.host`, etc.) con
  fetch + cache — fuera del scope de Phase 9.
- El selector solo afecta `ProductDetailScreen`. `ProductCard` (lista de
  productos) y `FavoriteListItem` siguen mostrando USD sin conversión.
- `ProductDetailScreen` no estaba en el scope original de Phase 9 — fue
  agregado después para poder demostrar el módulo nativo en uso real.

#### Por qué **solo Android (Kotlin)**

iOS no está cubierto porque `Phase 9` fue declarada bonus opcional y el scope
se acotó a Kotlin. El wrapper TS sigue funcionando idéntico en iOS — simplemente
cae a `Intl.NumberFormat` sin pasar por bridge nativo. `formatCurrency()` (sync,
en `src/utils/currency.ts`) sigue siendo el path usado por los 3 call sites
actuales (`ProductCard`, `ProductDetailScreen`, `FavoriteListItem`).

> ⚠️ En `ProductDetailScreen` ahora hay una **excepción**: el precio principal
> y el strike price usan `useFormattedPrice` (async, soporta nativo). El
> formatter sync `formatCurrency()` se mantiene para los labels de accesibilidad
> (`a11yLabel` en ProductCard y FavoriteListItem).

#### Por qué **opt-in async** y no refactor de `formatCurrency`

`formatCurrency` es **síncrono** y se llama en render JSX directo. Cambiarlo a
async obligaría a los 3 consumidores a manejar estado (`useState` + `useEffect`),
lo que duplicaría renders y complicaría la lógica de accesibilidad. `Intl`
en JS ya es rápido para el dataset del catálogo (~30 productos visibles a la
vez). El wrapper async se reserva para futuros casos donde el formato nativo
aporte valor medible (listas muy largas, animaciones, etc.).

#### Output examples (conversión ficticia, `product.price = 8.94` USD)

| Currency | Locale | Native (Kotlin `NumberFormat`) | Fallback (Intl) |
|----------|--------|-------------------------------|-----------------|
| USD      | en-US  | `$8.94`                       | `$8.94`         |
| EUR      | en-US  | `€8.31`                       | `€8.31`         |
| ARS      | es-AR  | `AR$ 8.940,00`                | `AR$ 8.940,00`  |
| JPY      | ja-JP  | `¥1,341`                      | `¥1,341`        |

En este demo ambos paths producen **output idéntico** (mismo ICU backend). El
native module tiene valor demostrativo: prueba que el bridge JS↔Kotlin funciona
end-to-end y la integración con `MainApplication.kt` está bien registrada.

#### Cómo extender el módulo

**Agregar nueva currency** (ej: BRL, MXN):
1. `src/utils/currencyConversion.ts` → agregar entry en `DEMO_RATES_FROM_USD`.
2. `ProductDetailScreen.tsx` `CURRENCY_OPTIONS` → agregar el code al array.
3. Si locale custom → `getCurrencyLocale()` agregar case correspondiente.
4. (Opcional) Actualizar la tabla de outputs arriba.

**Agregar nuevo método nativo** (ej: `parseCurrency(string) → Promise<number>`):
1. Agregar `@ReactMethod` en `NativeCurrencyFormatterModule.kt` con su `Promise`.
2. Rebuild APK (`./gradlew assembleDebug`).
3. Tipar el método en `src/utils/nativeCurrencyFormatter.ts` (interface `NativeCurrencyFormatter`).
4. Exportar wrapper function con fallback correspondiente (mismo patrón que `formatCurrencyNative`).

**Migrar a TurboModule** (RN new arch — out of scope Phase 9):
- `codegenConfig` en `package.json` + `@react-native/codegen`.
- Spec TS en `src/specs/NativeCurrencyFormatter.ts` (interface tipada para codegen).
- Bridge pasa de JSON serializer a JSI — llamadas **síncronas** posibles, 10-100x más rápidas.
- Trade-off: requiere `newArchEnabled=true`, más boilerplate, debugging más complejo.

#### API del módulo nativo

```kotlin
// Kotlin signature
@ReactMethod
fun format(amount: Double, currencyCode: String, locale: String, promise: Promise)
```

- `amount` NaN/Infinity → formatea `0` (consistente con `formatCurrency` JS).
- `currencyCode` inválido → `promise.reject("E_FORMAT", ...)`.
- `locale` blank → fallback a `Locale.US`.

---

## Licencia

Privado. Sin licencia otorgada.
