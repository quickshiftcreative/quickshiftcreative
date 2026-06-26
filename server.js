const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // For base64 images

app.post('/generate-pdf', async (req, res) => {
    try {
        const data = req.body;
        
        // BACKEND CALCULATION: Prevent tampering
        let subtotal = 0;
        data.sections.forEach(sec => {
            if(sec.rows) sec.rows.forEach(r => subtotal += (r.qty * r.price));
        });
        const discAmt = subtotal * (data.finance.discount / 100);
        const taxBase = subtotal - discAmt;
        const taxAmt = taxBase * (data.finance.tax / 100);
        const grandTotal = taxBase + taxAmt;

        const formatCur = (num) => `${data.finance.currency}${Number(num).toLocaleString('en-IN', {maximumFractionDigits:2})}`;

        // 100% Matching HTML Template from Reference PDF
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
            <style>
                /* PDF Exact Replica CSS */
                body { font-family: 'Inter', sans-serif; padding: 25mm 20mm; color: #000; margin: 0; position: relative; }
                
                /* Title Section */
                .title-block { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                .doc-title { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; }
                .doc-subtitle { font-size: 16px; color: #333; font-weight: 600; margin-top: 5px; }
                .meta-row { display: flex; font-size: 11px; color: #555; text-transform: uppercase; font-weight: 600; gap: 25px; margin-top: 15px; }
                
                /* Logo & Stamp */
                .logo-img { max-height: 60px; position: absolute; top: 25mm; right: 20mm; }
                .stamp-img { position: absolute; bottom: 80mm; right: 20mm; max-height: 90px; opacity: 0.8; z-index: -1; }

                /* Header Grid */
                .party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 35px; }
                .party-label { font-size: 10px; color: #D4AF37; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
                .party-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #000; }
                .party-desc { font-size: 12px; color: #444; margin-top: 4px; line-height: 1.6; }

                /* Tagline */
                .tagline-bar { text-align: center; font-size: 11px; font-weight: 600; color: #555; padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-bottom: 40px; }

                /* Tables */
                .section-header { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #000; margin-top: 40px; margin-bottom: 12px; display: flex; align-items: center; }
                .section-num { color: #D4AF37; margin-right: 12px; }
                
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; }
                th { background: #f9f9f9; padding: 12px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #555; border-bottom: 2px solid #ddd; }
                td { padding: 12px 10px; border-bottom: 1px solid #eee; vertical-align: top; color: #444; font-size: 12px; line-height: 1.5; word-wrap: break-word; }
                td strong { color: #000; font-size: 13px; display: block; margin-bottom: 4px; }

                /* Totals */
                .totals-box { width: 350px; margin-left: auto; margin-top: 25px; page-break-inside: avoid; }
                .tot-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #444; }
                .grand-total { font-size: 16px; font-weight: 800; color: #000; border-top: 2px solid #000; padding-top: 12px; margin-top: 4px; }

                /* Signatures - 100% Match */
                .sig-wrapper { border: 1px solid #D4AF37; margin-top: 60px; page-break-inside: avoid; position: relative; }
                .sig-grid { display: grid; grid-template-columns: 1fr 1fr; }
                .sig-col { padding: 25px; border-right: 1px solid #eee; display: flex; flex-direction: column; }
                .sig-label-gold { font-size: 10px; color: #D4AF37; text-transform: uppercase; font-weight: 700; margin-bottom: 15px; letter-spacing: 1px; }
                .sig-name { font-size: 16px; font-weight: 700; color: #000; }
                .sig-company { font-size: 11px; color: #555; margin-bottom: 40px; }
                .sig-line-row { display: flex; align-items: flex-end; margin-bottom: 15px; }
                .sig-line-row span { font-size: 12px; color: #555; width: 60px; margin-right: 10px; }
                .sig-line { flex: 1; border-bottom: 1px solid #000; height: 35px; position: relative; }
                .sig-img { position: absolute; bottom: 2px; left: 10px; max-height: 50px; max-width: 90%; }
                .sig-footer { background: #111; color: #D4AF37; text-align: center; padding: 12px; font-size: 10px; letter-spacing: 1px; font-weight: 500; border-top: 1px solid #D4AF37; }

                /* Page Breaking */
                .avoid-break { page-break-inside: avoid; break-inside: avoid; }
            </style>
        </head>
        <body>
            ${data.stamp ? `<img src="${data.stamp}" class="stamp-img avoid-break">` : ''}

            <div class="title-block avoid-break">
                ${data.logo ? `<img src="${data.logo}" class="logo-img">` : ''}
                <div class="doc-title">QUOTATION</div>
                <div class="doc-subtitle">${data.general.title}</div>
                <div class="meta-row">
                    <span>REF: ${data.general.ref}</span>
                    <span>DATE: ${data.general.date}</span>
                </div>
            </div>
            
            <div class="party-grid avoid-break">
                <div>
                    <div class="party-label">PREPARED BY</div>
                    <div class="party-name">${data.freelancer.name}```javascript
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // For base64 images

app.post('/generate-pdf', async (req, res) => {
    try {
        const data = req.body;
        
        // BACKEND CALCULATION: Prevent tampering
        let subtotal = 0;
        data.sections.forEach(sec => {
            if(sec.rows) sec.rows.forEach(r => subtotal += (r.qty * r.price));
        });
        const discAmt = subtotal * (data.finance.discount / 100);
        const taxBase = subtotal - discAmt;
        const taxAmt = taxBase * (data.finance.tax / 100);
        const grandTotal = taxBase + taxAmt;

        const formatCur = (num) => `${data.finance.currency}${Number(num).toLocaleString('en-IN', {maximumFractionDigits:2})}`;

        // 100% Matching HTML Template from Reference PDF
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <link href="[https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700;800&display=swap](https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:wght@700;800&display=swap)" rel="stylesheet">
            <style>
                /* PDF Exact Replica CSS */
                body { font-family: 'Inter', sans-serif; padding: 25mm 20mm; color: #000; margin: 0; position: relative; }
                
                /* Title Section */
                .title-block { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
                .doc-title { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 800; color: #000; text-transform: uppercase; letter-spacing: 1px; }
                .doc-subtitle { font-size: 16px; color: #333; font-weight: 600; margin-top: 5px; }
                .meta-row { display: flex; font-size: 11px; color: #555; text-transform: uppercase; font-weight: 600; gap: 25px; margin-top: 15px; }
                
                /* Logo & Stamp */
                .logo-img { max-height: 60px; position: absolute; top: 25mm; right: 20mm; }
                .stamp-img { position: absolute; bottom: 80mm; right: 20mm; max-height: 90px; opacity: 0.8; z-index: -1; }

                /* Header Grid */
                .party-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 35px; }
                .party-label { font-size: 10px; color: #D4AF37; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
                .party-name { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #000; }
                .party-desc { font-size: 12px; color: #444; margin-top: 4px; line-height: 1.6; }

                /* Tagline */
                .tagline-bar { text-align: center; font-size: 11px; font-weight: 600; color: #555; padding: 12px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-bottom: 40px; }

                /* Tables */
                .section-header { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #000; margin-top: 40px; margin-bottom: 12px; display: flex; align-items: center; }
                .section-num { color: #D4AF37; margin-right: 12px; }
                
                table { width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed; }
                th { background: #f9f9f9; padding: 12px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #555; border-bottom: 2px solid #ddd; }
                td { padding: 12px 10px; border-bottom: 1px solid #eee; vertical-align: top; color: #444; font-size: 12px; line-height: 1.5; word-wrap: break-word; }
                td strong { color: #000; font-size: 13px; display: block; margin-bottom: 4px; }

                /* Totals */
                .totals-box { width: 350px; margin-left: auto; margin-top: 25px; page-break-inside: avoid; }
                .tot-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #444; }
                .grand-total { font-size: 16px; font-weight: 800; color: #000; border-top: 2px solid #000; padding-top: 12px; margin-top: 4px; }

                /* Signatures - 100% Match */
                .sig-wrapper { border: 1px solid #D4AF37; margin-top: 60px; page-break-inside: avoid; position: relative; }
                .sig-grid { display: grid; grid-template-columns: 1fr 1fr; }
                .sig-col { padding: 25px; border-right: 1px solid #eee; display: flex; flex-direction: column; }
                .sig-label-gold { font-size: 10px; color: #D4AF37; text-transform: uppercase; font-weight: 700; margin-bottom: 15px; letter-spacing: 1px; }
                .sig-name { font-size: 16px; font-weight: 700; color: #000; }
                .sig-company { font-size: 11px; color: #555; margin-bottom: 40px; }
                .sig-line-row { display: flex; align-items: flex-end; margin-bottom: 15px; }
                .sig-line-row span { font-size: 12px; color: #555; width: 60px; margin-right: 10px; }
                .sig-line { flex: 1; border-bottom: 1px solid #000; height: 35px; position: relative; }
                .sig-img { position: absolute; bottom: 2px; left: 10px; max-height: 50px; max-width: 90%; }
                .sig-footer { background: #111; color: #D4AF37; text-align: center; padding: 12px; font-size: 10px; letter-spacing: 1px; font-weight: 500; border-top: 1px solid #D4AF37; }

                /* Page Breaking */
                .avoid-break { page-break-inside: avoid; break-inside: avoid; }
            </style>
        </head>
        <body>
            ${data.stamp ? `<img src="${data.stamp}" class="stamp-img avoid-break">` : ''}

            <div class="title-block avoid-break">
                ${data.logo ? `<img src="${data.logo}" class="logo-img">` : ''}
                <div class="doc-title">QUOTATION</div>
                <div class="doc-subtitle">${data.general.title}</div>
                <div class="meta-row">
                    <span>REF: ${data.general.ref}</span>
                    <span>DATE: ${data.general.date}</span>
                </div>
            </div>
            
            <div class="party-grid avoid-break">
                <div>
                    <div class="party-label">PREPARED BY</div>
                    <div class="party-name">${data.freelancer.name}</div>
                    <div class="party-desc">${data.freelancer.role}<br>${data.freelancer.info}</div>
                </div>
                <div>
                    <div class="party-label">PREPARED FOR</div>
                    <div class="party-name">${data.client.name}</div>
                    <div class="party-desc">${data.client.company}<br>${data.client.info}</div>
                </div>
            </div>
            
            <div class="tagline-bar avoid-break">${data.general.tagline}</div>

            ${data.sections.map((sec, i) => `
                <div class="avoid-break">
                    <div class="section-header">
                        <span class="section-num">0${i+1}</span>
                        ${sec.title}
                    </div>
                </div>
                <table>
                    <thead>
                        <tr class="avoid-break">
                            <th width="30%">SERVICE</th>
                            <th width="40%">DESCRIPTION</th>
                            <th width="10%" style="text-align: center;">QTY</th>
                            <th width="20%" style="text-align: right;">PRICE</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sec.rows.map(r => `
                            <tr class="avoid-break">
                                <td><strong>${r.name}</strong></td>
                                <td>${r.desc}</td>
                                <td style="text-align: center;">${r.qty}</td>
                                <td style="text-align: right; font-weight:bold; color:#000;">${formatCur(r.qty * r.price)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `).join('')}

            <div class="totals-box avoid-break">
                <div class="tot-row"><span>Subtotal</span><span>${formatCur(subtotal)}</span></div>
                ${data.finance.discount > 0 ? `<div class="tot-row"><span>Discount (${data.finance.discount}%)</span><span>-${formatCur(discAmt)}</span></div>` : ''}
                ${data.finance.tax > 0 ? `<div class="tot-row"><span>Tax (${data.finance.tax}%)</span><span>${formatCur(taxAmt)}</span></div>` : ''}
                <div class="tot-row grand-total"><span>GRAND TOTAL</span><span>${formatCur(grandTotal)}</span></div>
            </div>

            ${data.terms.length > 0 ? `
                <div class="avoid-break">
                    <div class="section-header" style="margin-top:50px;">
                        <span class="section-num">0${data.sections.length+1}</span>
                        Terms & Conditions
                    </div>
                </div>
                <table class="avoid-break">
                    <thead><tr><th width="30%">CLAUSE</th><th>DETAILS</th></tr></thead>
                    <tbody>
                        ${data.terms.map(t => `<tr><td><strong>${t.title}</strong></td><td>${t.details}</td></tr>`).join('')}
                    </tbody>
                </table>
            ` : ''}

            <div class="sig-wrapper avoid-break">
                <div class="sig-grid">
                    <div class="sig-col">
                        <div class="sig-label-gold">CLIENT</div>
                        <div class="sig-name">${data.client.name}</div>
                        <div class="sig-company">${data.client.company}</div>
                        <div class="sig-line-row">
                            <span>Signature:</span>
                            <div class="sig-line">${data.signatures.client ? `<img src="${data.signatures.client}" class="sig-img">` : ''}</div>
                        </div>
                        <div class="sig-line-row" style="margin-bottom:0;">
                            <span>Date:</span>
                            <div class="sig-line" style="height:20px;"></div>
                        </div>
                    </div>
                    <div class="sig-col" style="border-right: none;">
                        <div class="sig-label-gold">FREELANCER</div>
                        <div class="sig-name">${data.freelancer.name}</div>
                        <div class="sig-company">${data.freelancer.role}</div>
                        <div class="sig-line-row">
                            <span>Signature:</span>
                            <div class="sig-line">${data.signatures.freelancer ? `<img src="${data.signatures.freelancer}" class="sig-img">` : ''}</div>
                        </div>
                        <div class="sig-line-row" style="margin-bottom:0;">
                            <span>Date:</span>
                            <div class="sig-line" style="height:20px;"></div>
                        </div>
                    </div>
                </div>
                <div class="sig-footer">This document confirms agreement on the above-mentioned services, pricing, and terms.</div>
            </div>
        </body>
        </html>`;

        // Launch Optimized Puppeteer with Render/Heroku fixes
        const browser = await puppeteer.launch({ 
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            headless: 'new' // Fast headless mode
        });
        const page = await browser.newPage();
        
        // Wait until fonts load
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            printBackground: true, 
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }, // Managed by CSS padding
            displayHeaderFooter: true,
            // Automatic Dynamic Page Numbering at bottom right
            footerTemplate: `<div style="font-size:8px; width:100%; text-align:right; padding-right:20px; color:#888; font-family:Inter,sans-serif;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>`,
            headerTemplate: `<div></div>`
        });

        await browser.close();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${data.general.ref}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({ error: "Failed to generate exact PDF. Error: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Enterprise PDF Backend Running on port ${PORT}`));
