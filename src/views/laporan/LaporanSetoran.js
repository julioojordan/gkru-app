import React, { useEffect, useState } from "react";
import { CCard, CCardBody, CRow, CCol, CFormSelect } from "@coreui/react";
import Select from "react-select";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import services from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import logo from "../../assets/brand/logo.png";

//process total data iuran masuk
const processLingkunganData = (history, lingkungan) => {
  console.log({ history });
  console.log({ lingkungan });
  const processedData = {};

  // Step 1: Initialize processedData with all wilayah and lingkungan
  lingkungan.forEach((lingkunganItem) => {
    const wilayahName = lingkunganItem.Wilayah.NamaWilayah;
    const lingkunganName = lingkunganItem.NamaLingkungan;

    if (!processedData[wilayahName]) {
      processedData[wilayahName] = {};
    }

    processedData[wilayahName][lingkunganName] = {
      idLingkungan: lingkunganItem.Id,
      jumlahIuran: 0,
      kk: lingkunganItem.TotalKeluarga,
    };
  });

  // Step 2: Process history data to calculate jumlahIuran and kk
  history.forEach((historyItem) => {
    const wilayahName = historyItem.Wilayah.NamaWilayah;
    const lingkunganName = historyItem.Lingkungan.NamaLingkungan;

    if (
      processedData[wilayahName] &&
      processedData[wilayahName][lingkunganName]
    ) {
      // Update jumlahIuran
      processedData[wilayahName][lingkunganName].jumlahIuran +=
        historyItem.Nominal;
    }
  });

  return processedData;
};

// hitung total nominal iuran out
const processNominalOut = (data) => {
  return data.reduce((total, item) => total + item.Nominal, 0);
};

// Style untuk PDF
const styles = StyleSheet.create({
  page: { padding: 10, flexDirection: "column", backgroundColor: "#FFFFFF" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginTop: 10,
  },
  headerTextContainer: {
    flex: 1,
    textAlign: "center",
  },
  header: {
    marginBottom: 2,
    fontSize: 10,
  },
  headerDivider: {
    borderBottom: "2px solid black",
    marginVertical: 3,
  },
  table: {
    display: "table",
    width: "100%",
    marginTop: 10,
    borderCollapse: "collapse",
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 5,
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
    flexDirection: "row",
    borderBottom: "1px solid black",
    textAlign: "center",
    fontSize: 9,
  },
  signature: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
  },
  signatureBlock: { textAlign: "center", width: "40%" },
  emptySpace: { height: 5 },
  flex: {
    flex: 1,
  },
  alignLeft: { textAlign: "left" },
  tableBodyFont: {
    fontSize: 8,
  },
  columnSignature: {
    width: "30%",
    textAlign: "center",
  },
  rowSignature: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
  },
  summaryTableRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  summaryTableLabel: {
    width: 140,
    textAlign: "left",
    fontSize: 8,
  },
  summaryTableEqual: {
    width: 15,
    textAlign: "left",
    fontSize: 8,
  },
  summaryTableValueNonNumeric: {
    width: 50,
    textAlign: "left",
    fontSize: 8,
  },
  summaryTableValue: {
    width: 100,
    textAlign: "left",
    fontSize: 8,
  },
  summaryBorderBottom: {
    borderBottom: "1px solid black",
  },
  textCenter: {
    textAlign: "center",
  },
  dateText: {
    fontSize: 8,
    textAlign: "right",
    marginBottom: 5,
    marginRight: 33,
  },
});

const formatRupiah = (amount) => {
  const formattedAmount = Math.abs(amount).toLocaleString("id-ID");
  const prefix = amount < 0 ? "-" : "";
  return `${prefix}Rp ${formattedAmount}`;
};

