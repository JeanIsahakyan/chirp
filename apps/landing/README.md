# Aspectly Landing Page

A modern, responsive landing page for the Aspectly communication bridge framework.

## Features

- Built with React + TypeScript + Vite
- Styled with Tailwind CSS v4
- Animated with Framer Motion and Magic UI components
- Syntax highlighting with react-syntax-highlighter
- Optimized for GitHub Pages deployment

## Development

From the monorepo root:

```bash
# Install all dependencies
pnpm install

# Start development server
pnpm --filter aspectly-landing dev

# Build for production
pnpm build:landing

# Preview production build
pnpm --filter aspectly-landing preview
```

## Deployment

The landing page is automatically deployed to GitHub Pages when changes are pushed to the `main` branch via the `.github/workflows/deploy-landing.yml` workflow.

### Custom Domain (.js.org)

This landing page is configured to be served from `aspectly.js.org`. To complete the setup:

1. Fork the [js.org repository](https://github.com/js-org/js.org)
2. Add `aspectly.js.org` to the `cnames_active.js` file pointing to `jeanisahakyan.github.io`
3. Submit a pull request to the js.org repository

## Project Structure

```
apps/landing/
├── public/
│   ├── CNAME              # Custom domain config
│   └── favicon.svg        # Favicon
├── src/
│   ├── components/
│   │   ├── magicui/       # Magic UI animated components
│   │   ├── sections/      # Page sections (Hero, Features, etc.)
│   │   └── ui/            # shadcn-style UI components
│   ├── lib/
│   │   └── utils.ts       # Utility functions
│   ├── App.tsx            # Main app component
│   ├── index.css          # Global styles with Tailwind
│   └── main.tsx           # Entry point
├── index.html             # HTML template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Technologies

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
