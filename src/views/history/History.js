import React, { useEffect, useState } from "react";
import { useNavigate  } from "react-router-dom";
import GeneralTables from "../base/tables/GeneralTables";
import services from "../../services";
import { CBadge } from '@coreui/react'

const getBadge = (keterangan) => {
  return keterangan === "IN" ? (
    <CBadge color="success">IN</CBadge>
  ) : (
    <CBadge color="danger">OUT</CBadge>
  );
};

const History = () => {
  const navigate = useNavigate();
  const [History, setHistory] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await services.HistoryService.getAllHistory();
          setHistory(result);
        } catch (error) {
          console.error("Error fetching History:", error);
          setError(true);
        }
        setLoading(false);
      };

      fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data.</p>;

  const handleRowClick = (row) => {
    navigate(`/history/${row.Id}`);
  };

  const columns = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Id",
      selector: (row) => row.Id,
      sortable: true,
    },
    {
      name: "In Out",
      selector: (row) => row.Keterangan,
      sortable: true,
      cell: row => getBadge(row.Keterangan),
    },
    {
      name: "Sub Keterangan",
      selector: (row) => row.SubKeterangan,
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {row.SubKeterangan}
        </div>
      ),
    },
    {
      name: "Nominal",
      selector: (row) => row.Nominal,
      sortable: true,
    },
    {
      name: "Lingkungan",
      selector: (row) =>
        `${row.Lingkungan.NamaLingkungan} (${row.Lingkungan.KodeLingkungan})`,
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {row.Lingkungan.NamaLingkungan} ({row.Lingkungan.KodeLingkungan})
        </div>
      ),
    },
    {
      name: "Wilayah",
      selector: (row) =>
        `${row.Wilayah.NamaWilayah} (${row.Wilayah.KodeWilayah})`,
      sortable: true,
      cell: (row) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {row.Wilayah.NamaWilayah} ({row.Wilayah.KodeWilayah})
        </div>
      ),
    },
  ];

  return (
    <GeneralTables
      columns={columns}
      rows={History}
      filterKeys={["Id", "Historyname", "KetuaLingkungan", "KetuaWilayah"]}
      onRowClicked={handleRowClick}
    />
  );
};

export default History;
