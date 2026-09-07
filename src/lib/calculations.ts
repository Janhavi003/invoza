import Decimal from "decimal.js";
import type { InvoiceData, Totals } from "@/types/invoice";

function D(value: string | number | undefined | null): Decimal {
  try {
    if (value === undefined || value === null || value === "") return new Decimal(0);
    const parsed = new Decimal(value);
    return parsed.isFinite() ? parsed : new Decimal(0);
  } catch {
    return new Decimal(0);
  }
}

function nonNegative(value: Decimal): Decimal {
  return value.isNegative() ? new Decimal(0) : value;
}

function clamp(value: Decimal, min: Decimal, max: Decimal): Decimal {
  if (value.lessThan(min)) return min;
  if (value.greaterThan(max)) return max;
  return value;
}

export function calculateInvoice(
  data: Pick<
    InvoiceData,
    "items" | "discount" | "taxKind" | "taxRate" | "gstMode" | "amountPaid"
  >,
): Totals {
  let subtotal = new Decimal(0);
  let perLineTax = new Decimal(0);

  for (const item of data.items) {
    const quantity = nonNegative(D(item.quantity));
    const rate = nonNegative(D(item.rate));
    const base = quantity.mul(rate);

    subtotal = subtotal.add(base);
    perLineTax = perLineTax.add(
      base.mul(nonNegative(D(item.taxRate))).div(100),
    );
  }

  const discount = clamp(
    nonNegative(D(data.discount)),
    new Decimal(0),
    subtotal,
  );
  const taxable = subtotal.sub(discount);

  let tax = perLineTax;
  const taxRate = nonNegative(D(data.taxRate));

  if (data.taxKind !== "none" && taxRate.greaterThan(0)) {
    tax = tax.add(taxable.mul(taxRate).div(100));
  }

  const total = taxable.add(tax);
  const amountPaid = clamp(
    nonNegative(D(data.amountPaid)),
    new Decimal(0),
    total,
  );

  const out = (value: Decimal) => value.toDecimalPlaces(2).toFixed(2);

  return {
    subtotal: out(subtotal),
    discount: out(discount),
    tax: out(tax),
    total: out(total),
    amountPaid: out(amountPaid),
    balanceDue: out(total.sub(amountPaid)),
  };
}
