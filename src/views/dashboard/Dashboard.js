import React, { useEffect, useState } from "react";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import services from "../../services";
import { useAuth } from "../../hooks/useAuth";

const Dashboard = () => {
  const [totalWealth, setTotalWealth] = useState(null);
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalOutcome, setTotalOutcome] = useState(null);
  const [totalAnggota, setTotalAnggota] = useState(null);
  const [totalKeluarga, setTotalKeluarga] = useState(null);
  const [totalWilayah, setTotalWilayah] = useState(null);
  const [totalLingkungan, setTotalLingkungan] = useState(null);
  const { handleLogout } = useAuth();
  
  const [errors, setErrors] = useState({
    totalWealthError: false,
    totalIncomeError: false,
    totalOutcomeError: false,
    totalAnggotaError: false,
    totalKeluargaError: false,
    totalLingkunganError: false,
    totalWilayahError: false,
  });
  
  const [loading, setLoading] = useState(true);

  const handleLogoutError = async (error) => {
    if (error.response && error.response.status === 401) {
      await handleLogout();
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const income = await services.HistoryService.getTotalIncome();
        setTotalIncome(income.Nominal);
      } catch (error) {
        console.error("Error fetching total income:", error);
        setErrors(prevErrors => ({ ...prevErrors, totalIncomeError: true }));
        await handleLogoutError(error)
      }

      try {
        const outcome = await services.HistoryService.getTotalOutcome();
        setTotalOutcome(outcome.Nominal);
      } catch (error) {
        console.error("Error fetching total outcome:", error);
        setErrors(prevErrors => ({ ...prevErrors, totalOutcomeError: true }));
        await handleLogoutError(error)
      }

      try {
        const data = await services.AnggotaService.getTotalAnggota();
        setTotalAnggota(data.Total);
      } catch (error) {
        console.error("Error fetching total Anggota:", error);
        setErrors(prevErrors => ({ ...prevErrors, totalAnggotaError: true }));
        await handleLogoutError(error)
      }

      try {
        const data = await services.KeluargaService.getTotalKeluarga();
        setTotalKeluarga(data.Total);
      } catch (error) {
        console.error("Error fetching total Keluarga:", error);
        setErrors(prevErrors => ({ ...prevErrors, totalKeluargaError: true }));
        await handleLogoutError(error)
      }

      try {
        const data = await services.LingkunganService.getTotalLingkungan();
        setTotalLingkungan(data.Total);
      } catch (error) {
        console.error("Error fetching total Lingkungan:", error);
        setErrors(prevErrors => ({ ...prevErrors, totalLingkunganError: true }));
        await handleLogoutError(error)
      }

      try {
        const data = await services.WilayahService.getTotalWilayah();
        setTotalWilayah(data.Total);
      } catch (error) {
        console.error("Error fetching total Wilayah:", error);
        setErrors(prevErrors => ({ ...prevErrors, totalWilayahError: true }));
        await handleLogoutError(error)
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchTotalWealth = async () => {
      if(errors.totalIncomeError || errors.totalOutcomeError){
        setErrors(prevErrors => ({ ...prevErrors, totalWealthError: true }));
        await handleLogoutError(new Error('error getting wealth'))
        return
      }
      setTotalWealth(totalIncome-totalOutcome);

    }
    fetchTotalWealth()

  }, [totalIncome, totalOutcome, errors]);

  const wealthProps = { totalWealth, error: errors.totalWealthError, loading };
  const widgetsBrandProps = { 
    totalIncome, 
    totalIncomeError: errors.totalIncomeError, 
    loading,  
    totalOutcome, 
    totalOutcomeError: errors.totalOutcomeError,  
    totalAnggota, 
    totalAnggotaError: errors.totalAnggotaError,  
    totalKeluarga, 
    totalKeluargaError: errors.totalKeluargaError,  
    totalLingkungan, 
    totalLingkunganError: errors.totalLingkunganError,  
    totalWilayah, 
    totalWilayahError: errors.totalWilayahError
  };

  return (
    <>
      <WidgetsDropdown className="mb-4" {...wealthProps} />
      <WidgetsBrand className="mb-4" withCharts {...widgetsBrandProps} />
    </>
  );
};

export default Dashboard;
