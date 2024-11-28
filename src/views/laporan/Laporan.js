import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CRow, CCol } from '@coreui/react';
import Select from 'react-select';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Data umat
const data = [
  { id: 1, nama: 'John Doe', lingkungan: 'Lingkungan A', iuran: { jan: 10000, feb: 20000, mar: 15000, apr: 0, may: 10000, jun: 0, jul: 0, aug: 0, sep: 5000, oct: 0, nov: 10000, dec: 0 } },
  { id: 2, nama: 'Jane Doe', lingkungan: 'Lingkungan A', iuran: { jan: 0, feb: 15000, mar: 10000, apr: 5000, may: 0, jun: 5000, jul: 0, aug: 0, sep: 0, oct: 0, nov: 20000, dec: 5000 } },
  { id: 3, nama: 'Michael Smith', lingkungan: 'Lingkungan B', iuran: { jan: 20000, feb: 25000, mar: 30000, apr: 15000, may: 10000, jun: 20000, jul: 10000, aug: 15000, sep: 0, oct: 0, nov: 20000, dec: 15000 } },
  { id: 4, nama: 'Alice Johnson', lingkungan: 'Lingkungan B', iuran: { jan: 15000, feb: 20000, mar: 15000, apr: 20000, may: 25000, jun: 30000, jul: 10000, aug: 5000, sep: 0, oct: 0, nov: 15000, dec: 10000 } },
  { id: 5, nama: 'Eve Williams', lingkungan: 'Lingkungan C', iuran: { jan: 10000, feb: 20000, mar: 25000, apr: 30000, may: 15000, jun: 10000, jul: 20000, aug: 15000, sep: 25000, oct: 20000, nov: 10000, dec: 15000 } },
  { id: 6, nama: 'David Brown', lingkungan: 'Lingkungan C', iuran: { jan: 30000, feb: 15000, mar: 20000, apr: 25000, may: 30000, jun: 35000, jul: 40000, aug: 10000, sep: 20000, oct: 15000, nov: 10000, dec: 5000 } },
];

// Daftar lingkungan
const lingkunganOptions = [
  { value: 'Lingkungan A', label: 'Lingkungan A' },
  { value: 'Lingkungan B', label: 'Lingkungan B' },
  { value: 'Lingkungan C', label: 'Lingkungan C' },
  { value: 'all', label: 'Semua Lingkungan' },
];

// Style untuk PDF
const styles = StyleSheet.create({
  page: { padding: 30, flexDirection: 'column', backgroundColor: '#FFFFFF' },
  header: { marginBottom: 10, textAlign: 'center', fontSize: 12 },
  title: { fontSize: 14, fontWeight: 'bold', marginBottom: 5 },
  table: { display: 'table', width: '100%', marginTop: 10 },
  tableRow: { flexDirection: 'row' },
  tableCell: { flex: 1, borderWidth: 1, borderColor: '#000', textAlign: 'center', fontSize: 10, padding: 5 },
  signature: { marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', fontSize: 10 },
  signatureBlock: { textAlign: 'center', width: '40%' },
  emptySpace: { height: 20 },
});

// Komponen halaman PDF untuk setiap lingkungan
const LingkunganPage = ({ lingkungan, rows }) => {
  const totals = Array(12).fill(0); // Total per bulan
  const totalPerRow = rows.map((row) => {
    const sum = Object.values(row.iuran).reduce((a, b) => a + b, 0);
    Object.keys(row.iuran).forEach((month, i) => {
      totals[i] += row.iuran[month];
    });
    return sum;
  });

  const grandTotal = totals.reduce((a, b) => a + b, 0);

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header */}
      <View>
        <Text style={styles.header}>Paroki Kristus Raja Ungaran</Text>
        <Text style={styles.header}>{`Lingkungan ${lingkungan}`}</Text>
        <Text style={styles.header}>Rincian Penerimaan Iuran</Text>
        <Text style={styles.header}>Tahun {new Date().getFullYear()}</Text>
      </View>

      <View style={styles.emptySpace}></View>

      {/* Tabel */}
      <View style={styles.table}>
        {/* Header Table */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>
            No
          </Text>
          <Text style={styles.tableCell}>
            Nama Umat
          </Text>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Total'].map((header, i) => (
            <Text key={i} style={styles.tableCell}>
              {header}
            </Text>
          ))}
        </View>

        {/* Rows */}        {rows.map((row, index) => (
          <View key={row.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{row.nama}</Text>
            {Object.values(row.iuran).map((value, i) => (
              <Text key={i} style={styles.tableCell}>
                {value || '-'}
              </Text>
            ))}
            <Text style={styles.tableCell}>{totalPerRow[index]}</Text>
          </View>
        ))}

        {/* Total Row */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 2 }]}>Total</Text>
          {totals.map((total, i) => (
            <Text key={i} style={styles.tableCell}>
              {total}
            </Text>
          ))}
          <Text style={styles.tableCell}>{grandTotal}</Text>
        </View>
      </View>

      <View style={styles.emptySpace}></View>

      {/* Tanda Tangan */}
      <View style={styles.signature}>
        <View style={styles.signatureBlock}>
          <Text>Diterima Oleh,</Text>
          <Text style={{ marginTop: 50 }}>Tim Gereja</Text>
        </View>
        <View style={styles.signatureBlock}>
          <Text>
            Semarang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Text>
          <Text>Disetujui Oleh</Text>
          <Text style={{ marginTop: 50 }}>Nama Ketua</Text>
          <Text>Seksi Pengurus</Text>
        </View>
      </View>
    </Page>
  );
};

// Komponen utama
const ExportView = () => {
  const [selectedLingkungan, setSelectedLingkungan] = useState(null);

  const filteredData = selectedLingkungan?.value === 'all' ? data : data.filter((row) => row.lingkungan === selectedLingkungan?.value);

  const groupedData = selectedLingkungan?.value === 'all'
    ? lingkunganOptions.filter((l) => l.value !== 'all').map((ling) => ({
        lingkungan: ling.value,
        rows: data.filter((row) => row.lingkungan === ling.value),
      }))
    : [{ lingkungan: selectedLingkungan?.value, rows: filteredData }];

  const MyDocument = (
    <Document>
      {groupedData.map(({ lingkungan, rows }) => (
        <LingkunganPage key={lingkungan} lingkungan={lingkungan} rows={rows} />
      ))}
    </Document>
  );

  return (
    <CCard>
      <CCardBody>
        <h2 className="text-center mb-4">Export Laporan</h2>

        {/* Filter Lingkungan */}
        <CRow className="mb-4">
          <CCol>
            <Select
              options={lingkunganOptions}
              placeholder="Pilih Lingkungan"
              onChange={(option) => setSelectedLingkungan(option)}
            />
          </CCol>
        </CRow>

        {/* PDF Viewer */}
        <PDFViewer style={{ width: '100%', height: '600px' }}>{MyDocument}</PDFViewer>
      </CCardBody>
    </CCard>
  );
};

export default ExportView;
