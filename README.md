# Invoza

**Beautiful invoices. Less admin.**

Invoza is a freelancer-first invoice studio built with Next.js and TypeScript. The product is intentionally small: enter the work, style the document, preview the A4 page, and export a real PDF.

## What was improved

- Redesigned landing page with a distinctive editorial + product-studio visual system instead of a generic SaaS layout.
- Refined invoice cockpit with a calmer purple/ink palette, glassy navigation, better spacing, hover states, focus states, and subtle entrance animations.
- Added reduced-motion support for accessibility.
- Reworked the invoice preview into six visibly different visual directions: Minimal, Modern, Professional, Elegant, Bold, and Creative.
- Added visual template selection cards in the editor instead of a plain template dropdown.
- Kept the live preview and PDF route on the same invoice data/calculation model.
- Removed the misleading “saved client” action and replaced it with a clear local-draft note.
- Added documentation for the UI architecture and domain boundaries.

## Core features

- Anonymous invoice creation with local draft persistence.
- Split editor + live A4 preview.
- INR, USD, EUR, GBP, AUD, CAD, SGD, AED and JPY.
- Decimal-safe calculations with discounts and per-line tax.
- India-friendly GST fields and CGST/SGST/IGST modes.
- Logo upload, accent color, font, payment instructions and notes.
- Real A4 multi-page PDF generation with selectable text.
- Mobile edit/preview tabs and sticky download action.
- Reminder/share/print-ready routes and SEO-friendly public pages.

## Stack

Next.js 16 · React 19 · TypeScript · App Router · Tailwind CSS 4 · React Hook Form · Zod · React-PDF · Decimal.js · Vitest · Lucide.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validate the project

```bash
npm run lint
npm test
npm run build
```

The uploaded source archive contained a prebuilt `node_modules` directory with a missing Rollup optional native dependency. For a clean environment, always install dependencies from `package-lock.json` with `npm install` rather than shipping `node_modules` in the project archive.

## Project structure

- `src/app` — routes, metadata, sitemap and PDF API route.
- `src/components/InvoiceEditor.tsx` — interactive invoice authoring workflow.
- `src/components/InvoicePreview.tsx` — HTML/A4 visual renderer shared by the landing page and editor.
- `src/lib/calculations.ts` — financial calculation rules.
- `src/lib/storage.ts` — browser draft persistence.
- `src/lib/validation.ts` — input validation.
- `src/config` — currencies, fonts and template metadata.
- `src/types` — invoice domain types.
- `tests` — calculation tests.
- `docs/UI-ARCHITECTURE.md` — UI and maintainability notes.

## Design principles

1. **Document first:** the invoice remains the visual hero, not the form.
2. **Fast feedback:** editing and previewing happen in the same mental loop.
3. **Quiet UI:** controls use hierarchy and spacing rather than heavy chrome.
4. **Real output:** the preview is HTML and the download is a real PDF, not an image.
5. **Safe financial logic:** calculation behavior stays isolated from presentation code.
6. **Accessible motion:** animations are subtle and automatically reduced when the user prefers reduced motion.

## Environment

No environment variables are required for the MVP. See `.env.example` for the placeholder configuration.

## License

MIT
