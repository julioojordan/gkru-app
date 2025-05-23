import React, { useEffect, useState } from "react";
import GeneralTables from "../base/tables/GeneralTables";
import services from "../../services";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";

const Lingkungan = () => {
  const [lingkungan, setLingkungan] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const roleRedux = useSelector((state) => state.role.role);
  const { handleLogout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await services.LingkunganService.getAllLingkungan();
        setLingkungan(result);
      } catch (error) {
        console.error("Error fetching lingkungan:", error);
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error) return <p>Error fetching data.</p>;

  // to make wilayah clickable
  const handleCellClick = (row) => {
    if (row.Wilayah && row.Wilayah.Id) {
      navigate(`/wilayah/${row.Wilayah.Id}`, {
        state: { wilayah: row.Wilayah },
      });
    }
  };

  //to make each row clickable
  const handleRowClick = (row) => {
    navigate(`/lingkungan/${row.Id}`, { state: { lingkungan: row } });
  };

  const Add_Lingkungan = () => {
    navigate("/lingkungan/add");
  };

  const navigateContext = [Add_Lingkungan];

  const columns = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Kode Lingkungan",
      selector: (row) => row.KodeLingkungan,
      sortable: true,
    },
    {
      name: "Nama Lingkungan",
      selector: (row) => row.NamaLingkungan,
      sortable: true,
    },
    {
      name: "Wilayah",
      cell: (row) => (
        <span
          onClick={
            roleRedux === "admin" ? () => handleCellClick(row) : () => {}
          }
          style={{ cursor: "pointer" }}
        >
          {row.Wilayah?.NamaWilayah}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <GeneralTables
      columns={columns}
      rows={lingkungan}
      filterKeys={["KodeLingkungan", "NamaLingkungan", "Wilayah.NamaWilayah"]}
      onRowClicked={roleRedux === "admin" ? handleRowClick : () => {}}
      navigateContext={roleRedux === "admin" ? navigateContext : []}
      buttonName="Tambah Lingkungan"
    />
  );
};

export default Lingkungan;
