import moment from "moment-timezone";
import "moment/locale/id";

moment.locale("id");

export const formatDateToID = (dateString, format = "YYYY-MM-DD") => {
  if (!dateString) return "-";
  return moment(dateString).tz("Asia/Jakarta").format(format);
};
