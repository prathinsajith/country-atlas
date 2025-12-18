# Contributing to Country Atlas

Thank you for your interest in contributing! We welcome contributions from everyone to help make this package the best country data resource for developers.

## How to Contribute

### Reporting Bugs

- Use the GitHub Issue Tracker to report bugs.
- Include clear steps to reproduce the issue.
- Mention your environment (Node.js version, OS).

### Suggesting Data Updates

- If you find a mistake in the data (e.g., a misspelled capital or wrong currency), please open an issue or a PR.
- Data is stored in `data/raw/mledoze.json` and then normalized using `npm run normalize`.

### Code Contributions

1. Fork the repository.
2. Create a new branch: `git checkout -b feat/your-feature`.
3. Make your changes and ensure tests pass: `npm test`.
4. Run linting: `npm run lint`.
5. Open a Pull Request with a clear description of your changes.

## Development Setup

\`\`\`bash
npm install
npm run normalize # To rebuild optimized data
npm test # To run all tests
npm run dev # To start CLI in watch mode
\`\`\`

## Quality Standards

- We use **Husky** for Git hooks to ensure formatting on every commit.
- All public functions must have **JSDoc** documentation.
- New features should include unit tests in `tests/`.

---

Happy coding!
