export type TaxKind='none'|'custom'|'vat'|'gst'|'sales';
export type GSTMode='none'|'cgst_sgst'|'igst';
export type CurrencyCode='INR'|'USD'|'EUR'|'GBP'|'AUD'|'CAD'|'SGD'|'AED'|'JPY';
export type InvoiceStatus='Draft'|'Sent'|'Viewed'|'Paid'|'Overdue'|'Cancelled';
export type PaymentMethod='Bank transfer'|'UPI'|'PayPal'|'Stripe/payment link'|'Wise'|'Custom';
export interface Party{ name:string; logo?:string; company:string; email:string; phone:string; website?:string; address:string; country:string; taxId:string; gstin:string }
export interface LineItem{ id:string; description:string; quantity:string; rate:string; taxRate:string; hsnSac?:string }
export interface PaymentDetails{ method:PaymentMethod; instructions:string; upiId:string; qrData:string }
export interface InvoiceData{ business:Party; client:Party; invoiceNumber:string; issueDate:string; dueDate:string; currency:CurrencyCode; paymentTerms:string; items:LineItem[]; discount:string; taxKind:TaxKind; taxRate:string; gstMode:GSTMode; payment:PaymentDetails; notes:string; thankYou:string; footer:string; template:string; accentColor:string; font:string; amountPaid:string; status:InvoiceStatus; placeOfSupply:string }
export interface Totals{subtotal:string;discount:string;tax:string;total:string;amountPaid:string;balanceDue:string}
