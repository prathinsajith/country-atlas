# 🏁 How to Build the Flag Folder

## Quick Answer

```bash
npm run fetch:flags
```

That's it! This command downloads all 250+ flag SVG files from the official [lipis/flag-icons](https://github.com/lipis/flag-icons) repository.

---

## Why Are Flags Not in Git?

The `data/flags/` folder is in `.gitignore` because:

✅ **Keeps repo small** - 250 SVG files would add ~2MB to Git history  
✅ **Reproducible** - Flags can be downloaded anytime from official source  
✅ **No version tracking needed** - Flag designs rarely change  
✅ **End users unaffected** - npm package includes flags when published

---

## Complete Build Process

### For Contributors (First Time Setup)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/country-atlas.git
cd country-atlas

# 2. Install dependencies
npm install

# 3. Fetch flags (REQUIRED - folder is empty from Git)
npm run fetch:flags

# 4. Build the project
npm run build

# 5. Run tests
npm test
```

### Available Scripts

| Command                  | What It Does                                             |
| ------------------------ | -------------------------------------------------------- |
| `npm run fetch:flags`    | Downloads raw SVG flags to `data/flags/raw/`             |
| `npm run optimize:flags` | Compresses SVGs to `data/flags/optimized/` (50% smaller) |
| `npm run fetch:data`     | Downloads raw country data from mledoze/countries        |
| `npm run normalize`      | Generates normalized JSON files with embedded flags      |
| `npm run setup`          | **Runs entire ETL pipeline** (all of the above)          |
| `npm run build`          | Builds the distributable npm package                     |
| `npm test`               | Runs all 157 tests                                       |

---

## The Two-Step Flag Build Process

### Step 1: Fetch Raw Flags

```bash
npm run fetch:flags
```

**What happens:**

- Reads country ISO codes from `data/normalized/countries.json`
- Downloads SVG for each country from `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/{code}.svg`
- Saves to `data/flags/raw/us.svg`, `data/flags/raw/gb.svg`, etc.

**Output:** ~250 raw SVG files (~2MB total)

### Step 2: Optimize Flags

```bash
npm run optimize:flags
```

**What happens:**

- Reads all SVGs from `data/flags/raw/`
- Compresses using SVGO with aggressive settings:
    - Strips metadata and comments
    - Rounds path precision to 2 decimals
    - Removes width/height attributes
    - Keeps viewBox for proper scaling
- Saves to `data/flags/optimized/`

**Output:** ~250 optimized SVG files (~1MB total, 50% reduction)

---

## Full ETL Pipeline

```bash
npm run setup
```

This runs the complete Extract-Transform-Load pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. fetch:data                                               │
│    ↓ Downloads country data from mledoze/countries         │
│    → data/raw/mledoze.json                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. fetch:flags                                              │
│    ↓ Downloads 250+ flag SVGs from lipis/flag-icons        │
│    → data/flags/raw/*.svg                                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. optimize:flags                                           │
│    ↓ Compresses SVGs with SVGO (50% size reduction)        │
│    → data/flags/optimized/*.svg                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. normalize                                                │
│    ↓ Transforms raw data to Country interface              │
│    ↓ Embeds optimized flag SVGs into JSON                  │
│    ↓ Splits by region for tree-shaking                     │
│    → data/normalized/countries.json                         │
│    → data/normalized/asia.json                              │
│    → data/normalized/europe.json                            │
│    → data/normalized/africa.json                            │
│    → data/normalized/americas.json                          │
│    → data/normalized/oceania.json                           │
│    → data/normalized/antarctic.json                         │
└─────────────────────────────────────────────────────────────┘
```

---

## What Gets Published to npm?

When you run `npm publish`, only the `dist/` folder is included:

```json
{
    "files": ["dist"]
}
```

The build process (`npm run build`) bundles everything:

- ✅ Type definitions (`.d.ts`)
- ✅ Compiled JavaScript (CJS and ESM)
- ✅ Embedded flag SVG data (already in normalized JSON)

**End users get:**

- All 250 countries with embedded flag SVGs
- No need to fetch flags separately
- Package size: ~2.1 MB compressed, 7.0 MB unpacked

---

## Troubleshooting

### "Flag folder is empty!"

```bash
npm run fetch:flags
```

### "optimize:flags fails"

Make sure raw flags exist first:

```bash
npm run fetch:flags
npm run optimize:flags
```

### "Build fails - missing flag data"

Run the full setup:

```bash
npm run setup
npm run build
```

### "Tests fail"

Ensure data is normalized:

```bash
npm run normalize
npm test
```

---

## For CI/CD Pipelines

Add to your GitHub Actions / CI workflow:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
      node-version: '20'

- name: Install dependencies
  run: npm ci

- name: Fetch flags
  run: npm run fetch:flags

- name: Build
  run: npm run build

- name: Test
  run: npm test
```

---

## Summary

| Scenario                    | Command                                       |
| --------------------------- | --------------------------------------------- |
| **First time contributor**  | `npm install && npm run fetch:flags`          |
| **Just need flags**         | `npm run fetch:flags`                         |
| **Optimize existing flags** | `npm run optimize:flags`                      |
| **Regenerate all data**     | `npm run setup`                               |
| **Build for npm**           | `npm run build`                               |
| **End user**                | `npm install country-atlas` (flags included!) |

The flag folder is intentionally excluded from Git, but the build process ensures flags are always available when needed! 🚀
