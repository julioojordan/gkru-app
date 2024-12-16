import React, { useEffect, useState } from "react";
import { CCard, CCardBody, CRow, CCol } from "@coreui/react";
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
          iuranDate: {
            jan: "",
            feb: "",
            mar: "",
            apr: "",
            may: "",
            jun: "",
            jul: "",
            aug: "",
            sep: "",
            oct: "",
            nov: "",
            dec: "",
          },
        };
      }
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
      acc[IdKeluarga].iuran[monthMap[Bulan - 1]] += Nominal;
      acc[IdKeluarga].iuranDate[monthMap[Bulan - 1]] =
        CreatedDate.split("T")[0];
      return acc;
    }, {})
  );

//step 2 transform data
const transformedData2 = (data) => {
  return data.map((item) => {
    const newIuran = { ...item.iuran }; // Salin iuran asli
    const paymentMap = {}; // Map untuk melacak akumulasi pembayaran per bulan

    // Iterasi setiap bulan dalam iuranDate
    for (const month in item.iuranDate) {
      const paymentDate = item.iuranDate[month];
      if (paymentDate) {
        const paymentMonth = new Date(paymentDate)
          .toLocaleString("en-US", { month: "short" })
          .toLowerCase();

        // Tambahkan nilai ke bulan pembayaran di map
        if (!paymentMap[paymentMonth]) {
          paymentMap[paymentMonth] = 0;
        }
        paymentMap[paymentMonth] += item.iuran[month];

        // Ubah nilai bulan asal ke nama bulan pembayaran
        newIuran[month] = paymentMonth;
      }
    }

    // Update iuran untuk akumulasi pada bulan pembayaran
    for (const month in paymentMap) {
      newIuran[month] = paymentMap[month];
    }

    // Hapus iuranDate dan return data baru
    return {
      id: item.id,
      nama: item.nama,
      lingkungan: item.lingkungan,
      iuran: newIuran,
    };
  });
};

// Style untuk PDF
const styles = StyleSheet.create({
  page: { padding: 30, flexDirection: "column", backgroundColor: "#FFFFFF" },
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
});

const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];



// Komponen halaman PDF untuk setiap lingkungan
const LingkunganPage = ({ lingkungan, rows }) => {
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
        <Text style={styles.header}>{`Lingkungan ${lingkungan}`}</Text>
        <Text style={styles.header}>Rincian Penerimaan Iuran</Text>
        <Text style={styles.header}>Tahun {new Date().getFullYear()}</Text>
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
          ].map((header, i) => (
            <Text key={i} style={[styles.tableCell, styles.tableFontHeader]}>
              {header}
            </Text>
          ))}
        </View>
        {/* Rows */}{" "}
        {rows.map((row, index) => (
          <View key={row.id} style={styles.tableRow}>
            <Text style={styles.tableCellNo}>{index + 1}</Text>
            <Text style={[styles.tableCellNama, styles.tableFontNama]}>
              {row.nama}
            </Text>
            {Object.values(row.iuran).map((value, i) => {
              // Cek apakah nilai bukan angka dan apakah itu nama bulan
              const isMonthName = monthNames.includes(value); // Cek apakah value adalah nama bulan
              let backgroundColor = "transparent";
              if (isNaN(value) || isMonthName || value > 10000){
                backgroundColor = "#FFC300"
              }

              return (
                <Text
                  key={i}
                  style={[
                    styles.tableCell,
                    styles.tableFontNominal,
                    { backgroundColor },
                  ]}
                >
                  {value || "-"}{" "}
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
            <Text key={i} style={[styles.tableCell, styles.tableFontNominal]}>
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
const ExportView = ({ role, ketuaWilayah }) => {
  // TO DO diambil dari redux aja ntar ya
  const { handleLogout } = useAuth();
  const [selectedLingkungan, setSelectedLingkungan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLingkungan = async () => {
      try {
        const response = await services.LingkunganService.getAllLingkungan();
        const responseHistory =
          await services.HistoryService.getAllHistoryWithKeluargaContext();
        const filteredData = responseHistory.filter(
          (item) => item.Tahun === 2024 && item.Keterangan === "IN"
        ); // TO DO ganti berdasarkan created date aja
        // console.log({responseHistory})
        // console.log({filteredData})
        // console.log(JSON.stringify(responseHistory, null, 2));
        // console.log(transformedData(filteredData))
        // console.log(JSON.stringify(transformedData(filteredData), null, 2));
        // console.log(JSON.stringify(transformedData2(transformedData(filteredData)), null, 2));

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
        setHistory(transformedData2(transformedData(filteredData))); // TO DO perlu add tombol tahun, jadi sebelum di proses Histoory ini simpan data dulu di state dan akan di filter setelah pilih tahun baru di proses pake logic ini ya
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
  }, [role, ketuaWilayah]);

  console.log({ history });
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
            rows: history.filter((row) => row.lingkungan === ling.label),
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
        <LingkunganPage key={lingkungan} lingkungan={lingkungan} rows={rows} />
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
          <CCol>
            <Select
              options={lingkunganOptions}
              placeholder="Pilih Lingkungan"
              onChange={(option) => setSelectedLingkungan(option)}
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
