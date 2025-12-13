# Developer Guide

This document explains the internal architecture of the `country-atlas` package. It serves as "proof" of the engineering rigor and automated pipelines used to build this dataset.

## 🏗️ Architecture Overview

The project is structured as an ETL (Extract, Transform, Load) pipeline that produces a static, type-safe dataset.

```mermaid
graph TD
    A[Raw Data Sources] -->|scripts/fetch.ts| B(Raw JSON)
    C[SVG Flags] -->|scripts/fetch-flags.ts| D(Raw SVGs)
    D -->|scripts/optimize-flags.ts| E(Optimized SVGs)
    B -->|scripts/normalize.ts| F{Normalization Engine}
    E -->|Embed| F
    F -->|Minify & Split| G[Normalized JSONs]
    G -->|Build (tsup)| H[Distributable Bundle]
```

## 🔧 ETL Pipeline (`scripts/`)

The core logic resides in the `scripts/` directory. These scripts are strictly typed with TypeScript.

### 1. Extraction (`fetch.ts`, `fetch-flags.ts`)
- Downloads authoritative data from `mledoze/countries` (ISO standards, currencies, languages).
- Downloads vector flags from `lipis/flag-icons`.

### 2. Optimization (`optimize-flags.ts`)
- Uses `svgo` to aggressively compress SVG flags.
- **Techniques:**
    - Strips metadata and comments.
    - Rounds path precision to 2 decimals.
    - Standardizes `viewBox`.
- **Result:** ~50% reduction in flag size compared to raw.

### 3. Transformation (`normalize.ts`)
- Maps raw data to the strict `Country` interface defined in `src/types/`.
- **Data Cleaning:**
    - Rounds geo-coordinates to 4 decimal places (~11m precision).
    - Strips empty fields (`null`, `""`, `[]`) to minimize JSON size.
- **Embedding:** Reads optimized SVGs and embeds them inline into the JSON.
- **Splitting:** Generates region-specific files (`asia.json`, `europe.json`) for tree-shaking.

## 🧪 Testing Strategy

We use `Vitest` to ensure data integrity.

- **Schema Validation:** Every single generated country object is validated against the `Country` TypeScript interface.
- **API Tests:** Verify that lookup functions (`getCountryByISO2`) behave correctly (case-insensitivity, error handling).
- **Flag Integrity:** checks that every embedded string is a valid SVG.

## 📦 Build System

- **Tool:** `tsup` (esbuild-based).
- **Output:**
    - `dist/index.js` (CJS) - Legacy Node.js support.
    - `dist/index.mjs` (ESM) - Modern bundlers (Vite, Webpack).
    - `dist/index.d.ts` (Types) - Full TypeScript support.
