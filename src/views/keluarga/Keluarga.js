import React, { useEffect, useState } from "react";
import ExpandableTables from "../base/tables/ExpandableTables";
import services from "../../services";
import { useNavigate  } from "react-router-dom";

const Keluarga = () => {
  const navigate = useNavigate();
  const [keluargaData, setKeluargaData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await services.KeluargaService.getAllKeluarga();
        setKeluargaData(result);
      } catch (error) {
        console.error("Error fetching Keluarga data:", error);
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data.</p>;

  const handleRowClick = (row) => {
    navigate(`/keluarga/${row.Id}`, { state: { data: row } });
  };

  const columns = [
    {
      name: 'Nomor Keluarga',
      selector: row => row.Nomor,
      sortable: true,
    },
    {
      name: 'Kepala Keluarga',
      selector: row => row.KepalaKeluarga.NamaLengkap,
      sortable: true,
    },
    {
      name: 'Alamat',
      selector: row => row.Alamat,
      sortable: true,
    }
  ];

  return (
    <ExpandableTables
      columns={columns}
      rows={keluargaData}
      filterKeys={['Nomor', 'KepalaKeluarga.NamaLengkap', 'Alamat']}
      onRowClicked={handleRowClick}
    />
  );
};

export default Keluarga;
