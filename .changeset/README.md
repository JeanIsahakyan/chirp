# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versions and changelogs.

## Adding a Changeset

When you make changes that should be released, run:

```bash
pnpm changeset
```

This will prompt you to:
1. Select which packages have changed
2. Choose the type of change (major, minor, patch)
3. Write a summary of the changes

## Releasing

To release all pending changesets:

```bash
pnpm version    # Updates versions and changelogs
pnpm release    # Builds and publishes to npm
```

## Version Types

- **major**: Breaking changes
- **minor**: New features (backwards compatible)
- **patch**: Bug fixes (backwards compatible)
