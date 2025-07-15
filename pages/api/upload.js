import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
import Papa from 'papaparse';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing file' });

    const file = files.file[0];
    const fileData = fs.readFileSync(file.filepath);
    let text = '';

    if (file.originalFilename.endsWith('.pdf')) {
      const data = await pdf(fileData);
      text = data.text;
    } else if (file.originalFilename.endsWith('.twm')) {
      text = fileData.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    const pattern = /(\S+)\s(\d+):(\d+)\s(.+?)(?=\S+\s\d+:\d+|\Z)/gs;
    const matches = Array.from(text.matchAll(pattern), (m) => ({
      책: m[1],
      장: m[2],
      절: m[3],
      주석: m[4].trim(),
    }));

    const csv = Papa.unparse(matches);
    res.setHeader('Content-Type', 'text/csv;charset=utf-8-sig');
    res.setHeader('Content-Disposition', 'attachment; filename="성경DB.csv"');
    res.status(200).send('\uFEFF' + csv); // UTF-8 BOM 추가
  });
}
