import puppeteer from "puppeteer";
import { invoiceHTML } from "./invoice-template.js";

export default async function handler(req, res) {
  const data = req.body;

  data.logo = `https://${process.env.VERCEL_URL}/assets/logo.png`;
  data.stamp = `https://${process.env.VERCEL_URL}/assets/stamp.png`;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setContent(invoiceHTML(data), { waitUntil: "networkidle0" });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();

  res.setHeader("Content-Type", "application/pdf");
  res.send(pdf);
}