import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);

export const dateLongTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("DD MMMM BBBB");
};

export const dateShortTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("DD MMM BB");
};

export const dateLongEN = (date: Date) => {
  dayjs.locale("en");
  return dayjs(date).format("DD MMMM YYYY");
};

export const dateShortEN = (date: Date) => {
  dayjs.locale("en");
  return dayjs(date).format("DD MMM YY");
};

export const dayOfMonth = (date: Date) => {
  return dayjs(date).format("DD");
};

export const monthTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("MMMM");
};

export const monthEN = (date: Date) => {
  dayjs.locale("en");
  return dayjs(date).format("MMMM");
};
export const yearEN = (date: Date) => {
  dayjs.locale("en");
  return dayjs(date).format("YY");
};

export const yearTH = (date: Date) => {
  dayjs.locale("th");
  return dayjs(date).format("YY");
};
export const getStartOfToday = () => {
  return dayjs().startOf("day").toDate();
};
