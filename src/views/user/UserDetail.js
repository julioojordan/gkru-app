import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CFormSelect,
} from "@coreui/react";
import { useNavigate, useLocation } from "react-router-dom";
import services from "../../services";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Select from "react-select";
import { updateUser, setRole } from "../../actions";
import { useAuth } from '../../hooks/useAuth';

const UserDetail = () => {
  const { handleLogout } = useAuth();
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

  useEffect(() => {
    const checkCurrentRole = () => {
      if (isSelf){
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
      }else{
        if (row.KetuaLingkungan == 0 && row.KetuaWilayah == 0){ //admin
          setIsAdmin(true);
          setIsKetuaWilayah(false);
          setIsKetuaLingkungan(false);
          setCurrentRole('admin')
        }
        if (row.KetuaLingkungan != 0 && row.KetuaWilayah != 0){ // ketua lingkungan
          setIsAdmin(false);
          setIsKetuaWilayah(false);
          setIsKetuaLingkungan(true);
          setCurrentRole('ketuaLingkungan')
        }
        if (row.KetuaLingkungan == 0 && row.KetuaWilayah != 0){  // ketua wilayah
          setIsAdmin(false);
          setIsKetuaWilayah(true);
          setIsKetuaLingkungan(false);
          setCurrentRole('ketuaWilayah')
        }
      }
    }
    if (authRedux) {
      const data = {
        Username: !row ? authRedux.username : row.Username,
        Lingkungan: !row ? authRedux.ketuaLingkungan : row.KetuaLingkungan,
        Wilayah: !row ? authRedux.ketuaWilayah : row.KetuaWilayah,
        Password: ""
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
        console.error("Error fetching wilayah & lingkungan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWilayah();
  }, []);

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
    const idWilayah = lingkungan ? lingkungan
      .find( (item) => item.Id === selectedOption.value).Wilayah.Id : ""
    setFormData((prevData) => ({
      ...prevData,
      Lingkungan: selectedOption ? selectedOption.value : "", // Menyimpan value yang dipilih
      Wilayah: idWilayah
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
    setCurrentRole(selectedRole)
    setIsKetuaLingkungan(true);
    setIsKetuaWilayah(false);
    setIsAdmin(false);
  };

  const handleIsKetuaWilayah = (selectedRole) => {
    setCurrentRole(selectedRole)
    setIsKetuaLingkungan(false);
    setIsKetuaWilayah(true);
    setIsAdmin(false);
  };

  const handleIsAdmin = (selectedRole) => {
    setCurrentRole(selectedRole)
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
      onBeforeOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const data = {
        Id: !row ? authRedux.id : row.Id,
        Username: formData.Username,
        KetuaLingkungan: !isKetuaLingkungan ? 0 : formData.Lingkungan,
        KetuaWilayah: isKetuaWilayah || isKetuaLingkungan ? formData.Wilayah : 0,
        UpdatedBy: authRedux.id,
      };
      const response = await services.UserService.updateUser(data);
      if (isSelf) {
        dispatch(
          updateUser({
            username: formData.Username,
            ketuaLingkungan: !isKetuaLingkungan ? 0 : formData.Lingkungan,
            ketuaWilayah: isKetuaWilayah || isKetuaLingkungan ? formData.Wilayah : 0,
          })
        );
        dispatch(setRole(currentRole));
      }
      const newFormData = {
        Username: response.Username,
        Lingkungan: response.KetuaLingkungan,
        Wilayah: response.KetuaWilayah,
        Password: ""
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      await Swal.fire({
        title: "Success!",
        text: "Data has been updated successfully.",
        icon: "success",
      });
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
    }
  };

  return (
    <CCard>
      {loading ? (
        <div className="shimmer">Loading...</div>
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

              {!isKetuaLingkungan && !isAdmin && (
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

              {!isKetuaWilayah && !isAdmin && (
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

              <CButton
                color="secondary"
                onClick={handleBack}
                className="me-2"
                style={{
                  width: "200px",
                  height: "100%",
                  fontSize: "0.9rem",
                  padding: "10px 0",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  transition: "0.3s",
                }}
              >
                Cancel
              </CButton>

              {/* Tombol Submit */}
              <CButton
                color="primary"
                type="submit"
                style={{
                  width: "200px",
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
            </CForm>
          </CCardBody>
        </>
      )}
    </CCard>
  );
};

export default UserDetail;
