import * as XLSX from "xlsx";

export const parseXlsxDate = (value) => {
  if (value === null || value === undefined || value === "") return "";

  // kalau sudah string (misalnya "10/12/1999")
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!isNaN(parsed)) {
      // manual format agar tidak geser timezone
      const yyyy = parsed.getFullYear();
      const mm = String(parsed.getMonth() + 1).padStart(2, "0");
      const dd = String(parsed.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    }
    return "";
  }

  // kalau Excel serial number
  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);
    if (!date) return "";
    // manual format, TANPA new Date()
    const yyyy = date.y;
    const mm = String(date.m).padStart(2, "0");
    const dd = String(date.d).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return "";
};
