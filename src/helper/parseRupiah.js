const parseRupiah = (str) => {
  if (!str) return 0;
  // Hapus semua yang bukan digit
  return parseInt(str.toString().replace(/[^0-9]/g, ""), 10) || 0;
};
export default {
  parseRupiah,
};
