# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This is a monorepo managed with [pnpm](https://pnpm.io/). To get started with the project, run `pnpm install` in the root directory to install the required dependencies for each package:

```sh
pnpm install
```

### Building packages

To build all packages:

```sh
pnpm build
```

To build a specific package:

```sh
pnpm build:core
pnpm build:web
pnpm build:react-native
pnpm build:react-native-web
```

### Running in development mode

To run all packages in watch mode:

```sh
pnpm dev
```

### Type checking and linting

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
pnpm typecheck
pnpm lint
```

To fix formatting errors, run the following:

```sh
pnpm lint --fix
```

### Running tests

We use [Vitest](https://vitest.dev/) for testing. Run the unit tests by:

```sh
pnpm test
```

To run tests in watch mode:

```sh
pnpm test:watch
```

To run tests with coverage:

```sh
pnpm test:coverage
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Vitest](https://vitest.dev/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Publishing to npm

We use [Changesets](https://github.com/changesets/changesets) for versioning and publishing packages. The release process is automated via GitHub Actions.

To create a changeset for your changes:

```sh
pnpm changeset
```

This will prompt you to select which packages have changed and what type of version bump is needed.

### Scripts

The `package.json` file contains various scripts for common tasks:

- `pnpm build`: build all packages.
- `pnpm dev`: run all packages in watch mode.
- `pnpm typecheck`: type-check files with TypeScript.
- `pnpm lint`: lint files with ESLint.
- `pnpm test`: run unit tests with Vitest.
- `pnpm test:watch`: run tests in watch mode.
- `pnpm test:coverage`: run tests with coverage reporting.
- `pnpm clean`: clean all build artifacts and node_modules.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
