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
} from "@react-pdf/renderer";
import services from "../../services";
import { useAuth } from "../../hooks/useAuth";
import { useSelector } from "react-redux";

// Data umat
const data = [
  {
    id: 1,
    nama: "John Doe",
    lingkungan: "Lingkungan A",
    iuran: {
      jan: 10000,
      feb: 20000,
      mar: 15000,
      apr: 0,
      may: 10000,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 5000,
      oct: 0,
      nov: 10000,
      dec: 0,
    },
  },
  {
    id: 2,
    nama: "Jane Doe",
    lingkungan: "Lingkungan A",
    iuran: {
      jan: 0,
      feb: 15000,
      mar: 10000,
      apr: 5000,
      may: 0,
      jun: 5000,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 20000,
      dec: 5000,
    },
  },
  {
    id: 3,
    nama: "Michael Smith",
    lingkungan: "Lingkungan B",
    iuran: {
      jan: 20000,
      feb: 25000,
      mar: 30000,
      apr: 15000,
      may: 10000,
      jun: 20000,
      jul: 10000,
      aug: 15000,
      sep: 0,
      oct: 0,
      nov: 20000,
      dec: 15000,
    },
  },
  {
    id: 4,
    nama: "Alice Johnson",
    lingkungan: "Lingkungan B",
    iuran: {
      jan: 15000,
      feb: 20000,
      mar: 15000,
      apr: 20000,
      may: 25000,
      jun: 30000,
      jul: 10000,
      aug: 5000,
      sep: 0,
      oct: 0,
      nov: 15000,
      dec: 10000,
    },
  },
  {
    id: 5,
    nama: "Eve Williams",
    lingkungan: "Lingkungan C",
    iuran: {
      jan: 10000,
      feb: 20000,
      mar: 25000,
      apr: 30000,
      may: 15000,
      jun: 10000,
      jul: 20000,
      aug: 15000,
      sep: 25000,
      oct: 20000,
      nov: 10000,
      dec: 15000,
    },
  },
  {
    id: 6,
    nama: "David Brown",
    lingkungan: "Lingkungan C",
    iuran: {
      jan: 30000,
      feb: 15000,
      mar: 20000,
      apr: 25000,
      may: 30000,
      jun: 35000,
      jul: 40000,
      aug: 10000,
      sep: 20000,
      oct: 15000,
      nov: 10000,
      dec: 5000,
    },
  },
];

const monthMap = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

//step 1 transform data
const transformedData = (data) =>
  Object.values(
    data.reduce((acc, curr) => {
      const {
        IdKeluarga,
        NamaKepalaKeluarga,
        Lingkungan,
        Bulan,
        Nominal,
        CreatedDate,
      } = curr;

      const createdMonth = parseInt(
        CreatedDate.split("T")[0].split("-")[1],
        10
      );
      const createdMonthKey = monthMap[createdMonth - 1];
      const currMonthKey = monthMap[Bulan - 1];

      if (!acc[IdKeluarga]) {
        acc[IdKeluarga] = {
          id: IdKeluarga,
          nama: NamaKepalaKeluarga,
          lingkungan: Lingkungan.Id,
          iuran: {
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            oct: 0,
            nov: 0,
            dec: 0,
          },
        };
      }
      if (createdMonth !== Bulan) {
        acc[IdKeluarga].iuran[currMonthKey] = createdMonthKey;
        acc[IdKeluarga].iuran[createdMonthKey] += Nominal;
      } else {
        acc[IdKeluarga].iuran[currMonthKey] += Nominal;
      }
      return acc;
    }, {})
  );

// Style untuk PDF
const styles = StyleSheet.create({
  page: { padding: 10, flexDirection: "column", backgroundColor: "#FFFFFF" },
  header: { marginBottom: 2, textAlign: "center", fontSize: 12 },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  table: { display: "table", width: "100%", marginTop: 10 },
  tableRow: { flexDirection: "row" },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 5,
    padding: 5,
  },
  tableFontHeader: {
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#b2d9ef",
  },
  tableCellNo: {
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 5,
    padding: 5,
    width: 20,
  },
  tableCellNama: {
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 5,
    padding: 5,
    width: 85,
  },
  tableFontNama: { textAlign: "left" },
  tableFontNominal: { textAlign: "right" },
  tableCellTotaL: {
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
    fontSize: 5,
    padding: 5,
    width: 105,
  },
  signature: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 10,
  },
  signatureBlock: { textAlign: "center", width: "40%" },
  emptySpace: { height: 5 },
  highlightCell: {backgroundColor: "#FFC300"}
});


