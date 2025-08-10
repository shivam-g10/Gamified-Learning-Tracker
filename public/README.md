# Public Assets

This directory contains static assets that are served directly by Next.js.

## Required Files

- `favicon.ico` - Website favicon (16x16, 32x32, or 48x48 pixels)
- `robots.txt` - Generated automatically by Next.js from `src/app/robots.ts`
- `sitemap.xml` - Generated automatically by Next.js from `src/app/sitemap.ts`
- `manifest.json` - Static PWA manifest file

## Well-Known Files

The following well-known files are served from `public/.well-known/`:
- `/.well-known/security.txt` - Security policy information

## Note

Next.js automatically generates the following files from the corresponding TypeScript files:
- `/robots.txt` from `src/app/robots.ts`
- `/sitemap.xml` from `src/app/sitemap.ts`

Static files in the `public` directory (including `.well-known/*` and `manifest.json`) are served directly without processing.
