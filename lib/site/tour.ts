import tourData from "../../data/tour.json";

export type Show = {
  id: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  city: string;
  venue: string;
  address?: string;
  capacity?: string;
  doors: string;
  price: number;
  status: "on-sale" | "sold-out";
  lat: number;
  lon: number;
};

export const shows = (tourData as Show[]).slice().sort((a, b) => a.date.localeCompare(b.date));
export const getShow = (id: string) => shows.find((s) => s.id === id);

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const LONG_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Parses the ISO string by hand: `new Date("1997-10-07")` is UTC and shifts a day in US timezones. */
const parts = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return { year: y, month: m - 1, day: d, weekday: new Date(Date.UTC(y, m - 1, d)).getUTCDay() };
};

export const dateParts = (iso: string) => {
  const p = parts(iso);
  return { month: MONTHS[p.month], day: String(p.day), year: p.year };
};

export const longDate = (iso: string) => {
  const p = parts(iso);
  return `${DAYS[p.weekday]}, ${LONG_MONTHS[p.month]} ${p.day}, ${p.year}`;
};

export const money = (n: number) => `$${n.toFixed(2)}`;
