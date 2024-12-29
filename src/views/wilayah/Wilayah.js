import React, { useEffect, useState } from "react";
import GeneralTables from "../base/tables/GeneralTables";
import services from "../../services";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";

const Wilayah = () => {
  const [wilayah, setWilayah] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const roleRedux = useSelector((state) => state.role.role);
  const { handleLogout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await services.WilayahService.getAllWilayah();
        setWilayah(result);
      } catch (error) {
        console.error("Error fetching wilayah:", error);
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
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error) return <p>Error fetching data.</p>;

  //to make each row clickable
  const handleRowClick = (row) => {
    navigate(`/wilayah/${row.Id}`, { state: { wilayah: row } });
  };

  const Add_Wilayah = () => {
    navigate("/wilayah/add");
  };

  const navigateContext = [Add_Wilayah];

  const columns = [
    {
      name: "No",
      selector: (row, index) => index + 1,
      width: "60px",
    },
    {
      name: "Kode Wilayah",
      selector: (row) => row.KodeWilayah,
      sortable: true,
    },
    {
      name: "Nama Wilayah",
      selector: (row) => row.NamaWilayah,
      sortable: true,
    },
  ];

  return (
    <GeneralTables
      columns={columns}
      rows={wilayah}
      filterKeys={["KodeWilayah", "NamaWilayah"]}
      onRowClicked={roleRedux === "admin" ? handleRowClick : () => {}}
      navigateContext={roleRedux === "admin" ? navigateContext : []}
    />
  );
};

export default Wilayah;
