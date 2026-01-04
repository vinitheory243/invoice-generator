import puppeteer from "puppeteer";
import { invoiceHTML } from "./invoice-template.js";

export default async function handler(req, res) {
  try {
    const data = req.body;

    // Absolute URLs for Vercel
    const baseUrl = `https://${process.env.VERCEL_URL}`;
    data.logo = `${baseUrl}/assets/logo.png`;
    data.stamp = `${baseUrl}/assets/stamp.png`;

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(invoiceHTML(data), {
      waitUntil: "networkidle0"
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "10mm",
        right: "10mm"
      }
    });

    await browser.close();

    // 🔑 CORRECT binary-safe headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="invoice.pdf"'
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    // 🔑 IMPORTANT: use res.end, not res.send
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
}