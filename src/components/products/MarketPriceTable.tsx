import type { MarketPrice } from "@/types/product";
import { formatBanglaNumber } from "@/lib/bengali";

export function MarketPriceTable({ markets }: { markets: MarketPrice[] }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-white">
      <table className="w-full min-w-[680px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] text-[var(--muted)]">
            <th className="px-4 py-3 font-semibold">বাজার</th>
            <th className="px-4 py-3 font-semibold">বিভাগ</th>
            <th className="px-4 py-3 text-right font-semibold">সর্বনিম্ন</th>
            <th className="px-4 py-3 text-right font-semibold">সর্বাধিক</th>
            <th className="px-4 py-3 text-right font-semibold">গড়</th>
          </tr>
        </thead>

        <tbody>
          {markets.map((m, i) => (
            <tr
              key={`${m.market}-${i}`}
              className={`border-b border-[var(--border)] last:border-0 ${
                i % 2 === 0 ? "bg-[#fafcfb]" : "bg-[#f0f5f1]"
              }`}
            >
              <td className="px-4 py-3 font-medium">{m.market}</td>
              <td className="px-4 py-3">{m.division || "—"}</td>

              <td className="whitespace-nowrap px-4 py-3 text-right">
                {m.min == null ? "—" : `${formatBanglaNumber(m.min)} টাকা`}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right">
                {m.max == null ? "—" : `${formatBanglaNumber(m.max)} টাকা`}
              </td>

              <td className="whitespace-nowrap px-4 py-3 text-right font-semibold">
                {m.avg == null ? "—" : `${formatBanglaNumber(m.avg)} টাকা`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
