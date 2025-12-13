# How to Publish `country-atlas` to npm

Follow these steps to publish your package to the npm registry.

## Prerequisites

1.  **npm Account**: You need an account on [npmjs.com](https://www.npmjs.com/).
2.  **Login**: Authenticate in your terminal.
    ```bash
    npm login
    ```

## Publishing Steps

### 1. Update Version

Always update the version number before publishing a new release.

```bash
# Example: 1.0.0 -> 1.0.1
npm version patch

# OR specific version
npm version 1.1.0
```

### 2. Build

Ensure the artifacts are generated.

```bash
npm run build
```

### 3. Verify (Optional but Recommended)

Check what files will be uploaded.

```bash
npm pack --dry-run
```

_Make sure `dist/`, `package.json`, `README.md`, and `LICENSE` are verified._

### 4. Publish

Push the package to the registry.

```bash
npm publish
```

_Note: If your package name is scoped (e.g., `@username/country-atlas`), use `npm publish --access public`._

## Automation (Optional)

You can automate this with GitHub Actions. Create a release on GitHub, and have an Action run:

1. `npm ci`
2. `npm run build`
3. `npm publish` (using `NPM_TOKEN` secret).
