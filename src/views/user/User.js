import React, { useEffect, useState } from "react";
import GeneralTables from "../base/tables/GeneralTables";
import services from "../../services";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";

const User = () => {
  const [User, setUser] = useState([]);
  const [error, setError] = useState(false);
  const { handleLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authRedux = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await services.UserService.getAllUser();
        setUser(result);
      } catch (error) {
        console.error("Error fetching User:", error);
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const Add_User = () => {
    navigate("/user/add");
  };

  const handleRowClick = (row) => {
    const isSelf = authRedux.id == row.Id ? true : false;
    navigate(`/user/${row.Id}`, { state: { isSelf, row } });
  };

  const navigateContext = [Add_User];

  if (loading)
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  if (error) return <p>Error fetching data.</p>;

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
      name: "Username",
      selector: (row) => row.Username,
      sortable: true,
    },
    {
      name: "Ketua Lingkungan",
      selector: (row) => row.KetuaLingkungan,
      sortable: true,
    },
    {
      name: "Ketua Wilayah",
      selector: (row) => row.KetuaWilayah,
      sortable: true,
    },
  ];

  return (
    <GeneralTables
      columns={columns}
      rows={User}
      filterKeys={["Id", "Username", "KetuaLingkungan", "KetuaWilayah"]}
      navigateContext={navigateContext}
      onRowClicked={handleRowClick}
      buttonName="Tambah Anggota"
    />
  );
};

export default User;