const generateRows = (data) => {
  const rows = [];
  let grandTotalKK = 0;
  let grandTotalIuran = 0;

  Object.entries(data).forEach(([wilayah, lingkunganData]) => {
    const lingkunganEntries = Object.entries(lingkunganData);
    let isFirstRow = true;

    lingkunganEntries.forEach(([lingkungan, item], index) => {
      grandTotalKK += item.kk;
      grandTotalIuran += item.jumlahIuran;

      rows.push(
        <View style={styles.row} key={`${wilayah}-${lingkungan}`}>
          {/* WIL column */}
          {isFirstRow && (
            <Text style={[styles.cell, { width: 30 }, styles.tableBodyFont]}>
              {wilayah.split(" ")[1]}
            </Text>
          )}
          {!isFirstRow && (
            <Text style={[styles.cell, { width: 30 }, styles.tableBodyFont]} />
          )}
          {/* NO column */}
          <Text style={[styles.cell, { width: 30 }, styles.tableBodyFont]}>
            {index + 1}
          </Text>
          {/* LINGKUNGAN column */}
          <Text
            style={[
              styles.cell,
              { width: 140 },
              styles.tableBodyFont,
              styles.alignLeft,
            ]}
          >
            {lingkungan}
          </Text>
          {/* KK column */}
          <Text style={[styles.cell, { width: 40 }, styles.tableBodyFont]}>
            {item.kk}
          </Text>
          {/* JUMLAH IURAN column */}
          <Text style={[styles.cell, styles.flex, styles.tableBodyFont]}>
            {item.jumlahIuran}
          </Text>
        </View>
      );

      isFirstRow = false;
    });
  });

  // Add grand total row
  rows.push(
    <View style={[styles.row, styles.tableHeader]} key="grand-total">
      <Text style={[styles.cell, { width: 30 + 30 + 140 }]}>JUMLAH</Text>
      <Text style={[styles.cell, { width: 40 }]}>{grandTotalKK}</Text>
      <Text style={[styles.cell, styles.flex]}>
        {formatRupiah(grandTotalIuran)}
      </Text>
    </View>
  );

  return rows;
};

const LaporanPage = ({ DataTable, TotalPengeluaran, year, month }) => {
  // perhitungan summary
  let totalKK = 0;
  let totalLingkungan = 0;
  let totalIuranMasuk = 0;

  Object.values(DataTable).forEach((wilayah) => {
    Object.values(wilayah).forEach((lingkungan) => {
      totalKK += lingkungan.kk;
      if (lingkungan.jumlahIuran > 0) totalLingkungan++; // ini misalkan mau hitung total lingkungan tidak hanya yang setor if nya ilangin aja
      totalIuranMasuk += lingkungan.jumlahIuran;
    });
  });

  const hasilAkhir = totalIuranMasuk - TotalPengeluaran;
  const dateNow = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Page size="A4" orientation="portrait" style={styles.page}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image style={styles.logo} src={logo} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.header}>Dewan Paroki Kristus Raja Ungaran</Text>
          <Text style={styles.header}>Bidang Pelayanan Kemasyarakatan</Text>
          <Text style={styles.header}>Tim Kerja PANGRUKTILAYA</Text>
          <View style={styles.headerDivider} />
          <Text style={styles.header}>SETORAN PANGRUKTILAYA LINGKUNGAN</Text>
          <Text style={styles.header}>
            Bulan: {month} - Tahun: {year}
          </Text>
        </View>
      </View>

      {/* Tabel */}
      <View style={styles.table}>
        {/* Header */}
        <View style={[styles.row, styles.tableHeader]}>
          <Text style={[styles.cell, { width: 30 }]}>WIL</Text>
          <Text style={[styles.cell, { width: 30 }]}>NO</Text>
          <Text style={[styles.cell, { width: 140 }]}>LINGKUNGAN</Text>
          <Text style={[styles.cell, { width: 40 }]}>KK</Text>
          <Text style={[styles.cell, styles.flex]}>JUMLAH IURAN</Text>
        </View>
        {/* Rows */}
        {generateRows(DataTable)}
      </View>

      <View style={styles.emptySpace}></View>

      {/* Summary Section */}
      <View style={styles.summaryTableRow}>
        <Text style={styles.summaryTableLabel}>Jumlah KK Yang Terdaftar</Text>
        <Text style={styles.summaryTableEqual}>=</Text>
        <Text style={[styles.summaryTableValueNonNumeric, styles.textCenter]}>
          {totalKK}
        </Text>
        <Text style={styles.summaryTableValueNonNumeric}>KK</Text>
      </View>
      <View style={styles.summaryTableRow}>
        <Text style={styles.summaryTableLabel}>
          Jumlah Lingkungan yang Setor
        </Text>
        <Text style={styles.summaryTableEqual}>=</Text>
        <Text style={[styles.summaryTableValueNonNumeric, styles.textCenter]}>
          {totalLingkungan}
        </Text>
        <Text style={styles.summaryTableValueNonNumeric}>Lingkungan</Text>
      </View>
      <View style={styles.summaryTableRow}>
        <Text style={styles.summaryTableLabel}>Jumlah Iuran Yang Masuk</Text>
        <Text style={styles.summaryTableEqual}>=</Text>
        <Text style={styles.summaryTableValue}>
          {formatRupiah(totalIuranMasuk)}
        </Text>
      </View>
      <View style={styles.summaryTableRow}>
        <Text style={styles.summaryTableLabel}>Digunakan Untuk Santunan</Text>
        <Text style={[styles.summaryTableEqual, styles.summaryBorderBottom]}>
          =
        </Text>
        <Text style={[styles.summaryTableValue, styles.summaryBorderBottom]}>
          {formatRupiah(TotalPengeluaran)}
        </Text>
      </View>
      <View style={styles.summaryTableRow}>
        <Text style={styles.summaryTableLabel}>Hasil Akhir</Text>
        <Text style={styles.summaryTableEqual}>=</Text>
        <Text style={styles.summaryTableValue}>{formatRupiah(hasilAkhir)}</Text>
      </View>

      <Text style={styles.dateText}>Ungaran, {dateNow}</Text>

      {/* Signature Section */}
      <View style={[styles.rowSignature]}>
        <View style={styles.columnSignature}>
          <Text>Dibuat Oleh</Text>
          <Text style={{ marginTop: 37 }}>(.....................)</Text>
        </View>
        <View style={styles.columnSignature}>
          <Text>Diserahkan Oleh</Text>
          <Text style={{ marginTop: 37 }}>(.....................)</Text>
        </View>
        <View style={styles.columnSignature}>
          <Text>Diterima Oleh</Text>
          <Text style={{ marginTop: 37 }}>(.....................)</Text>
        </View>
      </View>
    </Page>
  );
};

