const bn = "০১২৩৪৫৬৭৮৯";
const en = "0123456789";

export function toBengaliDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[0-9]/g, (d) => bn[en.indexOf(d)]);
}

export function parseNumericPrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[০-৯]/g, (d) => String(bn.indexOf(d))).replace(/,/g, "").replace(/[^0-9.-]/g, "");
  if (!normalized || normalized === "-" || normalized === ".") return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatBanglaNumber(value: number | string | null | undefined, maximumFractionDigits = 2): string {
  const n = parseNumericPrice(value);
  if (n === null) return "—";
  return toBengaliDigits(new Intl.NumberFormat("en-US", { maximumFractionDigits, useGrouping: true }).format(n));
}

export function formatBanglaPrice(value: number | string | null | undefined): string {
  const formatted = formatBanglaNumber(value);
  return formatted === "—" ? formatted : `${formatted} টাকা`;
}

export function formatBanglaPercentage(value: number | string | null | undefined): string {
  const n = parseNumericPrice(value);
  if (n === null) return "০.০%";
  return `${toBengaliDigits(new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(Math.abs(n)))}%`;
}

export function formatBanglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}
