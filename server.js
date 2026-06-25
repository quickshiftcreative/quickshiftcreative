// server.js
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // For base64 images

app.post('/generate-pdf', async (req, res) => {
    try {
        const data = req.body;
        
        // SURPRISE FEATURE: Auto-calculate totals on backend to prevent frontend tampering
        let subtotal = 0;
        data.sections.forEach(sec => sec.rows.forEach(r => subtotal += (r.qty * r.price)));
        const discAmt = subtotal * (data.finance.discount / 100);
        const taxBase = subtotal - discAmt;
        const taxAmt = taxBase * (data.finance.tax / 100);
        const grandTotal = taxBase + taxAmt;

        const formatCur = (num) => `${data.finance.currency}${Number(num).toLocaleString('en-IN', {maximumFractionDigits:2})}`;

        // Generate EXACT PDF HTML Template
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #000; margin: 0; }
                .header { margin-bottom: 30px; }
                .title { font-family: 'Playfair Display', serif; font-size: 34px; color: #000; text-transform: uppercase; letter-spacing: 1px; }
                .subtitle { font-size: 16px; color: #333; font-weight: 600; margin-bottom: 15px; }
                .meta { display: flex; font-size: 11px; color: #555; text-transform: uppercase; font-weight: 600; border-bottom: 1px solid #eee; padding-bottom: 15px; gap: 20px; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 30px 0; }
                .label { font-size: 10px; color: #D4AF37; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; }
                .tagline { text-align: center; font-size: 11px; font-weight: 600; color: #555; padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-bottom: 30px; }
                .table-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; margin-top: 30px; margin-bottom: 10px; color: #000; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background: #f9f9f9; padding: 10px; text-align: left; font-size: 10px; text-transform: uppercase; border-bottom: 2px solid #ddd; }
                td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 12px; }
                .totals { width: 300px; margin-left: auto; margin-top: 20px; }
                .tot-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 12px; }
                .grand { font-size: 16px; font-weight: 800; border-top: 2px solid #000; padding-top: 10px; }
                .sig-box { border: 1px solid #D4AF37; margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; page-break-inside: avoid; position: relative; }
                .sig-col { padding: 20px; border-right: 1px solid #eee; }
                .sig-line { border-bottom: 1px solid #000; height: 40px; position: relative; margin-top: 10px; }
                .sig-img { max-height: 50px; position: absolute; bottom: 2px; }
                .stamp-img { position: absolute; right: 20px; bottom: 50px; max-height: 80px; opacity: 0.8; }
                .logo-img { max-height: 60px; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="header">
                ${data.logo ? `<img src="${data.logo}" class="logo-img">` : ''}
                <div class="title">QUOTATION</div>
                <div class="subtitle">${data.general.title}</div>
                <div class="meta"><span>REF: ${data.general.ref}</span><span>DATE: ${data.general.date}</span></div>
            </div>
            
            <div class="grid">
                <div>
                    <div class="label">PREPARED BY</div>
                    <div class="name">${data.freelancer.name}</div>
                    <div style="font-size: 12px; color: #444; margin-top: 4px;">${data.freelancer.role}<br>${data.freelancer.info}</div>
                </div>
                <div>
                    <div class="label">PREPARED FOR</div>
                    <div class="name">${data.client.name}</div>
                    <div style="font-size: 12px; color: #444; margin-top: 4px;">${data.client.company}<br>${data.client.info}</div>
                </div>
            </div>
            
            <div class="tagline">${data.general.tagline}</div>

            ${data.sections.map((sec, i) => `
                <div class="table-title"><span style="color:#D4AF37; margin-right:8px;">0${i+1}</span> ${sec.title}</div>
                <table>
                    <tr><th width="30%">SERVICE</th><th width="40%">DESCRIPTION</th><th width="10%">QTY</th><th width="20%" style="text-align:right;">PRICE</th></tr>
                    ${sec.rows.map(r => `
                        <tr>
                            <td><strong>${r.name}</strong></td>
                            <td>${r.desc}</td>
                            <td>${r.qty}</td>
                            <td style="text-align:right; font-weight:bold;">${formatCur(r.qty * r.price)}</td>
                        </tr>
                    `).join('')}
                </table>
            `).join('')}

            <div class="totals">
                <div class="tot-row"><span>Subtotal</span><span>${formatCur(subtotal)}</span></div>
                ${data.finance.discount > 0 ? `<div class="tot-row"><span>Discount</span><span>-${formatCur(discAmt)}</span></div>` : ''}
                ${data.finance.tax > 0 ? `<div class="tot-row"><span>Tax/GST</span><span>${formatCur(taxAmt)}</span></div>` : ''}
                <div class="tot-row grand"><span>GRAND TOTAL</span><span>${formatCur(grandTotal)}</span></div>
            </div>

            ${data.terms.length > 0 ? `
                <div class="table-title"><span style="color:#D4AF37; margin-right:8px;">0${data.sections.length+1}</span> Terms & Conditions</div>
                <table>
                    <tr><th width="30%">CLAUSE</th><th>DETAILS</th></tr>
                    ${data.terms.map(t => `<tr><td><strong>${t.title}</strong></td><td>${t.details}</td></tr>`).join('')}
                </table>
            ` : ''}

            <div class="sig-box">
                <div class="sig-col">
                    <div class="label">CLIENT</div>
                    <div class="name">${data.client.name}</div>
                    <div style="font-size: 11px; margin-bottom: 20px;">${data.client.company}</div>
                    <div style="font-size: 12px;">Signature:</div>
                    <div class="sig-line">${data.signatures.client ? `<img src="${data.signatures.client}" class="sig-img">` : ''}</div>
                </div>
                <div class="sig-col" style="border:none;">
                    <div class="label">FREELANCER</div>
                    <div class="name">${data.freelancer.name}</div>
                    <div style="font-size: 11px; margin-bottom: 20px;">${data.freelancer.role}</div>
                    <div style="font-size: 12px;">Signature:</div>
                    <div class="sig-line">${data.signatures.freelancer ? `<img src="${data.signatures.freelancer}" class="sig-img">` : ''}</div>
                </div>
                ${data.stamp ? `<img src="${data.stamp}" class="stamp-img">` : ''}
                <div style="grid-column: span 2; background:#111; color:#D4AF37; text-align:center; padding:10px; font-size:10px;">This document confirms agreement on the above-mentioned services, pricing, and terms.</div>
            </div>
        </body>
        </html>`;

        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true, 
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            displayHeaderFooter: true,
            // SURPRISE FEATURE: Auto Page numbers at the bottom right
            footerTemplate: `<div style="font-size:8px; width:100%; text-align:right; padding-right:20px; color:#888;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
            headerTemplate: `<div></div>`
        });

        await browser.close();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${data.general.ref}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({ error: "Failed to generate PDF" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
