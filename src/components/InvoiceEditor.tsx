'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDownToLine, ChevronDown, Copy, FileText, Palette, Plus, Trash2, UserRound, Building2, ReceiptText, CreditCard, StickyNote, Sparkles, Check, Eye, PencilLine } from 'lucide-react';
import type { InvoiceData, LineItem, TaxKind, GSTMode, CurrencyCode, PaymentMethod } from '@/types/invoice';
import { calculateInvoice } from '@/lib/calculations';
import { formatMoney } from '@/config/currencies';
import { fonts, templates } from '@/config/templates';
import { InvoicePreview } from './InvoicePreview';
import { saveDraft } from '@/lib/storage';

const uid = () => Math.random().toString(36).slice(2, 9);
const initial: InvoiceData = {
  business: { name: '', company: '', email: '', phone: '', website: '', address: '', country: 'India', taxId: '', gstin: '' },
  client: { name: '', company: '', email: '', phone: '', address: '', country: 'India', taxId: '', gstin: '' },
  invoiceNumber: 'INV-2026-001', issueDate: new Date().toISOString().slice(0, 10), dueDate: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), currency: 'INR', paymentTerms: 'Net 14',
  items: [{ id: uid(), description: 'Design / development services', quantity: '1', rate: '0', taxRate: '0', hsnSac: '' }], discount: '0', taxKind: 'none', taxRate: '0', gstMode: 'none',
  payment: { method: 'Bank transfer', instructions: '', upiId: '', qrData: '' }, notes: '', thankYou: 'Thank you for your business.', footer: '', template: 'minimal', accentColor: '#3659d8', font: 'Inter', amountPaid: '0', status: 'Draft', placeOfSupply: ''
};

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string };
function Field({ label, className = '', ...props }: FieldProps) {
  return <label className="field-label"><span>{label}</span><input {...props} className={`field-input ${className}`} /></label>;
}
function TextArea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className="field-label"><span>{label}</span><textarea {...props} className="field-input min-h-24 resize-y" /></label>;
}
function SelectField({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }) {
  return <label className="field-label"><span>{label}</span><select {...props} className="field-input">{children}</select></label>;
}

const sectionMeta = [
  ['business', 'Business', 'Your details', Building2], ['client', 'Client', 'Who pays you', UserRound], ['invoice', 'Invoice', 'Dates & currency', ReceiptText], ['items', 'Items', 'What you delivered', FileText], ['tax', 'Tax & discount', 'Fine-tune totals', Sparkles], ['payment', 'Payment', 'How you get paid', CreditCard], ['notes', 'Notes', 'The finishing touch', StickyNote], ['design', 'Design', 'Make it yours', Palette]
] as const;

