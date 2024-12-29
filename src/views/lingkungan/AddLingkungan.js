import React, { useState, useEffect } from "react";
import {
  CForm,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import services from "../../services";
import Swal from "sweetalert2";
import Select from "react-select";
import { useAuth } from "../../hooks/useAuth";

const AddLingkungan = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const data = {
    NamaLingkungan: "",
    KodeLingkungan: "",
    Wilayah: "",
  };

  const [formData, setFormData] = useState(data);
  const [wilayahOptions, setWilayahOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWilayah = async () => {
      setLoading(true);
      try {
        const response = await services.WilayahService.getAllWilayah();
        const options = response.map((wilayah) => ({
          value: wilayah.Id,
          label: wilayah.NamaWilayah,
        }));
        setWilayahOptions(options);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await handleLogout();
        }
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

  const handleSelectChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      Wilayah: selectedOption ? selectedOption.value : "", // Menyimpan value yang dipilih
    }));
  };

  const handleBack = () => {
    navigate(-1);
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
      const response = await services.LingkunganService.addLingkungan(formData);

      await Swal.fire({
        title: "Success!",
        text: "Data has been added successfully.",
        icon: "success",
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await handleLogout();
      } else {
        await Swal.fire({
          title: "Error!",
          text: "There was an error adding the data.",
          icon: "error",
        });
      }
    } finally {
      Swal.close();
      setFormData(data);
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
        <CCardBody>
          <h5>Detail Lingkungan</h5>
          <CForm onSubmit={handleSubmit}>
            {/* Input Id Lingkungan */}

            <CFormInput
              type="text"
              id="namaLingkungan"
              floatingLabel="Nama Lingkungan"
              name="NamaLingkungan"
              value={formData.NamaLingkungan}
              onChange={handleChange}
              className="mb-3"
              required
            />

            <CFormInput
              type="text"
              id="kodeLingkungan"
              floatingLabel="Kode Lingkungan"
              name="KodeLingkungan"
              value={formData.KodeLingkungan}
              onChange={handleChange}
              className="mb-3"
              required
            />

            <Select
              options={wilayahOptions}
              value={wilayahOptions.find(
                (option) => option.value === formData.Wilayah
              )}
              onChange={handleSelectChange}
              required
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
      )}
    </CCard>
  );
};

export default AddLingkungan;
