import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CFormSelect,
  CRow,
  CCol,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import services from "../../services";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { useAuth } from "../../hooks/useAuth";

const AddUser = () => {
  const navigate = useNavigate();

  const authRedux = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({});
  const [wilayahOptions, setWilayahOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);
  const [lingkungan, setLingkungan] = useState([]);
  const [currentRole, setCurrentRole] = useState("");
  const [isKetuaWilayah, setIsKetuaWilayah] = useState(false);
  const [isKetuaLingkungan, setIsKetuaLingkungan] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { handleLogout } = useAuth();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (authRedux) {
      const data = {
        Username: "",
        Lingkungan: "",
        Wilayah: "",
        Password: "",
      };
      setFormData(data);
    }
  }, [authRedux]);

  useEffect(() => {
    const fetchWilayah = async () => {
      setLoading(true);
      try {
        const response = await services.WilayahService.getAllWilayah();
        const lingkunganResponse =
          await services.LingkunganService.getAllLingkungan();
        const options = response.map((wilayah) => ({
          value: wilayah.Id,
          label: `${wilayah.KodeWilayah} - ${wilayah.NamaWilayah}`,
        }));
        const options2 = lingkunganResponse.map((lingkungan) => ({
          value: lingkungan.Id,
          label: `${lingkungan.KodeLingkungan} - ${lingkungan.NamaLingkungan}`,
        }));
        setWilayahOptions(options);
        setLingkungan(lingkunganResponse);
        setLingkunganOptions(options2);
      } catch (error) {
        console.error("Error fetching wilayah & lingkungan:", error);
        setError(true);
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWilayah();
  }, []);

  if (error) return <p>Error fetching data.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectWilayahChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      Wilayah: selectedOption ? selectedOption.value : "", // Menyimpan value yang dipilih
    }));
  };

  const handleSelectLingkunganChange = (selectedOption) => {
    if (!selectedOption) return;
    const idWilayah = lingkungan
      ? lingkungan.find((item) => item.Id === selectedOption.value).Wilayah.Id
      : "";
    setFormData((prevData) => ({
      ...prevData,
      Lingkungan: selectedOption ? selectedOption.value : "", // Menyimpan value yang dipilih
      Wilayah: idWilayah,
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTypeChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      Wilayah: "",
      Lingkungan: "",
    }));
    const selectedRole = event.target.value;
    setCurrentRole(selectedRole);
    if (selectedRole === "admin") {
      handleIsAdmin(selectedRole);
    } else if (selectedRole === "ketuaLingkungan") {
      handleIsKetuaLingkungan(selectedRole);
    } else if (selectedRole === "ketuaWilayah") {
      handleIsKetuaWilayah(selectedRole);
    }
  };

  const handleIsKetuaLingkungan = (selectedRole) => {
    setCurrentRole(selectedRole);
    setIsKetuaLingkungan(true);
    setIsKetuaWilayah(false);
    setIsAdmin(false);
  };

  const handleIsKetuaWilayah = (selectedRole) => {
    setCurrentRole(selectedRole);
    setIsKetuaLingkungan(false);
    setIsKetuaWilayah(true);
    setIsAdmin(false);
  };

  const handleIsAdmin = (selectedRole) => {
    setCurrentRole(selectedRole);
    setIsKetuaLingkungan(false);
    setIsKetuaWilayah(false);
    setIsAdmin(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingAlert = Swal.fire({
      title: "Loading...",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Pindahkan showLoading ke didOpen untuk konsistensi
      },
    });

    try {
      const data = {
        Username: formData.Username,
        Password: formData.Password,
        KetuaLingkungan: !isKetuaLingkungan ? 0 : formData.Lingkungan,
        KetuaWilayah:
          isKetuaWilayah || isKetuaLingkungan ? formData.Wilayah : 0,
        UpdatedBy: authRedux.id,
        CreatedBy: authRedux.id,
      };
      const response = await services.UserService.addUser(data);
      await Swal.fire({
        title: "Success!",
        text: "Data has been Added successfully.",
        icon: "success",
      }).then(() => {
        navigate(`/user`);
      });
    } catch (error) {
      await Swal.fire({
        title: "Error!",
        text: "There was an error addind the data.",
        icon: "error",
      });
    } finally {
      Swal.close();
    }
  };

  return (
    <CCard>
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <CCardBody>
            <h5>Detail User</h5>
            <CForm onSubmit={handleSubmit}>
              <CFormSelect
                id="Type"
                name="Type"
                value={currentRole}
                onChange={handleTypeChange}
                required
                floatingClassName="mb-3"
                floatingLabel="Status"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="ketuaLingkungan">Ketua Lingkungan</option>
                <option value="ketuaWilayah">Ketua Wilayah</option>
              </CFormSelect>
              <CFormInput
                type="text"
                id="Username"
                floatingLabel="Username"
                name="Username"
                value={formData.Username}
                onChange={handleChange}
                className="mb-3"
                required
              />

              {!isKetuaLingkungan && !isAdmin && currentRole !== "" && (
                <Select
                  options={wilayahOptions}
                  value={wilayahOptions.find(
                    (option) => option.value === formData.Wilayah
                  )}
                  onChange={handleSelectWilayahChange}
                  placeholder="Select Wilayah"
                  isSearchable
                  styles={{
                    container: (base) => ({
                      ...base,
                      width: "100%",
                      marginBottom: "1rem",
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
                  required
                />
              )}

              {!isKetuaWilayah && !isAdmin && currentRole !== "" && (
                <Select
                  options={lingkunganOptions}
                  value={lingkunganOptions.find(
                    (option) => option.value === formData.Lingkungan
                  )} // Gunakan formData untuk value
                  onChange={handleSelectLingkunganChange}
                  placeholder="Select Lingkungan"
                  isSearchable
                  styles={{
                    container: (base) => ({
                      ...base,
                      width: "100%",
                      marginBottom: "1rem",
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
                  required
                />
              )}

              <CFormInput
                type="password"
                id="Password"
                name="Password"
                floatingLabel="Password"
                value={formData.Password}
                onChange={handleChange}
                className="mb-3"
                required
              />

              <CRow className="gy-3">
                <CCol xs="12" md="6">
                  <CButton
                    color="secondary"
                    onClick={handleBack}
                    className="w-100"
                    style={{
                      height: "100%",
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Back
                  </CButton>
                </CCol>
                <CCol xs="12" md="6">
                  {/* Tombol Submit */}
                  <CButton
                    color="primary"
                    type="submit"
                    className="w-100"
                    style={{
                      height: "100%",
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Submit
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </>
      )}
    </CCard>
  );
};

export default AddUser;
