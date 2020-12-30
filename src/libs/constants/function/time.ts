import moment from "moment";

export const convertDate = (date?: Date) => {
  let dateConvert = moment(date).format("DD/MM/YYYY");
  let today = moment(Date()).format("DD/MM/YYYY");
  return dateConvert === today ? "Hôm nay" : dateConvert;
};
const convertVN = (str: string, hours: number) => {
  return str
    .replaceAll("AM", "sáng")
    .replaceAll("PM", hours > 18 ? "tối" : "chiều");
};
export const convertDateTime = (date?: Date) => {
  if (!date) return 1;
  // console.log(date

  return convertVN(
    moment(date).format(" h:mm A  DD/MM/YY "),
    moment(date).hour()
  );
};
export const compareDate = (date?: Date, date2 = Date()) => {
  let date1 = moment(date);
  let date2Moment = moment(date2);

  return date1.isAfter(date2Moment);
};
export const compareDateNumber = (date?: Date, date2 = new Date()) => {
  if (!date) return 1;

  let dateMoment = moment(date);

  if (!dateMoment.isAfter(moment(date2))) return 0;

  var duration = moment.duration(dateMoment.diff(moment(date2)));
  var days = duration.days();

  return days + 1;
};
export const NumberDateJoin = (date?: Date, date2 = new Date()) => {
  if (!date) return 1;

  let dateMoment = moment(date2);

  if (!dateMoment.isAfter(moment(date))) return "1 ngày";

  var duration = moment.duration(dateMoment.diff(moment(date)));
  if (duration.days() === 0) return " 1 ngày";
  var days = duration.days() > 0 ? duration.days() + " ngày " : "";
  var year = duration.years() > 0 ? duration.years() + " năm " : "";
  var month = duration.months() > 0 ? duration.months() + " tháng " : "";

  return year + month + days;
};
