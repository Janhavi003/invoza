import {NextResponse} from 'next/server';
import {Document,Page,Text,View,Image,StyleSheet,renderToBuffer,Font} from '@react-pdf/renderer';
import path from 'node:path';
import {calculateInvoice} from '@/lib/calculations';
import {currencies} from '@/config/currencies';
import type {InvoiceData} from '@/types/invoice';

const fontDir=path.join(process.cwd(),'public','fonts');
Font.register({family:'NotoSans',fonts:[{src:path.join(fontDir,'NotoSans-Regular.ttf'),fontWeight:400},{src:path.join(fontDir,'NotoSans-Bold.ttf'),fontWeight:700}]});
Font.register({family:'NotoSansArabic',src:path.join(fontDir,'NotoSansArabic-Regular.ttf')});

const base=StyleSheet.create({
  page:{paddingTop:42,paddingBottom:48,paddingHorizontal:42,fontSize:9,fontFamily:'NotoSans',color:'#172033'},
  row:{flexDirection:'row',justifyContent:'space-between',gap:22}, col:{width:'48%'},
  muted:{color:'#667085'}, title:{fontSize:20,fontFamily:'NotoSans',fontWeight:700}, label:{fontSize:7,color:'#667085',textTransform:'uppercase',letterSpacing:1},
  rule:{borderBottomWidth:1,borderBottomColor:'#e7e9ee',marginVertical:14},
  tableHead:{flexDirection:'row',borderBottomWidth:1.5,paddingBottom:6}, tableRow:{flexDirection:'row',borderBottomWidth:1,borderBottomColor:'#edf0f2',paddingVertical:7},
  desc:{flex:1,paddingRight:8},qty:{width:42,textAlign:'right'},rate:{width:72,textAlign:'right'},amount:{width:82,textAlign:'right'},
  summary:{marginLeft:'auto',width:190,marginTop:14},sumrow:{flexDirection:'row',justifyContent:'space-between',marginBottom:5},
  total:{fontSize:11,fontFamily:'NotoSans',fontWeight:700,borderTopWidth:1,borderTopColor:'#d9dde3',paddingTop:7,marginTop:4},
  bottom:{flexDirection:'row',gap:28,borderTopWidth:1,borderTopColor:'#e7e9ee',paddingTop:12,marginTop:18},
  footer:{fontSize:7,color:'#98a2b3',textAlign:'center'},
});

const moneyParts=(v:string|number,c:InvoiceData['currency'])=>{
  const n=Number(v);
  const safe=Number.isFinite(n)?n:0;
  const decimals=c==='JPY'?0:2;
  return {symbol:currencies[c].symbol,amount:new Intl.NumberFormat(currencies[c].locale,{minimumFractionDigits:decimals,maximumFractionDigits:decimals,useGrouping:true}).format(safe)};
};

function Money({value,currency,style}:{value:string|number;currency:InvoiceData['currency'];style?:any}){
  const {symbol,amount}=moneyParts(value,currency);
  return <Text style={style}><Text style={{fontFamily:currency==='AED'?'NotoSansArabic':'NotoSans'}}>{symbol}</Text>{amount}</Text>;
}

