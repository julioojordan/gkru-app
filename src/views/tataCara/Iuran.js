import React from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CImage,
} from "@coreui/react";
import "./TutorialPage.css";
import formOut from "../../assets/images/out1.PNG";
import formOut2 from "../../assets/images/out2.PNG";
import jumlahKeluargaKurang from "../../assets/images/jumlah-keluarga-kurang.PNG";
import keluargaTidakValid from "../../assets/images/nominal-dan-keluarga-tidak-valid.PNG";
import nominalTidakValid from "../../assets/images/nominal-tidak-valid.PNG";
import successIuran from "../../assets/images/success-add-iuran.PNG";

const TutorialPageIuran = () => {
  return (
    <CContainer className="tutorial-container">
      <CCard>
        <CCardHeader className="text-center bg-primary text-white">
          <h4>Tata Cara Pengisian Form Iuran Bulanan </h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            {/* Step 1: Pengisian Form */}
            <CCol md={6} className="mb-4">
              <CCard className="tutorial-card border border-dark">
                <CCardHeader className="tutorial-header">
                  1. Pengisian Form
                </CCardHeader>
                <CCardBody>
                  <section>
                    <ol className="tutorial-list">
                      <li>
                        Masuk ke menu <b>Form Iuran Bulanan</b>.
                      </li>
                      <li>
                        Harap mengisi secara <b>urut</b> dari atas mulai input
                        tahun.
                      </li>
                      <li>
                        Nilai Tahun dan Bulan diatur bisa dipilih{" "}
                        <b>lebih dari 1 Nilai </b> user bisa mengubahnya sesuai
                        kebutuhan.
                      </li>
                      <li>
                        Nilai default dari lingkungan disesuaikan dengan akun
                        yang dipakai user, hanya akun <b>admin</b> dan{" "}
                        <b>ketua wilayah </b>
                        yang dapat mengubah input lingkungan.
                      </li>
                      <li>
                        Isikan nominal iuran berupa angka (pastikan nominal
                        adalah kelipatan dari RP 10.000).
                      </li>
                      <li>
                        Kemudian pilih keluarga anggota. User dapat memilih
                        lebih dari 1 keluarga anggota. Pilihan yang tersedia di
                        dalam input keluarga anggota adalah semua keluarga
                        anggota pada lingkungan yang belum membayar kan iuran
                        pada tahun dan bulan yang dipilih.
                      </li>
                      <li>
                        Isi Sub Keterangan jika dibutuhkan atau kosongkan jika
                        tidak perlu.
                      </li>
                      <li>Upload bukti transfer.</li>
                      <li>
                        Sebelum menekan submit, pastikan data benar, hanya isian
                        sub Keterangan yang boleh kosong.
                      </li>
                    </ol>
                  </section>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={6} className="mb-4">
              <figure>
                <CImage
                  src={formOut}
                  alt="Step 1 - Image 1"
                  className="tutorial-image mb-3"
                />
                <figcaption className="image-caption">
                  Gambar 1: Tampilan Form Iuran Bulanan
                </figcaption>
              </figure>
              <figure>
                <CImage
                  src={formOut2}
                  alt="Step 1 - Image 2"
                  className="tutorial-image"
                />
                <figcaption className="image-caption">
                  Gambar 2: Input pada Form Iuran Bulanan
                </figcaption>
              </figure>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            {/* Step 2: Pengisian Nominal dan Keluarga Anggota yang Benar */}
            <CCol md={6} className="mb-4">
              <CCard className="tutorial-card border border-dark">
                <CCardHeader className="tutorial-header">
                  2. Pengisian Nominal dan Keluarga Anggota yang Benar
                </CCardHeader>
                <CCardBody>
                  <section>
                    <ol className="tutorial-list">
                      <li>
                        Harap mengisi form secara urut mulai input tahun sampai
                        file Bukti.
                      </li>
                      <li>
                        Pastikan nominal dan jumlah keluarga anggota yang
                        dipilih itu benar, misalkan nominal adalah 30.000
                        berarti user harus memilih 3 keluarga anggota.
                      </li>
                    </ol>
                  </section>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={6} className="mb-4">
              <figure>
                <CImage
                  src={successIuran}
                  alt="Step 2"
                  className="tutorial-image"
                />
                <figcaption className="image-caption">
                  Gambar 3: Contoh Input yang Berhasil
                </figcaption>
              </figure>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            {/* Step 3: Pengisian Nominal dan Keluarga Anggota yang Salah */}
            <CCol md={6} className="mb-4">
              <CCard className="tutorial-card border border-dark">
                <CCardHeader className="tutorial-header">
                  3. Pengisian Nominal dan Keluarga Anggota yang Salah
                </CCardHeader>
                <CCardBody className="text-dark">
                  <strong>Bagian 1:</strong>
                  <p>
                    Apabila nominal tidak merupakan kelipatan dari Rp 10.000
                    maka akan muncul error dan form tidak akan diterima.
                  </p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={6} className="mb-4">
              <figure>
                <CImage
                  src={nominalTidakValid}
                  alt="Error Nominal"
                  className="tutorial-image"
                />
                <figcaption className="image-caption">
                  Gambar 4: Contoh Input yang Gagal 1
                </figcaption>
              </figure>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol md={6} className="mb-4">
              <CCard className="tutorial-card border border-dark">
                <CCardBody className="text-dark">
                  <strong>Bagian 2:</strong>
                  <p>
                    Apabila user mengisi nominal Rp 10.000 lalu memilih lebih dari
                    1 keluarga pada input keluarga anggota, maka akan muncul
                    warning dan pilihan keluarga anggota yang terakhir tidak
                    akan ditambahkan di input.
                  </p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={6} className="mb-4">
              <figure>
                <CImage
                  src={keluargaTidakValid}
                  alt="Warning Keluarga Anggota"
                  className="tutorial-image"
                />
                <figcaption className="image-caption">
                  Gambar 5: Contoh Input yang Gagal 2
                </figcaption>
              </figure>
            </CCol>
          </CRow>

          <CRow className="mt-4">
            <CCol md={6} className="mb-4">
              <CCard className="tutorial-card border border-dark">
                <CCardBody className="text-dark">
                  <strong>Bagian 3:</strong>
                  <p>
                    Apabila user mengisi nominal Rp 30.000 lalu memilih hanya 2
                    keluarga pada input keluarga anggota, maka akan muncul error
                    jumlah keluarga kurang pada waktu menekan tombol submit dan
                    form tidak akan diterima.
                  </p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={6} className="mb-4">
              <figure>
                <CImage
                  src={jumlahKeluargaKurang}
                  alt="Error Jumlah Keluarga"
                  className="tutorial-image"
                />
                <figcaption className="image-caption">
                  Gambar 6: Contoh Input yang Gagal 3
                </figcaption>
              </figure>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default TutorialPageIuran;
