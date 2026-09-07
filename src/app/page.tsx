import Link from 'next/link';
import { ArrowRight, Check, FileDown, MousePointer2, ShieldCheck, Sparkles } from 'lucide-react';
import { InvoicePreview } from '@/components/InvoicePreview';
import type { InvoiceData } from '@/types/invoice';

const demo: InvoiceData = {
  business:{name:'Alex Morgan',company:'AM Studio',email:'hello@amstudio.example',phone:'+91 90000 00000',website:'amstudio.example',address:'Pune, Maharashtra, India',country:'India',taxId:'',gstin:''},
  client:{name:'Jordan Lee',company:'Northstar Labs',email:'jordan@example.com',phone:'',address:'Bengaluru, India',country:'India',taxId:'',gstin:''},
  invoiceNumber:'INV-2026-001',issueDate:'2026-09-01',dueDate:'2026-09-15',currency:'INR',paymentTerms:'Net 14',
  items:[{id:'1',description:'Product design & frontend development',quantity:'1',rate:'45000',taxRate:'0'}],discount:'0',taxKind:'none',taxRate:'0',gstMode:'none',
  payment:{method:'Bank transfer',instructions:'Account details provided on request.',upiId:'',qrData:''},notes:'Project work for September.',thankYou:'Thank you for your business.',footer:'Beautiful invoices. Less admin.',template:'modern',accentColor:'#635bff',font:'Inter',amountPaid:'0',status:'Draft',placeOfSupply:''
};

export default function Home(){
  return <main className="landing">
    <nav className="landing-nav">
      <Link href="/" className="landing-brand">invoza<span>.</span></Link>
      <div className="nav-pill">
        <Link href="#how">How it works</Link><Link href="#features">Features</Link><Link href="/create" className="nav-cta">Create invoice <ArrowRight size={14}/></Link>
      </div>
    </nav>

    <section className="hero-wrap">
      <div className="hero-grid">
        <div>
          <div className="hero-kicker"><Sparkles size={12}/> Invoice studio for independent work</div>
          <h1 className="hero-title">Your work is <em>worth</em> a better invoice.</h1>
          <p className="hero-copy">Build a polished invoice in under a minute. Edit the details, shape the visual style, and watch the A4 document update instantly — no account, no clutter, no watermark.</p>
          <div className="hero-actions"><Link href="/create" className="primary-cta">Create free invoice <ArrowRight size={15}/></Link><a href="#example" className="secondary-cta">Preview the studio</a></div>
          <div className="hero-trust"><span><Check size={13}/> No signup</span><span><Check size={13}/> Local drafts</span><span><Check size={13}/> Real A4 PDF</span></div>
        </div>
        <div id="example" className="hero-demo">
          <div className="demo-label"><i/> Live document</div>
          <InvoicePreview data={demo} compact/>
        </div>
      </div>
    </section>

    <section id="how" className="feature-strip"><div className="feature-inner">
      <p className="section-kicker">A calmer workflow</p><h2 className="section-title">Three moves. One finished invoice.</h2>
      <div className="feature-grid">
        {[['01','Write','Add your client, scope and rate. The editor keeps the boring bits out of the way.'],['02','Shape','Choose a visual direction, accent and typeface. Your document responds as you design it.'],['03','Send','Download a clean, selectable A4 PDF and send it wherever your client already works.']].map(([n,t,p])=><article className="feature-card" key={n}><div className="feature-index">{n}</div><h3>{t}</h3><p>{p}</p></article>)}
      </div>
    </div></section>

    <section id="features"><div className="why-grid">
      <div><p className="section-kicker">Built for solo businesses</p><h2 className="section-title">Professional enough for the client. Simple enough for you.</h2><p className="hero-copy">Use INR, USD, EUR, GBP and more. Add GST, UPI or bank instructions, discounts, taxes and payment status without turning an invoice into an accounting dashboard.</p></div>
      <div className="stat-grid">
        {[[FileDown,'PDF','Real A4 output'],[MousePointer2,'60s','Quick creation'],[ShieldCheck,'Local','Drafts saved on-device'],[Sparkles,'6','Distinct templates']].map(([Icon,big,label])=>{const I=Icon as typeof FileDown; return <div className="stat" key={String(label)}><I size={17} color="var(--accent)"/><b>{String(big)}</b><span>{String(label)}</span></div>})}
      </div>
    </div></section>

    <section className="final-cta"><div className="final-inner"><div><p className="section-kicker" style={{color:'#9d98a6'}}>Ready when you are</p><h2>Your next invoice should take a minute, not an afternoon.</h2></div><Link href="/create" className="primary-cta">Create free invoice <ArrowRight size={15}/></Link></div></section>
    <footer className="site-footer"><span>© 2026 Invoza</span><Link href="/invoice-generator">Invoice Generator</Link><Link href="/invoice-template">Templates</Link><Link href="/gst-invoice-generator">GST Invoice Generator</Link></footer>
  </main>
}