type SectionId = typeof sectionMeta[number][0];
function EditorSection({ id, title, hint, Icon, open, onToggle, children }: { id: SectionId; title: string; hint: string; Icon: React.ElementType; open: boolean; onToggle: (id: SectionId) => void; children: React.ReactNode }) {
  return <section className={`editor-section ${open ? 'is-open' : ''}`}>
    <button type="button" className="section-trigger focus-ring" aria-expanded={open} onClick={() => onToggle(id)}>
      <span className="section-icon"><Icon size={16} strokeWidth={1.8} /></span>
      <span className="min-w-0 flex-1 text-left"><strong>{title}</strong><small>{hint}</small></span>
      <ChevronDown size={17} className={`section-chevron ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="section-content">{children}</div>}
  </section>;
}

export function InvoiceEditor() {
  const [d, setD] = useState<InvoiceData>(initial);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const [open, setOpen] = useState<SectionId>('business');
  const [ready, setReady] = useState(false);
  const totals = useMemo(() => calculateInvoice(d), [d]);

  useEffect(() => { const raw = localStorage.getItem('invoza:draft:v1'); if (raw) try { setD(JSON.parse(raw)); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) saveDraft(d); }, [d, ready]);

  const set = (path: string, v: unknown) => setD(x => { const n = structuredClone(x) as Record<string, any>; const parts = path.split('.'); let o: any = n; parts.slice(0, -1).forEach(k => { o = o[k]; }); o[parts.at(-1)!] = v; return n as InvoiceData; });
  const setParty = (who: 'business' | 'client', key: string, value: string) => setD(x => ({ ...x, [who]: { ...x[who], [key]: value } }));
  const add = () => setD(x => ({ ...x, items: [...x.items, { id: uid(), description: '', quantity: '1', rate: '0', taxRate: '0', hsnSac: '' }] }));
  const updateItem = (id: string, key: keyof LineItem, value: string) => setD(x => ({ ...x, items: x.items.map(i => i.id === id ? { ...i, [key]: value } : i) }));

  async function download() {
    try {
      const r = await fetch('/api/pdf', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(d) });
      if (!r.ok) throw new Error();
      const blob = await r.blob(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${(d.business.name || 'Invoza').replace(/[^a-z0-9]+/gi, '-')}-Invoice-${d.invoiceNumber}.pdf`; a.click(); URL.revokeObjectURL(url);
    } catch { alert('PDF generation failed. Please try again.'); }
  }

  const toggle = (id: SectionId) => setOpen(x => x === id ? '' as SectionId : id);
  const completion = [d.business.name, d.client.name, d.invoiceNumber, d.items.some(i => i.description && Number(i.rate) > 0), d.payment.instructions || d.payment.method].filter(Boolean).length;

  return <div className="invoice-cockpit min-h-screen">
    <header className="cockpit-header">
      <div className="brand-lockup"><a href="/" className="brand-mark">invoza<span>.</span></a><div className="brand-divider" /><div className="header-context"><span>Invoice studio</span><small>Draft · saved locally</small></div></div>
      <div className="header-progress"><span>{completion}/5 essentials</span><div className="progress-track"><i style={{ width: `${completion * 20}%` }} /></div></div>
      <button type="button" onClick={download} className="download-button"><ArrowDownToLine size={16} /> <span>Download PDF</span></button>
    </header>

    <div className="mobile-tabs"><button className={tab === 'edit' ? 'active' : ''} onClick={() => setTab('edit')}><PencilLine size={15}/> Edit</button><button className={tab === 'preview' ? 'active' : ''} onClick={() => setTab('preview')}><Eye size={15}/> Preview</button></div>

    <main className="cockpit-grid">
      <aside className={`editor-pane ${tab === 'preview' ? 'mobile-hidden' : ''}`}>
        <div className="editor-intro"><div><p className="eyebrow">Build your invoice</p><h1>Make it look like you.</h1><p>Fill in the essentials. Your invoice updates as you type.</p></div><div className="speed-badge"><Sparkles size={14}/><span>~60 sec</span></div></div>
        <div className="section-stack">
          <EditorSection id="business" title="Business" hint="Your details" Icon={Building2} open={open === 'business'} onToggle={toggle}><div className="form-grid"><Field label="Business / freelancer name" value={d.business.name} onChange={e => setParty('business', 'name', e.target.value)} placeholder="Alex Morgan" autoComplete="organization"/><Field label="Email" type="email" value={d.business.email} onChange={e => setParty('business', 'email', e.target.value)} autoComplete="email"/><Field label="Phone" value={d.business.phone} onChange={e => setParty('business', 'phone', e.target.value)} autoComplete="tel"/><Field label="Website" value={d.business.website} onChange={e => setParty('business', 'website', e.target.value)}/><TextArea label="Address" value={d.business.address} onChange={e => setParty('business', 'address', e.target.value)} placeholder="Street, city, state"/><div className="form-row"><Field label="Country" value={d.business.country} onChange={e => setParty('business', 'country', e.target.value)}/><Field label="Tax ID" value={d.business.taxId} onChange={e => setParty('business', 'taxId', e.target.value)}/></div><Field label="GSTIN" value={d.business.gstin} onChange={e => setParty('business', 'gstin', e.target.value)}/><label className="field-label"><span>Logo</span><input type="file" accept="image/*" className="field-input file-input" onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 2e6) { alert('Logo must be 2MB or smaller.'); return; } const r = new FileReader(); r.onload = () => setParty('business', 'logo', String(r.result)); r.readAsDataURL(f); }}/></label></div></EditorSection>

          <EditorSection id="client" title="Client" hint="Who pays you" Icon={UserRound} open={open === 'client'} onToggle={toggle}><div className="form-grid"><Field label="Client name" value={d.client.name} onChange={e => setParty('client', 'name', e.target.value)} placeholder="Jordan Lee" autoComplete="name"/><Field label="Company" value={d.client.company} onChange={e => setParty('client', 'company', e.target.value)} autoComplete="organization"/><Field label="Email" type="email" value={d.client.email} onChange={e => setParty('client', 'email', e.target.value)} autoComplete="email"/><Field label="Phone" value={d.client.phone} onChange={e => setParty('client', 'phone', e.target.value)} autoComplete="tel"/><TextArea label="Address" value={d.client.address} onChange={e => setParty('client', 'address', e.target.value)}/><Field label="Country" value={d.client.country} onChange={e => setParty('client', 'country', e.target.value)}/><Field label="Tax / VAT / GST ID" value={d.client.gstin || d.client.taxId} onChange={e => setParty('client', 'gstin', e.target.value)}/><div className="ghost-action" role="note"><Check size={14}/> Client details stay in this draft only</div></div></EditorSection>

          <EditorSection id="invoice" title="Invoice" hint="Dates & currency" Icon={ReceiptText} open={open === 'invoice'} onToggle={toggle}><div className="form-grid"><Field label="Invoice number" value={d.invoiceNumber} onChange={e => set('invoiceNumber', e.target.value)}/><SelectField label="Currency" value={d.currency} onChange={e => set('currency', e.target.value as CurrencyCode)}>{(['INR','USD','EUR','GBP','AUD','CAD','SGD','AED','JPY'] as CurrencyCode[]).map(c => <option key={c}>{c}</option>)}</SelectField><Field label="Issue date" type="date" value={d.issueDate} onChange={e => set('issueDate', e.target.value)}/><Field label="Due date" type="date" value={d.dueDate} onChange={e => set('dueDate', e.target.value)}/><SelectField label="Payment terms" value={d.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}><option>Due on receipt</option><option>Net 7</option><option>Net 14</option><option>Net 30</option><option>Net 60</option></SelectField></div></EditorSection>

          <EditorSection id="items" title="Items" hint={`${d.items.length} line item${d.items.length === 1 ? '' : 's'}`} Icon={FileText} open={open === 'items'} onToggle={toggle}><div className="items-editor">{d.items.map((i, idx) => <div key={i.id} className="item-card"><div className="item-head"><span className="item-number">{String(idx + 1).padStart(2, '0')}</span><span className="item-label">Line item</span><div className="item-actions"><button type="button" title="Duplicate" onClick={() => setD(x => ({ ...x, items: [...x.items, { ...i, id: uid() }] }))}><Copy size={14}/></button><button type="button" title="Delete" disabled={d.items.length === 1} onClick={() => setD(x => ({ ...x, items: x.items.length > 1 ? x.items.filter(y => y.id !== i.id) : x.items }))}><Trash2 size={14}/></button></div></div><TextArea label="Description" value={i.description} onChange={e => updateItem(i.id, 'description', e.target.value)} placeholder="What did you do?" rows={2}/><div className="form-row three"><Field label="Qty" inputMode="decimal" value={i.quantity} onChange={e => updateItem(i.id, 'quantity', e.target.value)}/><Field label="Rate" inputMode="decimal" value={i.rate} onChange={e => updateItem(i.id, 'rate', e.target.value)}/><Field label="Tax %" inputMode="decimal" value={i.taxRate} onChange={e => updateItem(i.id, 'taxRate', e.target.value)}/></div><div className="item-total"><span>Line total</span><strong>{formatMoney((Number(i.quantity) || 0) * (Number(i.rate) || 0), d.currency)}</strong></div></div>)}<button type="button" onClick={add} className="add-item"><Plus size={16}/> Add another item</button></div></EditorSection>

          <EditorSection id="tax" title="Tax & discount" hint="Fine-tune totals" Icon={Sparkles} open={open === 'tax'} onToggle={toggle}><div className="form-grid"><SelectField label="Tax type" value={d.taxKind} onChange={e => set('taxKind', e.target.value as TaxKind)}><option value="none">No tax</option><option value="custom">Custom tax</option><option value="vat">VAT</option><option value="gst">GST</option><option value="sales">Sales tax</option></SelectField><Field label="Tax %" inputMode="decimal" value={d.taxRate} onChange={e => set('taxRate', e.target.value)}/><Field label="Discount" inputMode="decimal" value={d.discount} onChange={e => set('discount', e.target.value)}/><SelectField label="GST mode" value={d.gstMode} onChange={e => set('gstMode', e.target.value as GSTMode)}><option value="none">None</option><option value="cgst_sgst">CGST + SGST</option><option value="igst">IGST</option></SelectField><Field label="HSN / SAC" value={d.items[0]?.hsnSac || ''} onChange={e => d.items[0] && updateItem(d.items[0].id, 'hsnSac', e.target.value)}/><Field label="Place of supply" value={d.placeOfSupply} onChange={e => set('placeOfSupply', e.target.value)}/></div><div className="totals-card"><div><span>Subtotal</span><b>{formatMoney(totals.subtotal, d.currency)}</b></div><div><span>Tax</span><b>{formatMoney(totals.tax, d.currency)}</b></div><div className="total-line"><span>Total</span><b>{formatMoney(totals.total, d.currency)}</b></div></div></EditorSection>

          <EditorSection id="payment" title="Payment" hint="How you get paid" Icon={CreditCard} open={open === 'payment'} onToggle={toggle}><div className="form-grid"><SelectField label="Method" value={d.payment.method} onChange={e => setD(x => ({ ...x, payment: { ...x.payment, method: e.target.value as PaymentMethod } }))}>{['Bank transfer','UPI','PayPal','Stripe/payment link','Wise','Custom'].map(x => <option key={x}>{x}</option>)}</SelectField><Field label="UPI ID (optional)" value={d.payment.upiId} onChange={e => set('payment.upiId', e.target.value)}/><TextArea label="Payment instructions" value={d.payment.instructions} onChange={e => set('payment.instructions', e.target.value)} placeholder="Account details, payment link, or instructions"/><Field label="Amount paid" inputMode="decimal" value={d.amountPaid} onChange={e => set('amountPaid', e.target.value)}/></div></EditorSection>

          <EditorSection id="notes" title="Notes" hint="The finishing touch" Icon={StickyNote} open={open === 'notes'} onToggle={toggle}><div className="form-grid"><TextArea label="Notes" value={d.notes} onChange={e => set('notes', e.target.value)} placeholder="Project notes, scope, or payment details"/><TextArea label="Thank-you message" value={d.thankYou} onChange={e => set('thankYou', e.target.value)} /></div></EditorSection>

          <EditorSection id="design" title="Design" hint="Make it yours" Icon={Palette} open={open === 'design'} onToggle={toggle}><div className="form-grid"><div className="field-label"><span>Template</span><div className="template-picker">{templates.map(x => <button key={x.id} type="button" className={`template-option ${d.template === x.id ? 'selected' : ''}`} onClick={() => set('template', x.id)}><span className={`template-swatch swatch-${x.id}`} /><span><b>{x.name}</b><small>{x.desc}</small></span>{d.template === x.id && <Check size={14}/>}</button>)}</div></div><SelectField label="Font" value={d.font} onChange={e => set('font', e.target.value)}>{fonts.map(x => <option key={x}>{x}</option>)}</SelectField><label className="field-label"><span>Accent color</span><input type="color" value={d.accentColor} onChange={e => set('accentColor', e.target.value)} className="color-input" /></label><Field label="Footer" value={d.footer} onChange={e => set('footer', e.target.value)} placeholder="Optional footer text"/></div></EditorSection>
        </div>
      </aside>

      <section className={`preview-pane ${tab === 'edit' ? 'mobile-hidden' : ''}`}>
        <div className="preview-toolbar"><div><span className="live-dot"/> Live preview</div><span>A4 · {d.currency}</span></div>
        <div className="paper-stage"><InvoicePreview data={d}/></div>
        <div className="preview-tip"><Check size={14}/> Updates are saved automatically on this device.</div>
      </section>
    </main>
    <div className="mobile-download"><button type="button" onClick={download}><ArrowDownToLine size={17}/> Download PDF <span>{formatMoney(totals.total, d.currency)}</span></button></div>
  </div>;
}
