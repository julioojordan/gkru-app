import React, { useEffect, useState } from "react";
import GeneralTables from "../base/tables/GeneralTables";
import services from "../../services";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Wilayah = () => {
  const [wilayah, setWilayah] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const roleRedux = useSelector((state) => state.role.role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await services.WilayahService.getAllWilayah();
        setWilayah(result);
      } catch (error) {
        console.error("Error fetching wilayah:", error);
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data.</p>;

  //to make each row clickable
  const handleRowClick = (row) => {
    navigate(`/wilayah/${row.Id}`, { state: { wilayah: row } });
  };

  const Add_Wilayah = () => {
    navigate("/wilayah/add");
  };

  const navigateContext = [Add_Wilayah]

  const columns = [
    {
        name: 'No',
        selector: (row, index) => index + 1,
        width: '60px',
    },
    {
      name: 'Kode Wilayah',
      selector: row => row.KodeWilayah,
      sortable: true,
    },
    {
      name: 'Nama Wilayah',
      selector: row => row.NamaWilayah,
      sortable: true,
    },
  ];

  return (
    <GeneralTables
      columns={columns}
      rows={wilayah}
      filterKeys={['KodeWilayah', 'NamaWilayah']}
      onRowClicked={roleRedux === 'admin' ? handleRowClick : () => {}}
      navigateContext={roleRedux === 'admin' ? navigateContext : []}
    />
  );
};

export default Wilayah;
