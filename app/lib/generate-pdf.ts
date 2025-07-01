// generatePDF.js
import puppeteer from 'puppeteer';

async function generatePDF(url:any, outputPath:any) {
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto(url, { waitUntil: 'networkidle0' });
await page.pdf({ path: outputPath, format: 'A4' });
await browser.close();
}

export default generatePDF;