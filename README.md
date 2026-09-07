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


