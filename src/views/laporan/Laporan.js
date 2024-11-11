import React from 'react';
import { CButton, CCard, CCardBody, CRow, CCol } from '@coreui/react';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';
import { saveAs } from 'file-saver';

const ExportView = () => {
  // Data untuk di-export
  const data = [
    { id: 1, nama: 'John Doe', umur: 28 },
    { id: 2, nama: 'Jane Doe', umur: 26 },
  ];

  // Fungsi untuk export ke file Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    
    worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];  // Merge header
    worksheet['A1'] = { v: 'Judul Laporan', t: 's' };  // Header judul laporan
    
    // Set landscape print layout
    workbook.Sheets['Laporan']['!page'] = { orientation: 'landscape' };
    
    XLSX.writeFile(workbook, 'Laporan.xlsx');
  };

  // Fungsi untuk export ke file Word
  const handleExportWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'Judul Laporan',
              heading: 'Heading1',
              alignment: 'CENTER',
            }),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('ID')] }),
                    new TableCell({ children: [new Paragraph('Nama')] }),
                    new TableCell({ children: [new Paragraph('Umur')] }),
                  ],
                }),
                ...data.map((row) => (
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(row.id.toString())] }),
                      new TableCell({ children: [new Paragraph(row.nama)] }),
                      new TableCell({ children: [new Paragraph(row.umur.toString())] }),
                    ],
                  })
                )),
              ],
            }),
            new Paragraph({ text: '\n' }),
            new Paragraph({
              text: 'Paraf Kanan',
              alignment: 'RIGHT',
            }),
            new Paragraph({
              text: 'Paraf Kiri',
              alignment: 'LEFT',
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'Laporan.docx');
    });
  };

  return (
    <CCard>
      <CCardBody>
        <h2 className="text-center mb-4">Export Laporan</h2>
        <CRow className="justify-content-center">
          <CCol xs="6" className="text-center">
            <CButton color="primary" size="lg" onClick={handleExportExcel} style={{ width: '100%', marginBottom: '1rem' }}>
              Export Excel
            </CButton>
          </CCol>
          <CCol xs="6" className="text-center">
            <CButton color="secondary" size="lg" onClick={handleExportWord} style={{ width: '100%' }}>
              Export Word
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default ExportView;