// Komponen utama
const ExportView = () => {
  const { ketuaWilayah, ketuaLingkungan } = useSelector((state) => state.auth);
  const { role } = useSelector((state) => state.role);
  const { handleLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [DataTable, setDataTable] = useState([]);
  const [TotalPengeluaran, setTotalPengeluaran] = useState([]);
  const [lingkungan, setLingkungan] = useState([]);
  const [error, setError] = useState(false);
  const CURRENT_YEAR = new Date().getFullYear();
  const CURRENT_MONTH = new Date().getMonth() + 1;
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(CURRENT_MONTH);
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchLingkungan = async () => {
      try {
        const response =
          await services.LingkunganService.getAllLingkunganWithTotalKeluarga();
        setLingkungan(response);
        const responseHistory =
          await services.HistoryService.getAllHistorySetoran(year, month);
        const DataTable = responseHistory.filter(
          (item) => item.Keterangan === "IN"
        );
        setDataTable(processLingkunganData(DataTable, response));
        setTotalPengeluaran(
          processNominalOut(
            responseHistory.filter((item) => item.Keterangan === "OUT")
          )
        );
        console.log(
          JSON.stringify(processLingkunganData(DataTable, response), null, 2)
        );
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLingkungan();
  }, [year, month]);

  const MyDocument = (
    <Document>
      <LaporanPage
        key={`${month}-${year}`}
        DataTable={DataTable}
        TotalPengeluaran={TotalPengeluaran}
        year={year}
        month={month}
      />
    </Document>
  );

  if (loading) {
    return (
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) return <p>Error fetching data.</p>;

  return (
    <CCard>
      <CCardBody>
        <h2 className="text-center mb-4">Export Laporan</h2>

        {/* Filter Lingkungan */}
        <CRow className="mb-4">
          <CCol xs={12} sm={12} md={12} lg={6} xl={6}>
            <CFormSelect
              id="bulan"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              required
              floatingClassName="mb-3"
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {monthNames[month - 1]}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol xs={12} sm={12} md={12} lg={6} xl={6}>
            <CFormSelect
              id="tahun"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              floatingClassName="mb-3"
            >
              <option value={CURRENT_YEAR - 2}>{CURRENT_YEAR - 2}</option>
              <option value={CURRENT_YEAR - 1}>{CURRENT_YEAR - 1}</option>
              <option value={CURRENT_YEAR}>{CURRENT_YEAR}</option>
              <option value={CURRENT_YEAR + 1}>{CURRENT_YEAR + 1}</option>
              <option value={CURRENT_YEAR + 2}>{CURRENT_YEAR + 2}</option>
            </CFormSelect>
          </CCol>
        </CRow>

        {/* PDF Viewer */}
        {year && month && (
          <PDFViewer style={{ width: "100%", height: "600px" }}>
            {MyDocument}
          </PDFViewer>
        )}
      </CCardBody>
    </CCard>
  );
};
export default ExportView;
