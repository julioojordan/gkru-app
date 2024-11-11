import React, { useEffect, useState } from "react";
import GeneralTables from "../base/tables/GeneralTables";
import services from "../../services";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Lingkungan = () => {
  const [lingkungan, setLingkungan] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const roleRedux = useSelector((state) => state.role.role);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await services.LingkunganService.getAllLingkungan();
        setLingkungan(result);
      } catch (error) {
        console.error("Error fetching lingkungan:", error);
        setError(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data.</p>;

  // to make wilayah clickable
  const handleCellClick = (row) => {
    if (row.Wilayah && row.Wilayah.Id) {
      navigate(`/wilayah/${row.Wilayah.Id}`, { state: { wilayah: row.Wilayah } });
    }
  };

  //to make each row clickable
  const handleRowClick = (row) => {
    navigate(`/lingkungan/${row.Id}`, { state: { lingkungan: row } });
  };

  const AddLingkungan = () => {
    navigate("/lingkungan/add");
  };

  const AddWilayah = () => {
    navigate("/wilayah/add");
  };
  const navigateContext = [AddLingkungan, AddWilayah]

  const columns = [
    {
        name: 'No',
        selector: (row, index) => index + 1,
        width: '50px',
    },
    {
      name: 'Kode Lingkungan',
      selector: row => row.KodeLingkungan,
      sortable: true,
    },
    {
      name: 'Nama Lingkungan',
      selector: row => row.NamaLingkungan,
      sortable: true,
    },
    {
      name: 'Wilayah',
      cell: (row) => (
        <span
          onClick={roleRedux === 'admin' ? () => handleCellClick(row) : () => {}}
          style={{ cursor: 'pointer' }}
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
      filterKeys={['KodeLingkungan', 'NamaLingkungan']}
      onRowClicked={roleRedux === 'admin' ? handleRowClick : () => {}}
      navigateContext={roleRedux === 'admin' ? navigateContext : []}
    />
  );
};

export default Lingkungan;