function PDF({d}:{d:InvoiceData}){
  const t=calculateInvoice(d); const accent=d.accentColor||'#3659d8';
  const bold=d.template==='bold'; const elegant=d.template==='elegant'; const modern=d.template==='modern'; const creative=d.template==='creative';
  const heading='NotoSans';
  const bodyFont='NotoSans';
  const s=StyleSheet.create({
    page:{...base.page,fontFamily:bodyFont,color:bold?'#ffffff':'#172033',backgroundColor:bold?'#111827':'#ffffff'},
    accentTop:{borderTopWidth:bold?8:modern?7:elegant?1:4,borderTopColor:accent,paddingTop:14,paddingHorizontal:modern||creative?12:0,paddingBottom:1},
    heading:{...base.title,fontFamily:heading,color:bold?'#ffffff':'#172033',fontSize:bold?22:20},
    label:{...base.label,color:bold?'#aeb7c5':'#667085'}, muted:{...base.muted,color:bold?'#aeb7c5':'#667085'},
    rule:{...base.rule,borderBottomColor:bold?'#ffffff22':'#e7e9ee'},
    tableHead:{...base.tableHead,borderBottomColor:accent,backgroundColor:modern||creative?(bold?'#ffffff12':'#f6f7f9'):'transparent',paddingHorizontal:creative?8:0,paddingTop:creative?6:0},
    tableRow:{...base.tableRow,borderBottomColor:bold?'#ffffff18':'#edf0f2',paddingHorizontal:creative?8:0},
    totalBox:{...base.summary,width:195,backgroundColor:bold?'#ffffff12':modern||creative?'#f6f7f9':'transparent',padding:modern||creative?10:0,borderLeftWidth:d.template==='professional'?3:0,borderLeftColor:accent},
    bottom:{...base.bottom,borderTopColor:bold?'#ffffff22':'#e7e9ee'},
    footer:{...base.footer,color:bold?'#98a2b3':'#98a2b3'},
  });
  return <Document title={`${d.invoiceNumber} — Invoza`} author="Invoza">
    <Page size="A4" style={s.page} wrap>
      <View style={s.accentTop}>
        <View style={base.row}>
          <View style={base.col} wrap>
            {d.business.logo&&<Image src={d.business.logo} style={{width:88,height:34,objectFit:'contain',objectPosition:'left'}}/>}
            <Text style={s.heading}>{d.business.name||'Your Business'}</Text>
            {d.business.company&&<Text>{d.business.company}</Text>}
            <Text style={s.muted}>{d.business.address||''}</Text>
            <Text>{d.business.email}{d.business.phone&&` · ${d.business.phone}`}</Text>
            {d.business.website&&<Text>{d.business.website}</Text>}
            {d.business.gstin&&<Text>GSTIN: {d.business.gstin}</Text>}
          </View>
          <View style={[base.col,{alignItems:'flex-end'}]}>
            <Text style={s.label}>{d.template.toUpperCase()} · INVOICE</Text><Text style={{fontSize:14,fontFamily:heading}}>{d.invoiceNumber}</Text>
            <Text style={s.muted}>Issue {d.issueDate}</Text><Text style={s.muted}>Due {d.dueDate}</Text>
          </View>
        </View>
        <View style={s.rule}/>
        <View style={base.row}>
          <View style={base.col}><Text style={s.label}>Bill to</Text><Text style={{fontFamily:heading,marginTop:3}}>{d.client.name||'Client name'}</Text>{d.client.company&&<Text>{d.client.company}</Text>}<Text style={s.muted}>{d.client.address||''}</Text><Text>{d.client.email}</Text>{d.client.gstin&&<Text>GST/VAT/GST ID: {d.client.gstin}</Text>}</View>
          <View style={base.col}><Text style={s.label}>Payment terms</Text><Text>{d.paymentTerms||'Due on receipt'}</Text>{d.placeOfSupply&&<Text style={s.muted}>Place of supply: {d.placeOfSupply}</Text>}</View>
        </View>
        <View style={s.rule}/>
        <View style={s.tableHead}><Text style={base.desc}>DESCRIPTION</Text><Text style={base.qty}>QTY</Text><Text style={base.rate}>RATE</Text><Text style={base.amount}>AMOUNT</Text></View>
        {d.items.map(i=><View key={i.id} style={s.tableRow} wrap={false}><Text style={base.desc}>{i.description||'Service'}{i.hsnSac?`\nHSN/SAC ${i.hsnSac}`:''}</Text><Text style={base.qty}>{i.quantity||'0'}</Text><Money value={i.rate} currency={d.currency} style={base.rate}/><Money value={String((Number(i.quantity)||0)*(Number(i.rate)||0))} currency={d.currency} style={base.amount}/></View>)}
        <View style={s.totalBox}>
          {[['Subtotal',t.subtotal],['Discount',t.discount],['Tax',t.tax]].map(([a,b])=><View style={base.sumrow} key={a}><Text style={s.muted}>{a}</Text><Money value={b} currency={d.currency}/></View>)}
          <View style={base.total}><Text>Total</Text><Money value={t.total} currency={d.currency}/></View>
          {Number(t.amountPaid)>0&&<View style={base.sumrow}><Text>Paid</Text><Money value={t.amountPaid} currency={d.currency}/></View>}
          <View style={[base.sumrow,{fontFamily:heading,color:bold?'#fff':accent,marginTop:3}]}><Text>Balance due</Text><Money value={t.balanceDue} currency={d.currency}/></View>
        </View>
        <View style={s.bottom} wrap>
          <View style={base.col} wrap><Text style={{fontFamily:heading}}>Payment</Text><Text style={s.muted}>{d.payment.instructions||d.payment.method}</Text>{d.payment.upiId&&<Text>UPI: {d.payment.upiId}</Text>}</View>
          <View style={base.col} wrap><Text style={{fontFamily:heading}}>Notes</Text><Text style={s.muted}>{d.notes||d.thankYou||'Thank you for your business.'}</Text></View>
        </View>
      </View>
      <View fixed style={{position:'absolute',bottom:22,left:42,right:42}}><Text style={s.footer}>{d.footer||'Thank you for your business.'}</Text></View>
    </Page>
  </Document>
}

export async function POST(req:Request){try{const d=await req.json() as InvoiceData;if(!d?.invoiceNumber||!Array.isArray(d.items)||!d.items.length)return NextResponse.json({error:'Invalid invoice'},{status:400});const buffer=await renderToBuffer(<PDF d={d}/>);return new NextResponse(new Uint8Array(buffer),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${d.invoiceNumber}.pdf"`}})}catch{return NextResponse.json({error:'PDF generation failed'},{status:500})}}
