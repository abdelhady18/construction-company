const { readFile, writeFile } = require('node:fs/promises');
const { PDFParse } = require('pdf-parse');

const pdfPath = 'C:\\Users\\abdel\\OneDrive\\Desktop\\updated Company Profile.pdf';
const outputPath = 'company-profile.md';

async function main() {
  console.log('Reading PDF...');
  const buffer = await readFile(pdfPath);

  console.log('Parsing...');
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = result.text;

    console.log(`Extracted ${text.length} characters across ${result.pages?.length || '?'} pages`);

    // Save as markdown
    const md = `# Company Profile\n\n_Extracted from PDF on ${new Date().toISOString().split('T')[0]}_\n\n---\n\n${text}`;
    await writeFile(outputPath, md, 'utf8');
    console.log(`Saved to ${outputPath}`);
  } finally {
    await parser.destroy();
  }
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
