import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CFormSelect,
  CCardSubtitle,
  CRow,
  CCol,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import services from "../../services";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { updateUser, setRole } from "../../actions";
import { useAuth } from "../../hooks/useAuth";
import { useRedirect } from "../../hooks/useRedirect";
import useHandleBack from "../../hooks/useHandleBack";
import { multiSelectStyles } from "../base/select/selectStyle";

const UserDetail = () => {
  const localTheme = useSelector((state) => state.theme.theme);
  const { handleLogout } = useAuth();
  const { redirectToBefore } = useRedirect();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { isSelf, row } = location.state || {};

  const authRedux = useSelector((state) => state.auth);
  const roleRedux = useSelector((state) => state.role.role);

  const [formData, setFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState({});
  const [wilayahOptions, setWilayahOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lingkunganOptions, setLingkunganOptions] = useState([]);
  const [lingkungan, setLingkungan] = useState([]);
  const [currentRole, setCurrentRole] = useState("");
  const [isKetuaWilayah, setIsKetuaWilayah] = useState(false);
  const [isKetuaLingkungan, setIsKetuaLingkungan] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(false);

  const [isEditable, setIsEditable] = useState(false);

  useHandleBack("/user");
  useEffect(() => {
    const checkCurrentRole = () => {
      if (isSelf) {
        setCurrentRole(roleRedux);
        if (roleRedux === "admin") {
          setIsAdmin(true);
          setIsKetuaWilayah(false);
          setIsKetuaLingkungan(false);
        }
        if (roleRedux === "ketuaLingkungan") {
          setIsAdmin(false);
          setIsKetuaWilayah(false);
          setIsKetuaLingkungan(true);
        }
        if (roleRedux === "ketuaWilayah") {
          setIsAdmin(false);
          setIsKetuaWilayah(true);
          setIsKetuaLingkungan(false);
        }
      } else {
        if (row.KetuaLingkungan == 0 && row.KetuaWilayah == 0) {
          //admin
          setIsAdmin(true);
          setIsKetuaWilayah(false);
          setIsKetuaLingkungan(false);
          setCurrentRole("admin");
        }
        if (row.KetuaLingkungan != 0 && row.KetuaWilayah != 0) {
          // ketua lingkungan
          setIsAdmin(false);
          setIsKetuaWilayah(false);
          setIsKetuaLingkungan(true);
          setCurrentRole("ketuaLingkungan");
        }
        if (row.KetuaLingkungan == 0 && row.KetuaWilayah != 0) {
          // ketua wilayah
          setIsAdmin(false);
          setIsKetuaWilayah(true);
          setIsKetuaLingkungan(false);
          setCurrentRole("ketuaWilayah");
        }
      }
    };
    if (authRedux) {
      if (!row && !isSelf) {
        redirectToBefore();
        return;
      }
      const data = {
        Username: !row ? authRedux.username : row.Username,
        Lingkungan: !row ? authRedux.ketuaLingkungan : row.KetuaLingkungan,
        Wilayah: !row ? authRedux.ketuaWilayah : row.KetuaWilayah,
        Password: "",
      };
      setFormData(data);
      setInitialFormData(data);
      checkCurrentRole();
    }
  }, [authRedux, roleRedux]);

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

  const handleBack = () => {
    navigate("/user");
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Apakah Anda yakin ?",
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const loadingAlert = Swal.fire({
          title: "Loading...",
          text: "Please wait...",
          allowOutsideClick: false,
        });
        const response = await services.UserService.deleteUser(row.Id);

        Swal.fire({
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(navigate("/user"));
      }
    } catch (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
      });
    }
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
        Id: !row ? authRedux.id : row.Id,
        Username: formData.Username,
        KetuaLingkungan: !isKetuaLingkungan ? 0 : formData.Lingkungan,
        KetuaWilayah:
          isKetuaWilayah || isKetuaLingkungan ? formData.Wilayah : 0,
        UpdatedBy: authRedux.id,
        Password: formData.Password
      };
      const response = await services.UserService.updateUser(data);
      if (isSelf) {
        dispatch(
          updateUser({
            username: formData.Username,
            ketuaLingkungan: !isKetuaLingkungan ? 0 : formData.Lingkungan,
            ketuaWilayah:
              isKetuaWilayah || isKetuaLingkungan ? formData.Wilayah : 0,
          })
        );
        dispatch(setRole(currentRole));
      }
      const newFormData = {
        Username: response.Username,
        Lingkungan: response.KetuaLingkungan,
        Wilayah: response.KetuaWilayah,
        Password: "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      await Swal.fire({
        title: "Success!",
        text: "Data has been updated successfully.",
        icon: "success",
      }).then(
        navigate(`/user/${row?.Id ?? authRedux.id}`, {
          state: {
            isSelf,
            row: {
              Username: response.Username,
              KetuaLingkungan: response.KetuaLingkungan,
              KetuaWilayah: response.KetuaWilayah,
              Password: "",
            },
          },
        })
      );
    } catch (error) {
      setFormData(initialFormData);
      setTimeout(() => {
        handleSelectWilayahChange(
          wilayahOptions.find(
            (option) => option.value === initialFormData.Wilayah
          )
        );
        handleSelectLingkunganChange(
          lingkunganOptions.find(
            (option) => option.value === initialFormData.Lingkungan
          )
        );
      }, 0);

      if (error.response && error.response.status === 401) {
        await handleLogout();
      } else {
        await Swal.fire({
          title: "Error!",
          text: "There was an error updating the data.",
          icon: "error",
        });
      }
    } finally {
      Swal.close();
      setIsEditable(false);
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
            <div className="d-flex justify-content-between align-items-center">
              <CCardSubtitle
                className="mb-2 text-body-secondary"
                style={{ marginLeft: "3px" }}
              >
                Profile Setting
              </CCardSubtitle>
              {!isSelf && (
                <CButton
                  color="danger"
                  onClick={() => {
                    handleDelete();
                  }}
                  style={{
                    fontSize: "16px",
                    lineHeight: "1",
                    padding: "0.375rem 0.75rem",
                    borderRadius: "0.375rem",
                    marginBottom: "9px",
                    color: "white",
                    fontWeight: "bold",
                    transition: "0.3s",
                  }}
                >
                  Delete
                </CButton>
              )}
            </div>
            <CForm onSubmit={handleSubmit}>
              <CFormSelect
                id="Type"
                name="Type"
                value={currentRole}
                onChange={handleTypeChange}
                required
                floatingClassName="mb-3"
                disabled={!isEditable || roleRedux !== "admin"}
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
                disabled={!isEditable || roleRedux !== "admin"}
                required
              />

              {!isKetuaLingkungan && !isAdmin && (
                <Select
                  options={wilayahOptions}
                  value={wilayahOptions.find(
                    (option) => option.value === formData.Wilayah
                  )}
                  onChange={handleSelectWilayahChange}
                  placeholder="Select Wilayah"
                  isSearchable
                  isDisabled={!isEditable || roleRedux !== "admin"}
                  styles={multiSelectStyles(localTheme)}
                  required
                />
              )}

              {!isKetuaWilayah && !isAdmin && (
                <Select
                  options={lingkunganOptions}
                  value={lingkunganOptions.find(
                    (option) => option.value === formData.Lingkungan
                  )} // Gunakan formData untuk value
                  onChange={handleSelectLingkunganChange}
                  placeholder="Select Lingkungan"
                  isSearchable
                  isDisabled={!isEditable || roleRedux !== "admin"}
                  styles={multiSelectStyles(localTheme)}
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
                disabled={!isEditable}
                required
              />

              <CRow className="gy-3">
                {/* Tombol Back */}
                <CCol xs="12" md="4">
                  <CButton
                    color="secondary"
                    onClick={handleBack}
                    className="w-100"
                    style={{
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Back
                  </CButton>
                </CCol>

                {/* Tombol Edit */}
                <CCol xs="12" md="4">
                  <CButton
                    color="info"
                    onClick={handleEdit}
                    className="w-100"
                    style={{
                      fontSize: "0.9rem",
                      padding: "10px 0",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      transition: "0.3s",
                    }}
                  >
                    Edit
                  </CButton>
                </CCol>

                {/* Tombol Submit */}
                <CCol xs="12" md="4">
                  <CButton
                    color="primary"
                    type="submit"
                    disabled={!isEditable}
                    className="w-100"
                    style={{
                      fontSize: "0.9rem",
                      padding: "10px 0",
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

export default UserDetail;