// Komponen halaman PDF untuk setiap lingkungan
const LingkunganPage = ({ lingkungan, rows, year }) => {
  const totals = Array(12).fill(0); // Total per bulan
  const totalPerRow = rows.map((row) => {
    const sum = Object.values(row.iuran).reduce((a, b) => {
      const validValue = typeof b === "number" ? b : 0; // Jika bukan number, dianggap 0
      return a + validValue;
    }, 0);

    Object.keys(row.iuran).forEach((month, i) => {
      const validValue =
        typeof row.iuran[month] === "number" ? row.iuran[month] : 0; // Validasi per bulan
      totals[i] += validValue;
    });

    return sum;
  });

  const grandTotal = totals.reduce((a, b) => a + b, 0);

  return (
    <Page size="A4" orientation="landscape" style={styles.page}>
      {/* Header */}
      <View>
        <Text style={styles.header}>Paroki Kristus Raja Ungaran</Text>
        <Text style={styles.header}>{lingkungan}</Text>
        <Text style={styles.header}>Rincian Penerimaan Iuran</Text>
        <Text style={styles.header}>Tahun {year}</Text>
      </View>
  
      <View style={styles.emptySpace}></View>
  
      {/* Tabel */}
      <View style={styles.table}>
        {/* Header Table */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCellNo, styles.tableFontHeader]}>No</Text>
          <Text style={[styles.tableCellNama, styles.tableFontHeader]}>
            Nama Umat
          </Text>
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Total",
          ].map((header, index) => (
            <Text key={`header-${index}`} style={[styles.tableCell, styles.tableFontHeader]}>
              {header}
            </Text>
          ))}
        </View>
  
        {/* Rows */}
        {rows.map((row, index) => (
          <View key={`row-${row.id}`} style={styles.tableRow}>
            <Text style={styles.tableCellNo}>{index + 1}</Text>
            <Text style={[styles.tableCellNama, styles.tableFontNama]}>
              {row.nama}
            </Text>
            {Object.values(row.iuran).map((value, i) => {
              const isMonthName = monthMap.includes(value); // Apakah nilai adalah nama bulan
              const highlightStyle = (isNaN(value) || isMonthName || value > 10000)
                ? styles.highlightCell
                : {};
  
              return (
                <Text
                  key={`iuran-${row.id}-${i}`}
                  style={[styles.tableCell, styles.tableFontNominal, highlightStyle]}
                >
                  {value || "-"}
                </Text>
              );
            })}
            <Text style={[styles.tableCell, styles.tableFontNominal]}>
              {totalPerRow[index]}
            </Text>
          </View>
        ))}
  
        {/* Total Row */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCellTotaL}>Total</Text>
          {totals.map((total, i) => (
            <Text key={`total-${i}`} style={[styles.tableCell, styles.tableFontNominal]}>
              {total}
            </Text>
          ))}
          <Text style={[styles.tableCell, styles.tableFontNominal]}>
            {grandTotal}
          </Text>
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
            Semarang,{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Text>Disetujui Oleh</Text>
          <Text style={{ marginTop: 37 }}>Nama Ketua</Text>
          <Text>Seksi Pengurus</Text>
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
  const [selectedLingkungan, setSelectedLingkungan] = useState({
    value: "all",
    label: "Semua Lingkungan",
  });
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);
  const [error, setError] = useState(false);
  const CURRENT_YEAR = new Date().getFullYear();
  const [year, setYear] = useState(CURRENT_YEAR);

  useEffect(() => {
    const fetchLingkungan = async () => {
      try {
        const response = await services.LingkunganService.getAllLingkungan();
        const responseHistory =
          await services.HistoryService.getAllHistoryWithKeluargaContext(year);
        const filteredData = responseHistory.filter(
          (item) =>item.Keterangan === "IN" // tahun sudah di fiilter pake created date di BE
        );
        // console.log(JSON.stringify(transformedData(filteredData), null, 2));

        const filteredResponse =
          role === "ketuaWilayah" && ketuaWilayah !== 0
            ? response.filter(
                (lingkungan) => lingkungan.Wilayah.Id === ketuaWilayah
              )
            : response;

        const options = filteredResponse.map((lingkungan) => ({
          value: lingkungan.Id,
          label: lingkungan.NamaLingkungan,
        }));

        setLingkunganOptions([
          { value: "all", label: "Semua Lingkungan" },
          ...options,
        ]);
        // auto set selection and disabled it if ketua lingkungan
        if (role !== "admin" && ketuaLingkungan !== 0) {
          setSelectedLingkungan(
            options.find((option) => option.value === ketuaLingkungan)
          );
        }
        setHistory(transformedData(filteredData));
        setLoading(false);
      } catch (error) {
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLingkungan();
  }, [year]);

  const filteredData =
    selectedLingkungan?.value === "all"
      ? history
      : history.filter((row) => row.lingkungan === selectedLingkungan?.value);

  const groupedData =
    selectedLingkungan?.value === "all"
      ? lingkunganOptions
          .filter((l) => l.value !== "all")
          .map((ling) => ({
            lingkungan: ling.label,
            rows: history.filter((row) => row.lingkungan === ling.value),
          }))
      : [
          {
            lingkungan: selectedLingkungan?.label,
            rows: filteredData,
          },
        ];

  const MyDocument = (
    <Document>
      {groupedData.map(({ lingkungan, rows }) => (
        <LingkunganPage key={lingkungan} lingkungan={lingkungan} rows={rows} year={year} />
      ))}
    </Document>
  );

  if (loading) {
    return <div>Loading...</div>;
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
          <CCol xs={12} sm={12} md={12} lg={6} xl={6}>
            <Select
              options={lingkunganOptions}
              placeholder="Pilih Lingkungan"
              onChange={(option) => setSelectedLingkungan(option)}
              value={lingkunganOptions.find(
                (option) => option.value === selectedLingkungan.value
              )}
              isDisabled={role === "ketuaLingkungan"}
              styles={{
                container: (base) => ({
                  ...base,
                  width: "100%",
                  marginBottom: "35px",
                  borderColor: "blue",
                }),
                control: (base) => ({
                  ...base,
                  backgroundColor: "white",
                  borderColor: "#ced4da",
                  borderWidth: "1px",
                  borderRadius: "0.375rem",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 1050,
                }),
              }}
            />
          </CCol>
        </CRow>

        {/* PDF Viewer */}
        {selectedLingkungan && (
          <PDFViewer style={{ width: "100%", height: "600px" }}>
            {MyDocument}
          </PDFViewer>
        )}
      </CCardBody>
    </CCard>
  );
};
export default ExportView;
