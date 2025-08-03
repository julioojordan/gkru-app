const formatToRupiah = (number) => {
  if (number === null || number === undefined || number === "") return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export default {
  formatToRupiah,
};
