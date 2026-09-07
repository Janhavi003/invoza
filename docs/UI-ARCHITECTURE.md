# UI architecture

## Product shell

The application has two intentionally different surfaces:

- `/` is the marketing/product surface. It uses large editorial typography, a soft neutral canvas, a purple accent, restrained cards, and a live invoice example.
- `/create` is the working surface. It uses a sticky studio header, a form column, and a document preview stage.

This separation keeps the marketing experience expressive without making the editor feel like a landing page.

## Animation rules

Animations are CSS-only so the app does not need a motion runtime for basic interaction.

- Landing content enters with a short upward fade.
- The document enters the preview stage with a subtle scale/translate transition.
- Open editor sections animate their content in.
- Progress and controls use short transitions.
- `prefers-reduced-motion: reduce` disables decorative motion.

Avoid adding animation to financial values or anything that could make a document feel unstable while typing.

## Invoice rendering

`InvoicePreview` is the visual source of truth for the invoice document. It consumes `InvoiceData`, calculates totals with `calculateInvoice`, and renders semantic HTML.

Template differences are expressed through template classes rather than six duplicated components. This keeps changes to invoice content centralized while allowing each visual direction to have its own treatment.

## Maintainability

- Financial logic belongs in `src/lib/calculations.ts`.
- Persistence belongs in `src/lib/storage.ts`.
- Validation belongs in `src/lib/validation.ts`.
- Domain contracts belong in `src/types`.
- Visual configuration belongs in `src/config`.
- UI components should not contain financial formulas beyond presentation-only line totals.

## Adding a template

1. Add the template metadata in `src/config/templates.ts`.
2. Add a `template-*` selector to `src/components/InvoicePreview.tsx` only when markup needs a genuinely different structure.
3. Prefer CSS differences in `src/app/globals.css` for spacing, borders, surfaces, typography and accents.
4. Add a matching editor swatch so users can understand the visual choice before selecting it.
5. Run lint, tests and a production build.
