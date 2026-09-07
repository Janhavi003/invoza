'use client';

import type { InvoiceData } from '@/types/invoice';
import { calculateInvoice } from '@/lib/calculations';
import { formatMoney } from '@/config/currencies';

type Props = { data: InvoiceData; compact?: boolean };

/**
 * The invoice is deliberately rendered as normal HTML rather than a screenshot.
 * This keeps the editor preview faithful to the selectable-text PDF output.
 */
export function InvoicePreview({ data, compact = false }: Props) {
  const totals = calculateInvoice(data);
  const accent = data.accentColor || '#635bff';
  const template = data.template || 'minimal';
  const dark = template === 'bold';
  const muted = dark ? 'invoice-muted text-white/60' : 'invoice-muted text-gray-500';
  const rule = dark ? 'border-white/15' : 'invoice-rule border-gray-200';
  const size = compact ? 'w-[595px] min-h-[842px] p-7 text-[8px] leading-[1.55]' : 'w-full max-w-[794px] min-h-[1123px] p-7 sm:p-10 text-[11px] leading-5';

  return <div
    className={`invoice-paper template-${template} paper relative mx-auto ${size} ${dark ? 'text-white' : 'text-gray-900'}`}
    style={{ fontFamily: data.font, background: dark ? '#15131a' : '#fff', '--invoice-accent': accent } as React.CSSProperties}
  >
    <div className="invoice-accent" style={{ background: accent }} />

    <header className="relative pt-4">
      <div className="flex justify-between gap-8">
        <div className="min-w-0 flex-1">
          {data.business.logo && <img src={data.business.logo} alt="Business logo" className="mb-3 h-10 max-w-28 object-contain object-left" />}
          <div className="text-[1.7em] font-bold tracking-[-.045em]">{data.business.name || 'Your Business'}</div>
          {data.business.company && <div className="font-medium">{data.business.company}</div>}
          <div className={`whitespace-pre-line break-words ${muted}`}>{data.business.address || 'Business address'}</div>
          <div className="break-words">{data.business.email || 'email@example.com'}{data.business.phone && ` · ${data.business.phone}`}</div>
          {data.business.website && <div className="break-words">{data.business.website}</div>}
          {data.business.gstin && <div>GSTIN: {data.business.gstin}</div>}
        </div>
        <div className="w-[185px] shrink-0 text-right">
          <div className={`invoice-kicker text-[.8em] font-bold uppercase tracking-[.22em]`}>{template.toUpperCase()}</div>
          <div className="mt-1 text-[1.65em] font-semibold break-words">{data.invoiceNumber || 'INV-0001'}</div>
          <div className={`mt-3 ${muted}`}>Issue {data.issueDate}</div>
          <div className={muted}>Due {data.dueDate}</div>
        </div>
      </div>

      <div className={`my-6 grid grid-cols-2 gap-8 border-y ${rule} py-5`}>
        <div className="min-w-0">
          <div className={`text-[.8em] uppercase tracking-[.2em] ${muted}`}>Bill to</div>
          <div className="mt-1 font-semibold break-words">{data.client.name || 'Client name'}</div>
          {data.client.company && <div className="break-words">{data.client.company}</div>}
          <div className={`whitespace-pre-line break-words ${muted}`}>{data.client.address}</div>
          <div className="break-words">{data.client.email}</div>
          {data.client.gstin && <div className="break-words">GST/VAT/GST ID: {data.client.gstin}</div>}
        </div>
        <div className="min-w-0">
          <div className={`text-[.8em] uppercase tracking-[.2em] ${muted}`}>Payment terms</div>
          <div className="mt-1 break-words">{data.paymentTerms || 'Due on receipt'}</div>
          {data.placeOfSupply && <div className={`mt-2 break-words ${muted}`}>Place of supply: {data.placeOfSupply}</div>}
        </div>
      </div>

      <div className={`invoice-card overflow-hidden rounded-[inherit] ${template === 'modern' ? 'p-2' : ''}`}>
        <table className="w-full table-fixed border-collapse">
          <colgroup><col/><col style={{ width:'52px' }}/><col style={{ width:'90px' }}/><col style={{ width:'100px' }}/></colgroup>
          <thead><tr className={`border-b-2 ${rule}`} style={{ borderColor: accent }}>
            <th className="px-2 py-2 text-left">Description</th><th className="px-1 py-2 text-right">Qty</th><th className="px-1 py-2 text-right">Rate</th><th className="px-1 py-2 text-right">Amount</th>
          </tr></thead>
          <tbody>{data.items.map(item => <tr key={item.id} className={`border-b ${rule} align-top`}>
            <td className="max-w-0 px-2 py-3 pr-4 break-words"><div>{item.description || 'Service'}</div>{item.hsnSac && <div className={`text-[.8em] ${muted}`}>HSN/SAC {item.hsnSac}</div>}</td>
            <td className="px-1 py-3 text-right break-words">{item.quantity || '0'}</td>
            <td className="px-1 py-3 text-right break-words">{formatMoney(item.rate, data.currency)}</td>
            <td className="px-1 py-3 text-right break-words">{formatMoney((Number(item.quantity) || 0) * (Number(item.rate) || 0), data.currency)}</td>
          </tr>)}</tbody>
        </table>
      </div>

      <div className={`invoice-total mt-7 ml-auto w-full max-w-[300px] space-y-2 ${template === 'modern' || template === 'creative' ? 'invoice-card rounded-xl bg-gray-50 p-4' : ''}`}>
        {([['Subtotal', totals.subtotal], ['Discount', totals.discount], ['Tax', totals.tax]] as const).map(([label, value]) => <div key={label} className={`flex justify-between ${dark ? 'text-white/70' : 'text-gray-600'}`}><span>{label}</span><span>{formatMoney(value, data.currency)}</span></div>)}
        <div className="flex justify-between border-t pt-3 text-base font-bold" style={{ borderColor: dark ? '#ffffff33' : '#d1d5db' }}><span>Total</span><span>{formatMoney(totals.total, data.currency)}</span></div>
        {Number(totals.amountPaid) > 0 && <div className="flex justify-between"><span>Paid</span><span>{formatMoney(totals.amountPaid, data.currency)}</span></div>}
        <div className="flex justify-between font-semibold" style={{ color: accent }}><span>Balance due</span><span>{formatMoney(totals.balanceDue, data.currency)}</span></div>
      </div>

      <div className={`mt-9 grid grid-cols-2 gap-8 border-t ${rule} pt-5`}>
        <div className="min-w-0"><div className="font-semibold">Payment</div><div className={`whitespace-pre-line break-words ${muted}`}>{data.payment.instructions || data.payment.method}</div>{data.payment.upiId && <div className="mt-1 break-words">UPI: {data.payment.upiId}</div>}</div>
        <div className="min-w-0"><div className="font-semibold">Notes</div><div className={`whitespace-pre-line break-words ${muted}`}>{data.notes || data.thankYou || 'Thank you for your business.'}</div></div>
      </div>
      <div className={`mt-10 border-t ${rule} pt-4 text-center text-[.82em] ${muted}`}>{data.footer || 'Thank you for your business.'}</div>
    </header>
  </div>
}
